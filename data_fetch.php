<?php
session_start();

// Database Connection
$servername = "localhost";
$username = "root";
$password = "Ashok@123"; // Change this for production
$dbname = "portfolio";


$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// ✅ Check if user is logged in
$user_id = $_SESSION['user_id'] ?? null;
if (!$user_id) {
    die(json_encode(["error" => "User not logged in"]));
}

// ✅ Fetch user details
$sql = "SELECT name, email, mobile, skills, job_roles, github_link, linkedin_link, instagram_link, about, achievements, image_url, education, projects, experience, certifications 
        FROM details WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->bind_result($name, $email, $mobile, $skills, $job_roles, $github_link, $linkedin_link, $instagram_link, $about, $achievements, $image_url, $education, $projects, $experience, $certifications_json);
$stmt->fetch();
$stmt->close();

// ✅ Decode JSON fields
$education = json_decode($education, true) ?: [];
$projects = json_decode($projects, true) ?: [];
$experience = json_decode($experience, true) ?: [];
$certifications = json_decode($certifications_json, true) ?: [];

// ✅ Format certification file paths
$certification_files = [];
foreach ($certifications as $cert_path) {
    if (file_exists($cert_path)) {
        $certification_files[] = $cert_path; // Relative path (good for frontend display)
    }
}

// ✅ Extract photo filename only
$photo_name = $image_url ? basename($image_url) : null;

// ✅ Return JSON response
echo json_encode([
    "name" => $name ?? "",
    "email" => $email ?? "",
    "mobile" => $mobile ?? "",
    "skills" => $skills ?? "",
    "job_roles" => $job_roles ?? "", // Include Job Roles
    "github_link" => $github_link ?? "",
    "linkedin_link" => $linkedin_link ?? "",
    "instagram_link" => $instagram_link ?? "", // Include Instagram Link
    "about" => $about ?? "",
    "achievements" => $achievements ?? "",
    "education" => $education,
    "projects" => $projects,
    "experience" => $experience,
    "certifications" => $certification_files,
    // "photo" => $photo_name,
    "photo_url" => $image_url
]);

$conn->close();
?>
