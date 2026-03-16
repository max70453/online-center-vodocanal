<?php
require_once 'config.php';

class Auth {
    private $db;

    public function __construct() {
        $this->db = getDBConnection();
    }

    public function register($fullName, $email, $password, $accountNumber) {
        try {
            // Check if user already exists
            $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->rowCount() > 0) {
                return ['success' => false, 'message' => 'Пользователь с таким email уже существует'];
            }

            // Hash password
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Insert new user
            $stmt = $this->db->prepare("
                INSERT INTO users (full_name, email, password, account_number, created_at)
                VALUES (?, ?, ?, ?, NOW())
            ");
            $stmt->execute([$fullName, $email, $hashedPassword, $accountNumber]);

            return ['success' => true, 'message' => 'Регистрация успешно завершена'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Ошибка при регистрации: ' . $e->getMessage()];
        }
    }

    public function login($email, $password) {
        try {
            $stmt = $this->db->prepare("SELECT id, full_name, email, password, account_number FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                // Set session variables
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['full_name'] = $user['full_name'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['account_number'] = $user['account_number'];

                return ['success' => true, 'message' => 'Вход выполнен успешно'];
            }

            return ['success' => false, 'message' => 'Неверный email или пароль'];
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Ошибка при входе: ' . $e->getMessage()];
        }
    }

    public function logout() {
        session_destroy();
        return ['success' => true, 'message' => 'Выход выполнен успешно'];
    }

    public function isLoggedIn() {
        return isset($_SESSION['user_id']);
    }

    public function getCurrentUser() {
        if ($this->isLoggedIn()) {
            return [
                'id' => $_SESSION['user_id'],
                'full_name' => $_SESSION['full_name'],
                'email' => $_SESSION['email'],
                'account_number' => $_SESSION['account_number']
            ];
        }
        return null;
    }
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $auth = new Auth();
    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'register':
            $response = $auth->register(
                $_POST['full_name'],
                $_POST['email'],
                $_POST['password'],
                $_POST['account_number']
            );
            break;

        case 'login':
            $response = $auth->login(
                $_POST['email'],
                $_POST['password']
            );
            break;

        case 'logout':
            $response = $auth->logout();
            break;

        default:
            $response = ['success' => false, 'message' => 'Неизвестное действие'];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
?> 