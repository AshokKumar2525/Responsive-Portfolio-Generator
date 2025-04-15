<?php
session_start();

if (!isset($_SESSION['otp_data'])) {
    die("Invalid OTP request.");
}

$otp_data = $_SESSION['otp_data'];
$email = $_GET['email'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_otp = filter_input(INPUT_POST, 'otp', FILTER_SANITIZE_NUMBER_INT);
    
    // Check if OTP is expired
    if (time() > $otp_data['expiry']) {
        die("OTP has expired. Please request a new one.");
    }
    
    // Verify OTP
    if ($user_otp == $otp_data['otp']) {
        $_SESSION['otp_verified'] = true;
        header("Location: reset_password.php");
        exit();
    } else {
        die("Invalid OTP. Please try again.");
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Verify OTP</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container mt-5" style="max-width: 400px;">
    <div class="card">
        <div class="card-body">
            <h4 class="card-title">Verify OTP</h4>
            <p class="text-muted">Enter the OTP sent to <?= htmlspecialchars($email) ?></p>
            <form method="POST">
                <div class="mb-3">
                    <input type="text" class="form-control" name="otp" placeholder="6-digit OTP" required maxlength="6">
                </div>
                <button type="submit" class="btn btn-primary w-100">Verify</button>
            </form>
        </div>
    </div>
</div>
</body>
</html>