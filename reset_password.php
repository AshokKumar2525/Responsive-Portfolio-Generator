<?php
session_start();

// Verify OTP first
if (!isset($_SESSION['otp_verified']) || !$_SESSION['otp_verified']) {
    die("Access denied. Verify OTP first.");
}

// MongoDB setup
require 'mongodb_connection.php'; // Use our centralized connection

// Get MongoDB client
$client = MongoDBManager::getClient();
$collection = $client->portfolio->users;

// Get email from session
$email = $_SESSION['otp_data']['email'] ?? '';
if (empty($email)) die("Session error.");

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // Basic validation
    if (strlen($new_password) < 8) die("Password must be at least 8 characters.");
    if ($new_password !== $confirm_password) die("Passwords don't match.");

    // Hash and update password
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

    $updateResult = $collection->updateOne(
        ['email' => $email],
        ['$set' => ['password' => $hashed_password]]
    );

    if ($updateResult->getModifiedCount() > 0) {
        session_unset();
        session_destroy();
        echo "Password updated successfully! <a href='index.html'>Login now</a>.";
    } else {
        die("Error updating password. Try again.");
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5" style="max-width: 400px;">
        <div class="card">
            <div class="card-body">
                <h4>New Password</h4>
                <form method="POST">
                    <input type="password" class="form-control mb-3" name="password" placeholder="New password" required>
                    <input type="password" class="form-control mb-3" name="confirm_password" placeholder="Confirm password" required>
                    <button type="submit" class="btn btn-primary w-100">Update Password</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>