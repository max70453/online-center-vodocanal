<?php
require_once 'config.php';
require_once 'auth.php';

class Tariffs {
    private $db;
    private $auth;

    public function __construct() {
        $this->db = getDBConnection();
        $this->auth = new Auth();
    }

    public function getTariffs($category = 'all') {
        try {
            $query = "SELECT * FROM tariffs WHERE 1=1";
            $params = [];

            if ($category !== 'all') {
                $query .= " AND category = ?";
                $params[] = $category;
            }

            $query .= " ORDER BY price ASC";

            $stmt = $this->db->prepare($query);
            $stmt->execute($params);
            $tariffs = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return ['success' => true, 'tariffs' => $tariffs];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Ошибка при получении тарифов: ' . $e->getMessage()];
        }
    }

    public function calculateCost($squareMeters, $heatingType) {
        try {
            // Get base tariff for the heating type
            $stmt = $this->db->prepare("
                SELECT price_per_sqm
                FROM tariffs
                WHERE category = ? AND is_base = 1
                LIMIT 1
            ");
            $stmt->execute([$heatingType]);
            $tariff = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$tariff) {
                return ['success' => false, 'message' => 'Тариф не найден'];
            }

            // Calculate monthly cost
            $monthlyCost = $squareMeters * $tariff['price_per_sqm'];

            // Calculate yearly cost
            $yearlyCost = $monthlyCost * 12;

            return [
                'success' => true,
                'monthly_cost' => $monthlyCost,
                'yearly_cost' => $yearlyCost,
                'square_meters' => $squareMeters,
                'heating_type' => $heatingType
            ];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Ошибка при расчете стоимости: ' . $e->getMessage()];
        }
    }

    public function selectTariff($tariffId) {
        if (!$this->auth->isLoggedIn()) {
            return ['success' => false, 'message' => 'Требуется авторизация'];
        }

        try {
            // Check if tariff exists
            $stmt = $this->db->prepare("SELECT id FROM tariffs WHERE id = ?");
            $stmt->execute([$tariffId]);
            if ($stmt->rowCount() === 0) {
                return ['success' => false, 'message' => 'Тариф не найден'];
            }

            // Update user's tariff
            $stmt = $this->db->prepare("
                UPDATE users
                SET tariff_id = ?,
                    tariff_selected_at = NOW()
                WHERE id = ?
            ");
            $stmt->execute([$tariffId, $_SESSION['user_id']]);

            return ['success' => true, 'message' => 'Тариф успешно выбран'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Ошибка при выборе тарифа: ' . $e->getMessage()];
        }
    }

    public function getCurrentTariff() {
        if (!$this->auth->isLoggedIn()) {
            return ['success' => false, 'message' => 'Требуется авторизация'];
        }

        try {
            $stmt = $this->db->prepare("
                SELECT t.*
                FROM tariffs t
                JOIN users u ON t.id = u.tariff_id
                WHERE u.id = ?
            ");
            $stmt->execute([$_SESSION['user_id']]);
            $tariff = $stmt->fetch(PDO::FETCH_ASSOC);

            return [
                'success' => true,
                'tariff' => $tariff
            ];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Ошибка при получении текущего тарифа: ' . $e->getMessage()];
        }
    }
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tariffs = new Tariffs();
    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'get_tariffs':
            $response = $tariffs->getTariffs($_POST['category'] ?? 'all');
            break;

        case 'calculate_cost':
            $response = $tariffs->calculateCost(
                $_POST['square_meters'],
                $_POST['heating_type']
            );
            break;

        case 'select_tariff':
            $response = $tariffs->selectTariff($_POST['tariff_id']);
            break;

        case 'get_current_tariff':
            $response = $tariffs->getCurrentTariff();
            break;

        default:
            $response = ['success' => false, 'message' => 'Неизвестное действие'];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
?> 