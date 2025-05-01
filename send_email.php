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

// Sanitize input data to prevent XSS or injection attacks
$name = htmlspecialchars($_POST['name']);
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$message = nl2br(htmlspecialchars($_POST['message']));

// Verify email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    error_log("Invalid email format: $email");
    echo json_encode(['success' => false, 'error' => 'Invalid email format']);
    exit;
}

$mail = new PHPMailer(true);
try {
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host = getenv('SMTP_HOST') ?: 'yours'; // Use environment variable for security
    $mail->SMTPAuth = true;
    $mail->Username = getenv('SMTP_USERNAME') ?: 'yours'; // Environment variable for email
    $mail->Password = getenv('SMTP_PASSWORD') ?: 'yours'; // Environment variable for password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->SMTPDebug = 0; // Disable SMTP debugging in production

    // Recipients
    $mail->setFrom($email, $name);
    $mail->addAddress($_SESSION['user_email']);

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Submission from Portfolio';
    $mail->Body = sprintf(
        "<h1>New Message</h1>
        <p><strong>Name:</strong> %s</p>
        <p><strong>Email:</strong> %s</p>
        <p><strong>Message:</strong> %s</p>",
        $name,
        $email,
        $message
    );

    if ($mail->send()) {
        header("Location: portfolio.html");
        exit;
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
?>
