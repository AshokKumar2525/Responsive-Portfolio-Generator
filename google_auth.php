<?php
session_start();
require 'mongodb_connection.php';

$client = MongoDBManager::getClient();
$db = $client->portfolio;
$users = $db->users;

// Parse JSON input
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$name = $data['name'] ?? '';
$uid = $data['uid'] ?? '';

if (empty($email)) {
    echo json_encode(["success" => false, "message" => "Missing email."]);
    exit();
}

// Check if user exists
$user = $users->findOne(['email' => $email]);

if (!$user) {
    echo json_encode(["success" => true, "needs_password" => true]);
    exit();
} else {
    $_SESSION['user_id'] = (string)$user['_id'];
}

$_SESSION['user_email'] = $email;
echo json_encode(["success" => true]);
?>
