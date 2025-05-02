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

$showForm = true;
$error = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    // Basic validation
    if (strlen($new_password) < 8) {
        $error = "Password must be at least 8 characters.";
    } elseif ($new_password !== $confirm_password) {
        $error = "Passwords don't match.";
    } else {
        // Hash and update password
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

        $updateResult = $collection->updateOne(
            ['email' => $email],
            ['$set' => ['password' => $hashed_password]]
        );

        if ($updateResult->getModifiedCount() > 0) {
            $showForm = false;
            session_unset();
            session_destroy();
        } else {
            $error = "Error updating password. Try again.";
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Reset Password | Portfolio System</title>
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
        
        .card {
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
        
        .card-title {
            color: var(--secondary-color);
            font-weight: 700;
            margin-bottom: 1rem;
        }
        
        .card-message {
            color: #555;
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }
        
        .btn-primary {
            background-color: var(--primary-color);
            border: none;
            padding: 0.8rem 2rem;
            font-size: 1rem;
            font-weight: 500;
            border-radius: 6px;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(26, 188, 156, 0.3);
        }
        
        .btn-success {
            background-color: var(--success-color);
            border: none;
            padding: 0.8rem 2rem;
            font-size: 1rem;
            font-weight: 500;
            border-radius: 6px;
            transition: all 0.3s ease;
        }
        
        .password-strength {
            height: 5px;
            background: #eee;
            margin-top: 5px;
            margin-bottom: 15px;
            border-radius: 5px;
            overflow: hidden;
        }
        
        .password-strength-bar {
            height: 100%;
            width: 0%;
            background: red;
            transition: all 0.3s;
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
    <?php if (!$showForm): ?>
        <!-- Success Message -->
        <div class="card">
            <i class="bi bi-check-circle-fill success-icon"></i>
            <h2 class="card-title">Password Updated Successfully!</h2>
            <p class="card-message">Your password has been changed. You can now login with your new credentials.</p>
            <a href="index.html" class="btn btn-success">
                <i class="bi bi-box-arrow-in-right"></i> Continue to Login
            </a>
        </div>
    <?php else: ?>
        <!-- Password Reset Form -->
        <div class="card">
            <i class="bi bi-key-fill success-icon" style="color: var(--primary-color);"></i>
            <h2 class="card-title">Reset Your Password</h2>
            <p class="card-message">Please enter a new password for <?= htmlspecialchars($email) ?></p>
            
            <?php if ($error): ?>
                <div class="alert alert-danger"><?= $error ?></div>
            <?php endif; ?>
            
            <form method="POST" id="resetForm">
                <div class="mb-3 text-start">
                    <label for="password" class="form-label">New Password</label>
                    <input type="password" class="form-control" id="password" name="password" 
                           placeholder="At least 8 characters" required minlength="8">
                    <div class="password-strength">
                        <div class="password-strength-bar" id="passwordStrength"></div>
                    </div>
                </div>
                <div class="mb-3 text-start">
                    <label for="confirm_password" class="form-label">Confirm Password</label>
                    <input type="password" class="form-control" id="confirm_password" name="confirm_password" 
                           placeholder="Re-enter your password" required minlength="8">
                </div>
                <button type="submit" class="btn btn-primary w-100">
                    <i class="bi bi-arrow-repeat"></i> Reset Password
                </button>
            </form>
        </div>
        
        <script>
            // Password strength indicator
            document.getElementById('password').addEventListener('input', function(e) {
                const password = e.target.value;
                const strengthBar = document.getElementById('passwordStrength');
                let strength = 0;
                
                if (password.length >= 8) strength += 1;
                if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
                if (password.match(/[0-9]/)) strength += 1;
                if (password.match(/[^a-zA-Z0-9]/)) strength += 1;
                
                // Update strength bar
                switch(strength) {
                    case 0:
                        strengthBar.style.width = '0%';
                        strengthBar.style.backgroundColor = 'red';
                        break;
                    case 1:
                        strengthBar.style.width = '25%';
                        strengthBar.style.backgroundColor = 'red';
                        break;
                    case 2:
                        strengthBar.style.width = '50%';
                        strengthBar.style.backgroundColor = 'orange';
                        break;
                    case 3:
                        strengthBar.style.width = '75%';
                        strengthBar.style.backgroundColor = 'yellowgreen';
                        break;
                    case 4:
                        strengthBar.style.width = '100%';
                        strengthBar.style.backgroundColor = 'green';
                        break;
                }
            });
            
            // Form validation
            document.getElementById('resetForm').addEventListener('submit', function(e) {
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirm_password').value;
                
                if (password !== confirmPassword) {
                    e.preventDefault();
                    alert('Passwords do not match!');
                }
            });
        </script>
    <?php endif; ?>
</body>
</html>