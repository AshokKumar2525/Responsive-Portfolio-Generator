<?php
header('Content-Type: application/json');
session_start();

require 'vendor/autoload.php';
require 'mongodb_connection.php';

// Get MongoDB client
$client = MongoDBManager::getClient();
$collection = $client->portfolio->details;

// First try to get user_id from session, then from GET/POST
$user_id = $_SESSION['user_id'] ?? $_GET['user_id'] ?? $_POST['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(["success" => false, "error" => "User not identified"]);
    exit;
}

// Find user by ID first, then fallback to email
$user = $collection->findOne(['user_id' => $user_id]);
if (!$user && isset($_SESSION['user_email'])) {
    $user = $collection->findOne(['email' => $_SESSION['user_email']]);
}

if (!$user) {
    echo json_encode(["success" => false, "error" => "User data not found"]);
    exit;
}

// Prepare response data
$data = [
    "success" => true,
    "name" => $user['name'] ?? "",
    "job_roles" => $user['job_roles'] ?? "",
    "email" => $user['email'] ?? "",
    "mobile" => $user['mobile'] ?? "",
    "skills" => $user['skills'] ?? "",
    "about" => $user['about'] ?? "",
    "github_link" => $user['github_link'] ?? "",
    "linkedin_link" => $user['linkedin_link'] ?? "",
    "instagram_link" => $user['instagram_link'] ?? "",
    "photo_url" => $user['image_url'] ?? "/static/images/placeholder.jpg",
    "education" => $user['education'] ?? [],
    "projects" => $user['projects'] ?? [],
    "experience" => $user['experience'] ?? [],
    "certifications" => $user['certifications'] ?? [],
    "achievements" => isset($user['achievements']) ? (is_array($user['achievements'])) ? $user['achievements'] : explode("\n", $user['achievements']) : []
];

echo json_encode($data);
?>