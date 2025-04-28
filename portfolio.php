<?php
header('Content-Type: application/json');
// 1. Start session ONLY if it doesn't exist
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Add this to your existing portfolio.php (optional for server-side generation)
if (isset($_GET['download'])) {
    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="portfolio.zip"');
    
    $files = [
      'portfolio.html',
      'static/css/portfolio.css',
      'static/js/portfolio.js',
      'portfolio.php'
    ];
    
    $zip = new ZipArchive();
    $tmp_file = tempnam(sys_get_temp_dir(), '');
    $zip->open($tmp_file, ZipArchive::CREATE);
    
    foreach ($files as $file) {
      if (file_exists($file)) {
        $zip->addFile($file);
      }
    }
    
    $zip->close();
    readfile($tmp_file);
    unlink($tmp_file);
    exit;
  }

// 2. Add THIS at the top to handle logout requests
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    // Nuclear option to destroy session
    session_unset();
    session_destroy();
    session_write_close();
    setcookie(session_name(), '', 0, '/');
    
    // Clear client-side cache headers
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Expires: Thu, 01 Jan 1970 00:00:00 GMT");
    header("Location: index.html");
    exit();
}

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