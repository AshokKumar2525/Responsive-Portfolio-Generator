<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'mongodb_connection.php';

// Get MongoDB client
$client = MongoDBManager::getClient();
$db = $client->portfolio;
$users = $db->users;

// Get form data
$email = trim($_POST['email']);
$password = trim($_POST['password']);

if (empty($email) || empty($password)) {
    echo "<script>alert('Fields cannot be empty!'); window.location.href = 'index.html';</script>";
    exit();
}

// Check if email already exists
$existingUser = $users->findOne(['email' => $email]);

if ($existingUser) {
    echo "<script>alert('User already exists! Please log in.'); window.location.href = 'index.html';</script>";
    exit();
}

// Hash the password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert new user
$result = $users->insertOne([
    'email' => $email,
    'password' => $hashed_password
]);

// Store user ID in session
$_SESSION['user_id'] = (string)$result->getInsertedId();
$_SESSION['user_email'] = $email;

// Redirect to dashboard
header("Location: main.html?newUser=true");
exit();
?>