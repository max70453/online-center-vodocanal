<?php
require_once 'config.php';
require_once 'auth.php';

class Support {
    private $db;
    private $auth;

    public function __construct() {
        $this->db = getDBConnection();
        $this->auth = new Auth();
    }

    public function createTicket($subject, $message, $priority = 'normal') {
        if (!$this->auth->isLoggedIn()) {
            return ['success' => false, 'message' => 'Требуется авторизация'];
        }

        try {
            $stmt = $this->db->prepare("
                INSERT INTO support_tickets (
                    user_id, subject, message, priority, status, created_at
                ) VALUES (?, ?, ?, ?, 'open', NOW())
            ");
            $stmt->execute([
                $_SESSION['user_id'],
                $subject,
                $message,
                $priority
            ]);

            $ticketId = $this->db->lastInsertId();

            return [
                'success' => true,
                'message' => 'Тикет успешно создан',
                'ticket_id' => $ticketId
            ];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Ошибка при создании тикета: ' . $e->getMessage()];
        }
    }

    public function getTickets($status = 'all') {
        if (!$this->auth->isLoggedIn()) {
            return ['success' => false, 'message' => 'Требуется авторизация'];
        }

        try {
            $query = "
                SELECT st.*, u.full_name
                FROM support_tickets st
                JOIN users u ON st.user_id = u.id
                WHERE st.user_id = ?
            ";
            $params = [$_SESSION['user_id']];

            if ($status !== 'all') {
                $query .= " AND st.status = ?";
                $params[] = $status;
            }

            $query .= " ORDER BY st.created_at DESC";

            $stmt = $this->db->prepare($query);
            $stmt->execute($params);
            $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return ['success' => true, 'tickets' => $tickets];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Ошибка при получении тикетов: ' . $e->getMessage()];
        }
    }

    public function getTicketDetails($ticketId) {
        if (!$this->auth->isLoggedIn()) {
            return ['success' => false, 'message' => 'Требуется авторизация'];
        }

        try {
            // Get ticket details
            $stmt = $this->db->prepare("
                SELECT st.*, u.full_name
                FROM support_tickets st
                JOIN users u ON st.user_id = u.id
                WHERE st.id = ? AND st.user_id = ?
            ");
            $stmt->execute([$ticketId, $_SESSION['user_id']]);
            $ticket = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$ticket) {
                return ['success' => false, 'message' => 'Тикет не найден'];
            }

            // Get ticket responses
            $stmt = $this->db->prepare("
                SELECT str.*, u.full_name
                FROM support_ticket_responses str
                JOIN users u ON str.user_id = u.id
                WHERE str.ticket_id = ?
                ORDER BY str.created_at ASC
            ");
            $stmt->execute([$ticketId]);
            $responses = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'success' => true,
                'ticket' => $ticket,
                'responses' => $responses
            ];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Ошибка при получении деталей тикета: ' . $e->getMessage()];
        }
    }

    public function addResponse($ticketId, $message) {
        if (!$this->auth->isLoggedIn()) {
            return ['success' => false, 'message' => 'Требуется авторизация'];
        }

        try {
            // Check if ticket exists and belongs to user
            $stmt = $this->db->prepare("
                SELECT id FROM support_tickets
                WHERE id = ? AND user_id = ?
            ");
            $stmt->execute([$ticketId, $_SESSION['user_id']]);
            if ($stmt->rowCount() === 0) {
                return ['success' => false, 'message' => 'Тикет не найден'];
            }

            // Add response
            $stmt = $this->db->prepare("
                INSERT INTO support_ticket_responses (
                    ticket_id, user_id, message, created_at
                ) VALUES (?, ?, ?, NOW())
            ");
            $stmt->execute([$ticketId, $_SESSION['user_id'], $message]);

            return ['success' => true, 'message' => 'Ответ добавлен'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Ошибка при добавлении ответа: ' . $e->getMessage()];
        }
    }

    public function closeTicket($ticketId) {
        if (!$this->auth->isLoggedIn()) {
            return ['success' => false, 'message' => 'Требуется авторизация'];
        }

        try {
            $stmt = $this->db->prepare("
                UPDATE support_tickets
                SET status = 'closed',
                    closed_at = NOW()
                WHERE id = ? AND user_id = ?
            ");
            $stmt->execute([$ticketId, $_SESSION['user_id']]);

            if ($stmt->rowCount() === 0) {
                return ['success' => false, 'message' => 'Тикет не найден'];
            }

            return ['success' => true, 'message' => 'Тикет закрыт'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Ошибка при закрытии тикета: ' . $e->getMessage()];
        }
    }
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $support = new Support();
    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'create_ticket':
            $response = $support->createTicket(
                $_POST['subject'],
                $_POST['message'],
                $_POST['priority'] ?? 'normal'
            );
            break;

        case 'get_tickets':
            $response = $support->getTickets($_POST['status'] ?? 'all');
            break;

        case 'get_ticket_details':
            $response = $support->getTicketDetails($_POST['ticket_id']);
            break;

        case 'add_response':
            $response = $support->addResponse(
                $_POST['ticket_id'],
                $_POST['message']
            );
            break;

        case 'close_ticket':
            $response = $support->closeTicket($_POST['ticket_id']);
            break;

        default:
            $response = ['success' => false, 'message' => 'Неизвестное действие'];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
?> 