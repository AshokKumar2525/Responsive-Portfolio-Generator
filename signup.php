<?php
// Enable error reporting for debugging
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root";  // Change if needed
$password = "Ashok@123";  // Change if needed
$dbname = "portfolio";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get form data
$email = trim($_POST['email']);
$password = trim($_POST['password']);

if (empty($email) || empty($password)) {
    echo "<script>alert('Fields cannot be empty!'); window.location.href = 'index.html';</script>";
    exit(); // Add this to stop further execution
}

// Check if email already exists
$sql_check = "SELECT id FROM users WHERE email = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    // Email already exists, show alert and redirect to login
    echo "<script>alert('User already exists! Please log in.'); window.location.href = 'index.html';</script>";
    $stmt_check->close();
    $conn->close();
    exit(); // Add this to stop further execution
}
$stmt_check->close();

// Hash the password for security
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert into database
$sql = "INSERT INTO users (email, password) VALUES (?,?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $hashed_password);

if ($stmt->execute()) {
    // Get the newly created user ID
    $user_id = $stmt->insert_id;

    // Store user ID in session (User is now logged in)
    $_SESSION['user_id'] = $user_id;
    $_SESSION["user_email"] = $email;

    // Redirect to dashboard
    header("Location: main.html?newUser=true");
} else {
    echo "<script>alert('Error creating account! Try again.'); window.location.href = 'index.html';</script>";
    $stmt->close();
    $conn->close();
}

$stmt->close();
$conn->close();
?>