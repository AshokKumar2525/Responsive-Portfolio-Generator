<?php
session_start();

// Verify OTP first
if (!isset($_SESSION['otp_verified']) || !$_SESSION['otp_verified']) {
    die("Access denied. Verify OTP first.");
}

// MongoDB setup
require 'mongodb_connection.php';

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
    if (strlen($new_password) < 8) {
        echo "<div class='alert alert-danger'>Password must be at least 8 characters.</div>";
        exit();
    }
    if ($new_password !== $confirm_password) {
        echo "<div class='alert alert-danger'>Passwords don't match.</div>";
        exit();
    }

    // Hash and update password
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

    $updateResult = $collection->updateOne(
        ['email' => $email],
        ['$set' => ['password' => $hashed_password]]
    );

    if ($updateResult->getModifiedCount() > 0) {
        session_unset();
        session_destroy();
        // Show the success message HTML above
        exit();
    } else {
        echo "<div class='alert alert-danger'>Error updating password. Try again.</div>";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Password Reset Success | Portfolio System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <style>
        :root {
            --primary-color: #1abc9c;
            --secondary-color: #2c3e50;
            --success-color: #28a745;
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
        
        .success-card {
            background: rgba(255, 255, 255, 0.98);
            border-radius: 12px;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
            padding: 2.5rem;
            max-width: 500px;
            text-align: center;
            animation: fadeInUp 0.6s ease;
        }
        
        .success-icon {
            font-size: 4rem;
            color: var(--success-color);
            margin-bottom: 1.5rem;
            animation: bounce 1s;
        }
        
        .success-title {
            color: var(--secondary-color);
            font-weight: 700;
            margin-bottom: 1rem;
        }
        
        .success-message {
            color: #555;
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }
        
        .btn-success {
            background-color: var(--success-color);
            border: none;
            padding: 0.8rem 2rem;
            font-size: 1rem;
            font-weight: 500;
            border-radius: 6px;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        
        .btn-success:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
        }
        
        .btn-success i {
            margin-right: 8px;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
            40% {transform: translateY(-20px);}
            60% {transform: translateY(-10px);}
        }
    </style>
</head>
<body>
    <div class="success-card">
        <i class="bi bi-check-circle-fill success-icon"></i>
        <h2 class="success-title">Password Updated Successfully!</h2>
        <p class="success-message">Your password has been changed. You can now login with your new credentials.</p>
        <a href="index.html" class="btn btn-success">
            <i class="bi bi-box-arrow-in-right"></i> Continue to Login
        </a>
    </div>
</body>
</html>