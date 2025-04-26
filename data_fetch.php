<?php
session_start();
header('Content-Type: application/json');

// MongoDB Connection
require 'vendor/autoload.php'; // Required if using Composer for MongoDB

require 'mongodb_connection.php';

// Get MongoDB client
$client = MongoDBManager::getClient();
$collection = $client->portfolio->details;

// Check if user is logged in
$user_id = $_SESSION['user_id'] ?? null;
if (!$user_id) {
    die(json_encode(["error" => "User not logged in"]));
}

// Fetch user document from MongoDB
$user = $collection->findOne(["user_id" => $user_id]);

if (!$user) {
    die(json_encode(["error" => "User data not found."]));
}

// Decode JSON fields directly (MongoDB stores as arrays/documents)
$education = $user['education'] ?? [];
$projects = $user['projects'] ?? [];
$experience = $user['experience'] ?? [];
$certifications = $user['certifications'] ?? [];

$certification_files = [];
foreach ($certifications as $cert_path) {
    if (file_exists($cert_path)) {
        $certification_files[] = $cert_path;
    }
}

echo json_encode([
    "name" => $user['name'] ?? "",
    "email" => $user['email'] ?? "",
    "mobile" => $user['mobile'] ?? "",
    "skills" => $user['skills'] ?? "",
    "job_roles" => $user['job_roles'] ?? "",
    "github_link" => $user['github_link'] ?? "",
    "linkedin_link" => $user['linkedin_link'] ?? "",
    "instagram_link" => $user['instagram_link'] ?? "",
    "about" => $user['about'] ?? "",
    "achievements" => $user['achievements'] ?? "",
    "education" => $education,
    "projects" => $projects,
    "experience" => $experience,
    "certifications" => $certification_files,
    "photo_url" => $user['image_url'] ?? ""
]);
?>
