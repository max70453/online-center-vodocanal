<?php
require_once 'config.php';
require_once 'auth.php';

class Account {
    private $db;
    private $auth;

    public function __construct() {
        $this->db = getDBConnection();
        $this->auth = new Auth();
    }

    public function getAccountBalance() {
        if (!$this->auth->isLoggedIn()) {
            return ['success' => false, 'message' => 'Требуется авторизация'];
        }

        try {
            $stmt = $this->db->prepare("
                SELECT balance, last_payment_date, next_payment_date
                FROM account_balances
                WHERE user_id = ?
            ");
            $stmt->execute([$_SESSION['user_id']]);
            $balance = $stmt->fetch(PDO::FETCH_ASSOC);

            return [
                'success' => true,
                'balance' => $balance['balance'] ?? 0,
                'last_payment_date' => $balance['last_payment_date'] ?? null,
                'next_payment_date' => $balance['next_payment_date'] ?? null
            ];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Ошибка при получении баланса: ' . $e->getMessage()];
        }
    }

    public function getPaymentHistory($type = 'all', $period = null) {
        if (!$this->auth->isLoggedIn()) {
            return ['success' => false, 'message' => 'Требуется авторизация'];
        }

        try {
            $query = "
                SELECT ph.*, t.name as tariff_name
                FROM payment_history ph
                LEFT JOIN tariffs t ON ph.tariff_id = t.id
                WHERE ph.user_id = ?
            ";
            $params = [$_SESSION['user_id']];

            if ($type !== 'all') {
                $query .= " AND ph.type = ?";
                $params[] = $type;
            }

            if ($period) {
                $query .= " AND DATE(ph.created_at) BETWEEN ? AND ?";
                $params[] = $period['start'];
                $params[] = $period['end'];
            }

            $query .= " ORDER BY ph.created_at DESC";

            $stmt = $this->db->prepare($query);
            $stmt->execute($params);
            $history = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return ['success' => true, 'history' => $history];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Ошибка при получении истории платежей: ' . $e->getMessage()];
        }
    }

    public function processPayment($amount, $paymentMethod) {
        if (!$this->auth->isLoggedIn()) {
            return ['success' => false, 'message' => 'Требуется авторизация'];
        }

        try {
            $this->db->beginTransaction();

            // Record payment
            $stmt = $this->db->prepare("
                INSERT INTO payment_history (user_id, amount, type, payment_method, created_at)
                VALUES (?, ?, 'payment', ?, NOW())
            ");
            $stmt->execute([$_SESSION['user_id'], $amount, $paymentMethod]);

            // Update balance
            $stmt = $this->db->prepare("
                UPDATE account_balances
                SET balance = balance + ?,
                    last_payment_date = NOW()
                WHERE user_id = ?
            ");
            $stmt->execute([$amount, $_SESSION['user_id']]);

            $this->db->commit();
            return ['success' => true, 'message' => 'Платеж успешно обработан'];
        } catch (PDOException $e) {
            $this->db->rollBack();
            return ['success' => false, 'message' => 'Ошибка при обработке платежа: ' . $e->getMessage()];
        }
    }

    public function generateReceipt($paymentId) {
        if (!$this->auth->isLoggedIn()) {
            return ['success' => false, 'message' => 'Требуется авторизация'];
        }

        try {
            $stmt = $this->db->prepare("
                SELECT ph.*, u.full_name, u.account_number
                FROM payment_history ph
                JOIN users u ON ph.user_id = u.id
                WHERE ph.id = ? AND ph.user_id = ?
            ");
            $stmt->execute([$paymentId, $_SESSION['user_id']]);
            $payment = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$payment) {
                return ['success' => false, 'message' => 'Платеж не найден'];
            }

            // Generate receipt HTML
            $receipt = "
                <div class='receipt'>
                    <h2>Квитанция об оплате</h2>
                    <p>Дата: " . date('d.m.Y H:i', strtotime($payment['created_at'])) . "</p>
                    <p>ФИО: " . htmlspecialchars($payment['full_name']) . "</p>
                    <p>Лицевой счет: " . htmlspecialchars($payment['account_number']) . "</p>
                    <p>Сумма: " . number_format($payment['amount'], 2) . " ₽</p>
                    <p>Способ оплаты: " . htmlspecialchars($payment['payment_method']) . "</p>
                </div>
            ";

            return ['success' => true, 'receipt' => $receipt];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Ошибка при генерации квитанции: ' . $e->getMessage()];
        }
    }
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $account = new Account();
    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'get_balance':
            $response = $account->getAccountBalance();
            break;

        case 'get_payment_history':
            $response = $account->getPaymentHistory(
                $_POST['type'] ?? 'all',
                $_POST['period'] ?? null
            );
            break;

        case 'process_payment':
            $response = $account->processPayment(
                $_POST['amount'],
                $_POST['payment_method']
            );
            break;

        case 'generate_receipt':
            $response = $account->generateReceipt($_POST['payment_id']);
            break;

        default:
            $response = ['success' => false, 'message' => 'Неизвестное действие'];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
?> 