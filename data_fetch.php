<?php
// 1. Start session ONLY if it doesn't exist
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');

// MongoDB Connection
require 'vendor/autoload.php'; // Required if using Composer for MongoDB

require 'mongodb_connection.php';

// Get MongoDB client
$client = MongoDBManager::getClient();
$collection = $client->portfolio->details;

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    die(json_encode(["error" => "User not logged in"]));
}

$user_id = $_SESSION['user_id'];
// Fetch user document from MongoDB
$user = $collection->findOne(["user_id" => $user_id]);

if (!$user) {
    die(json_encode(["error" => "User data not found."]));
}

// Handle skills data (both old and new format)
$skills = [];
if (isset($user['skills'])) {
    if (is_array($user['skills']) || $user['skills'] instanceof MongoDB\Model\BSONArray) {
        // Already array format
        $skills = $user['skills'];
    } elseif (is_string($user['skills'])) {
        // Legacy format: comma-separated string
        $skillNames = explode(',', $user['skills']);
        foreach ($skillNames as $name) {
            $name = trim($name);
            if ($name) {
                $skills[] = [
                    'name' => $name,
                    'percentage' => 70 // Default percentage for legacy data
                ];
            }
        }
    }
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
    "skills" => $skills,
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
