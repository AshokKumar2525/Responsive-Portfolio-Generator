<?php
session_start();

// Database connection
$servername = "localhost";
$username = "root"; 
$password = "Ashok@123"; 
$dbname = "portfolio";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Database connection failed']));
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    // Validate inputs
    if (empty($email) || empty($password)) {
        echo "<script>alert('All Fields Are Required.'); window.location.href = 'index.html';</script>";
        exit();
    }

    // Check if email exists
    $sql = "SELECT id, password FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 0) {
        echo "<script>alert('No Account Found With This Email!'); window.location.href = 'index.html';</script>";
        exit();
    }

    $stmt->bind_result($user_id, $hashed_password);
    $stmt->fetch();

    // Verify password
    if (!password_verify($password, $hashed_password)) {
        echo "<script>alert('Incorrect Password! Try again.'); window.location.href = 'index.html';</script>";
        exit();
    }

    // Store user ID in session
    $_SESSION['user_id'] = $user_id;
    $_SESSION['user_email'] = $email;
    header("Location: main.html");
    exit;
}

$conn->close();
?>