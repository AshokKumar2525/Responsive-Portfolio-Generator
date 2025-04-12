<?php
// Start session safely
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


// Database Connection
$servername = "localhost";
$username = "root";
$password = "Ashok@123"; // Change this for production
$dbname = "portfolio";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]));
}

// Ensure user is logged in
if (!isset($_SESSION['user_id'])) {
    die(json_encode(["success" => false, "message" => "User not logged in."]));
}

$user_id = $_SESSION['user_id'];
$upload_base = "static/images/$user_id/";
$profile_folder = $upload_base . "profile/";
$certifications_folder = $upload_base . "certifications/";


// Create necessary folders if they don't exist
if (!is_dir($profile_folder)) {
    mkdir($profile_folder, 0777, true);
}
if (!is_dir($certifications_folder)) {
    mkdir($certifications_folder, 0777, true);
}


// Debugging: Check received files
// file_put_contents("debug_files.txt", print_r($_FILES, true));

// Fetch existing image path from DB
$sql_fetch = "SELECT image_url, certifications FROM details WHERE user_id = ?";
$stmt_fetch = $conn->prepare($sql_fetch);
$stmt_fetch->bind_param("i", $user_id);
$stmt_fetch->execute();
$stmt_fetch->bind_result($existing_photo, $existing_certifications);
$stmt_fetch->fetch();
$stmt_fetch->close();

// Handle Profile Photo Upload
$imagePath = !empty($existing_photo) ? $existing_photo : "";
if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    if ($_FILES['photo']['size'] > 500000) {
        die(json_encode(["success" => false, "message" => "Profile photo must be less than 500KB"]));
    }
    $imageExt = strtolower(pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION));
    $allowedTypes = ["jpg", "jpeg", "png", "webp"];

    if (!in_array($imageExt, $allowedTypes)) {
        die(json_encode(["success" => false, "message" => "Invalid file type for profile photo."]));
    }

    $imagePath = $profile_folder . "profile." . $imageExt;

    // Remove old profile image safely
    foreach (glob($profile_folder . "profile.*") as $oldPhoto) {
        unlink($oldPhoto);
    }

    if (!move_uploaded_file($_FILES['photo']['tmp_name'], $imagePath)) {
        die(json_encode(["success" => false, "message" => "Failed to upload profile photo."]));
    }
}

// Handle Certifications Upload
$certifications_path = !empty($existing_certifications) ? json_decode($existing_certifications, true) : [];
if (!empty($_FILES['certifications']['name'][0])) {
    foreach ($_FILES['certifications']['name'] as $index => $certFileName) {
        if (!empty($certFileName)) {
            if ($_FILES['certifications']['size'][$index] > 500000) {
                die(json_encode(["success" => false, "message" => "Certification file '{$certFileName}' exceeds 500KB limit"]));
            }
            $certFileName = str_replace(" ", "_", basename($certFileName));
            $certPath = $certifications_folder . $certFileName;
            
            if (in_array($certPath, $certifications_path)) {
                continue;
            }
            if (move_uploaded_file($_FILES['certifications']['tmp_name'][$index], $certPath)) {
                $certifications_path[] = $certPath;
            } else {
                die(json_encode(["success" => false, "message" => "Failed to upload certification file: " . $certFileName]));
            }
        }
    }
}
$certifications_json = json_encode($certifications_path, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

// Retrieve form data
$name = $_POST['name'] ?? "";
$email = $_POST['email'] ?? "";
$mobile = $_POST['mobile'] ?? "";
$skills = $_POST['skills'] ?? "";
$job_roles = $_POST['job_roles'] ?? "";
$github_link = $_POST['github_link'] ?? "";
$linkedin_link = $_POST['linkedin_link'] ?? "";
$instagram_link = $_POST['instagram_link'] ?? "";
$about = $_POST['about'] ?? "";
$achievements = $_POST['achievements'] ?? "";

// Ensure required fields are provided
if (empty($name) || empty($email) || empty($mobile)) {
    die(json_encode(["success" => false, "message" => "Error: Name, Email, and Mobile are required fields."]));
}

// Function to convert structured arrays to JSON
function convertToJson($array, $keys) {
    if (!is_array($array) || empty($array)) return json_encode([]);

    $structuredData = [];
    for ($i = 0; $i < count($array); $i += count($keys)) {
        $entry = [];
        for ($j = 0; $j < count($keys); $j++) {
            $entry[$keys[$j]] = $array[$i + $j] ?? "";
        }
        $structuredData[] = $entry;
    }
    return json_encode($structuredData, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
}

// Convert structured data into valid JSON
$education = isset($_POST['education']) ? convertToJson($_POST['education'], ["institution", "duration","grade"]) : json_encode([]);
$projects = isset($_POST['projects']) ? convertToJson($_POST['projects'], ["projectName", "description","gitrepolink" ]) : json_encode([]);
$experience = isset($_POST['experience']) ? convertToJson($_POST['experience'], ["company", "role", "years"]) : json_encode([]);

// Check if user already exists
$sql_check = "SELECT user_id FROM details WHERE user_id = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("i", $user_id);
$stmt_check->execute();
$result_check = $stmt_check->get_result();
$exists = $result_check->num_rows > 0;
$stmt_check->close();

// Insert or Update Data
if ($exists) {
    $sql = "UPDATE details SET 
        name=?, email=?, mobile=?, skills=?,job_roles=?, image_url=?, github_link=?, linkedin_link=?,instagram_link=?, 
        education=?, about=?, projects=?, achievements=?, certifications=?, experience=? 
        WHERE user_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssssssssssi", $name, $email, $mobile, $skills,$job_roles, $imagePath, $github_link, 
                      $linkedin_link,$instagram_link, $education, $about, $projects, $achievements, $certifications_json, 
                      $experience, $user_id);
} else {
    $sql = "INSERT INTO details (user_id, name, email, mobile, skills,job_roles, image_url, github_link, linkedin_link,instagram_link, 
            education, about, projects, achievements, certifications, experience) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isssssssssssssss", $user_id, $name, $email, $mobile, $skills,$job_roles, $imagePath, $github_link, 
                      $linkedin_link,$instagram_link, $education, $about, $projects, $achievements, $certifications_json, 
                      $experience);
}

$stmt->execute();
header("Location: portfolio.html");

$stmt->close();
$conn->close();
?>
