<?php
// Add this at the top of your portfolio.php
// header('Content-Type: application/json');
session_start();

// // Database connection
$conn = new mysqli("localhost", "root", "Ashok@123", "portfolio");
if ($conn->connect_error) {
    echo json_encode([
        "error" => "Database connection failed: " . $conn->connect_error,
        "success" => false
    ]);
    exit;
}


if (!isset($_SESSION['user_email']) && isset($data['email'])) {
    $_SESSION['user_email'] = $data['email'];
}


$user_id = $_SESSION['user_id'];

// Fetch user details from the database
$sql = "SELECT * FROM details WHERE user_id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode([
        "error" => "Failed to prepare SQL statement: " . $conn->error,
        "success" => false
    ]);
    exit;
}


$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "error" => "No details found for the user.",
        "success" => false
    ]);
    exit;
}

$row = $result->fetch_assoc();
// Prepare the data to send as JSON

$data = [
    "success" => true,
    "name" => $row['name'],
    "job_roles" => $row['job_roles'],
    "email" => $row['email'],
    "mobile" => $row['mobile'],
    "skills" => $row['skills'],
    "about" => $row['about'],
    "github_link" => $row['github_link'],
    "linkedin_link" => $row['linkedin_link'],
    "instagram_link" => $row['instagram_link'],
    "photo_url" => $row['image_url'] ?: "placeholder.jpg",
    "education" => json_decode($row['education'], true) ?: [],
    "projects" => json_decode($row['projects'], true) ?: [],
    "experience" => json_decode($row['experience'], true) ?: [],
    "certifications" => json_decode($row['certifications'], true) ?: [],
    'achievements' => $row['achievements'] ? explode("\n", $row['achievements']) : []
];

// Send the data as JSON
echo json_encode($data);

// Close the database connection
$stmt->close();
$conn->close();
?>