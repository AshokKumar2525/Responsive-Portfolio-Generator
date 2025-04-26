<?php
session_start();

if (!isset($_SESSION['otp_data'])) {
    die("Invalid OTP request.");
}

$otp_data = $_SESSION['otp_data'];
$email = $_GET['email'] ?? '';

// Handle OTP form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_otp = filter_input(INPUT_POST, 'otp', FILTER_SANITIZE_NUMBER_INT);

    // Check OTP expiration
    if (time() > $otp_data['expiry']) {
        unset($_SESSION['otp_data']); // Clean up expired OTP
        die("OTP has expired. Please request a new one.");
    }

    // Validate OTP
    if ($user_otp == $otp_data['otp']) {
        $_SESSION['otp_verified'] = true;
        $_SESSION['verified_email'] = $otp_data['email'];
        header("Location: reset_password.php");
        exit();
    } else {
        $error = "Invalid OTP. Please try again.";
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

            <?php if (!empty($error)): ?>
                <div class="alert alert-danger"><?= $error ?></div>
            <?php endif; ?>

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
