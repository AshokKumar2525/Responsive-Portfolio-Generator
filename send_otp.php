<?php
session_start();
require 'vendor/autoload.php'; // PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Database connection
$con = mysqli_connect("localhost", "root", "Ashok@123", "portfolio");
if (!$con) die("Database connection failed: " . mysqli_connect_error());

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = mysqli_real_escape_string($con, $_POST['email']);

    // Check if email exists
    $stmt = mysqli_prepare($con, "SELECT id FROM users WHERE email = ?");
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if (mysqli_num_rows($result) > 0) {
        // Generate OTP
        $otp = rand(100000, 999999);
        $expiry = time() + 300; // 5 minutes

        // Store in session
        $_SESSION['otp_data'] = [
            'otp' => $otp,
            'expiry' => $expiry,
            'email' => $email
        ];

        // Send OTP via SMTP
        $mail = new PHPMailer(true);
        try {
            // SMTP Configuration (Update with your details)
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'ashokkumarmalineni25@gmail.com';
            $mail->Password = 'ybpu pirp poso rths';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = 465;

            $mail->setFrom('noreply@gmail.com', 'Portfolio App');
            $mail->addAddress($email);
            $mail->Subject = 'Password Reset OTP';
            $mail->Body = "Your OTP is: $otp (Valid for 5minutes)";

            $mail->send();
            header("Location: verify_otp.php?email=" . urlencode($email));
            exit();
        } catch (Exception $e) {
            die("Failed to send OTP: " . $e->getMessage());
        }
    } else {
        die("Email not found in our system.");
    }
    mysqli_close($con);
}
?>