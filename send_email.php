<?php
session_start();
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';


if (!isset($_POST['name'], $_POST['email'], $_POST['message'])) {
    error_log("Invalid form data received");
    echo json_encode(['success' => false, 'error' => 'Invalid form data']);
    exit;
}


// Verify session email
if (!isset($_SESSION['user_email'])) {
    error_log("No user_email in session");
    echo json_encode(['success' => false, 'error' => 'Session expired']);
    exit;
}

$mail = new PHPMailer(true);
try {
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'ashokkumarmalineni25@gmail.com';
    $mail->Password = 'ybpu pirp poso rths';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->SMTPDebug = 2;

    // Recipients
    $mail->setFrom($_POST['email'], $_POST['name']);
    $mail->addAddress($_SESSION['user_email']);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Submission from Portfolio';
    $mail->Body = sprintf(
        "<h1>New Message</h1>
        <p><strong>Name:</strong> %s</p>
        <p><strong>Email:</strong> %s</p>
        <p><strong>Message:</strong> %s</p>",
        htmlspecialchars($_POST['name']),
        htmlspecialchars($_POST['email']),
        nl2br(htmlspecialchars($_POST['message']))
    );

    if ($mail->send()) {
        header("Location: portfolio.html");

    } else {
        throw new Exception('Send returned false');
    }
} catch (Exception $e) {
    error_log("Email sending failed: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => "Message could not be sent. Please try again later.",
        "debug" => $e->getMessage()
    ]);
}