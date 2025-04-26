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
    <title>Verify OTP - Portfolio System</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <style>
        :root {
            --primary-color: #1abc9c;
            --secondary-color: #2c3e50;
        }
        
        body {
            font-family: 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(rgba(44, 62, 80, 0.9), rgba(44, 62, 80, 0.9)), 
                        url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
            background-size: cover;
            background-position: center;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.95);
            border: none;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            color: #333;
        }
        
        .card-title {
            color: var(--secondary-color);
            font-weight: 600;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .card-title i {
            margin-right: 10px;
            color: var(--primary-color);
        }
        
        .btn-primary {
            background-color: var(--primary-color);
            border: none;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            background-color: var(--secondary-color);
            transform: translateY(-2px);
        }
        
        .text-muted {
            color: #6c757d !important;
        }
    </style>
</head>
<body>
<div class="container mt-5" style="max-width: 400px;">
    <div class="card">
        <div class="card-body">
        <h4 class="card-title"><i class="bi bi-shield-lock"></i> Verify OTP</h4>
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
