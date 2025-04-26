<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// require 'vendor/autoload.php'; // MongoDB PHP library
require 'mongodb_connection.php';

// Get MongoDB client
$client = MongoDBManager::getClient();
$db = $client->portfolio;
$users = $db->users;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    // Validate inputs
    if (empty($email) || empty($password)) {
        echo "<script>alert('All Fields Are Required.'); window.location.href = 'index.html';</script>";
        exit();
    }

    // Find user by email
    $user = $users->findOne(['email' => $email]);

    if (!$user) {
        echo "<script>alert('No Account Found With This Email!'); window.location.href = 'index.html';</script>";
        exit();
    }

    // Verify password
    if (!password_verify($password, $user['password'])) {
        echo "<script>alert('Incorrect Password! Try again.'); window.location.href = 'index.html';</script>";
        exit();
    }

    // Store user ID in session
    $_SESSION['user_id'] = (string)$user['_id'];
    $_SESSION['user_email'] = $email;

    header("Location: main.html");
    exit;
}
?>
