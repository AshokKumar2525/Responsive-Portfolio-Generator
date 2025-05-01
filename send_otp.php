<?php
session_start();
require 'vendor/autoload.php'; // Load PHPMailer
require 'mongodb_connection.php'; // Load our MongoDB connection manager

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Get MongoDB client from our connection manager
$client = MongoDBManager::getClient();
$collection = $client->portfolio->users;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);

    // Check if user exists in MongoDB
    $user = $collection->findOne(['email' => $email]);

    if ($user) {
        // Generate OTP
        $otp = rand(100000, 999999);
        $expiry = time() + 300; // 5 minutes

        // Store OTP data in session
        $_SESSION['otp_data'] = [
            'otp' => $otp,
            'expiry' => $expiry,
            'email' => $email
        ];

        // Send OTP using PHPMailer
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com'; // Use your SMTP server
            $mail->SMTPAuth = true;
            $mail->Username = ''; // Your Gmail
            $mail->Password = ''; // App Password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = 465;

            $mail->setFrom('noreply@gmail.com', 'Portfolio App');
            $mail->addAddress($email);
            $mail->Subject = 'Password Reset OTP';
            $mail->Body = "Your OTP is: $otp (Valid for 5 minutes)";

            $mail->send();

            // Redirect to OTP verification page
            header("Location: verify_otp.php?email=" . urlencode($email));
            exit();
        } catch (Exception $e) {
            die("Failed to send OTP: " . $e->getMessage());
        }
    } else {
        die("Email not found in our system.");
    }
}
?>