<?php
session_start();

// Verify OTP first
if (!isset($_SESSION['otp_verified']) || !$_SESSION['otp_verified']) {
    die("Access denied. Verify OTP first.");
}

// Database connection
$con = mysqli_connect("localhost", "root", "Ashok@123", "portfolio");
if (!$con) die("Database connection failed: " . mysqli_connect_error());

$email = $_SESSION['otp_data']['email'] ?? '';
if (empty($email)) die("Session error.");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // Validate
    if (strlen($new_password) < 8) die("Password must be at least 8 characters.");
    if ($new_password !== $confirm_password) die("Passwords don't match.");

    // Update password in database
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
    $stmt = mysqli_prepare($con, "UPDATE users SET password = ? WHERE email = ?");
    mysqli_stmt_bind_param($stmt, "ss", $hashed_password, $email);
    
    if (mysqli_stmt_execute($stmt)) {
        // Clear session
        session_unset();
        session_destroy();
        echo "Password updated successfully! <a href='index.html'>Login now</a>.";
    } else {
        die("Error updating password: " . mysqli_error($con));
    }
    mysqli_close($con);
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