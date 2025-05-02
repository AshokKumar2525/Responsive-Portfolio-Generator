<?php
// 1. Start session ONLY if it doesn't exist
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require 'vendor/autoload.php'; // MongoDB

require 'mongodb_connection.php';

// Get MongoDB client
$client = MongoDBManager::getClient();
$collection = $client->portfolio->details;

// Ensure user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: index.html");
    exit;
}

$user_id = $_SESSION['user_id'];
$upload_base = "static/images/$user_id/";
$profile_folder = $upload_base . "profile/";
$certifications_folder = $upload_base . "certifications/";

// Create directories
if (!is_dir($profile_folder)) mkdir($profile_folder, 0777, true);
if (!is_dir($certifications_folder)) mkdir($certifications_folder, 0777, true);

// Fetch existing document
$existing_doc = $collection->findOne(["user_id" => $user_id]);
$existing_photo = $existing_doc['image_url'] ?? "";
$existing_certifications = $existing_doc['certifications'] ?? [];

// Process skills with percentages
$skills = [];
if (isset($_POST['skills']) && is_array($_POST['skills'])) {
    foreach ($_POST['skills'] as $skillData) {
        // Handle both formats - with dynamic keys and direct array
        if (isset($skillData['name']) && !empty($skillData['name'])) {
            // Normal format
            $skills[] = [
                'name' => trim($skillData['name']),
                'percentage' => (int)($skillData['percentage'] ?? 70)
            ];
        } elseif (is_array($skillData)) {
            // Dynamic key format (from frontend)
            foreach ($skillData as $skillItem) {
                if (!empty($skillItem['name'])) {
                    $skills[] = [
                        'name' => trim($skillItem['name']),
                        'percentage' => (int)($skillItem['percentage'] ?? 70)
                    ];
                }
            }
        }
    }
}


// Profile Photo Upload
$imagePath = $existing_photo;
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
    foreach (glob($profile_folder . "profile.*") as $oldPhoto) {
        unlink($oldPhoto);
    }
    if (!move_uploaded_file($_FILES['photo']['tmp_name'], $imagePath)) {
        die(json_encode(["success" => false, "message" => "Failed to upload profile photo."]));
    }
}

// Certification Uploads
$certifications_path = is_array($existing_certifications) ? $existing_certifications : iterator_to_array($existing_certifications);

if (!empty($_FILES['certifications']['name'][0])) {
    foreach ($_FILES['certifications']['name'] as $index => $certFileName) {
        if (!empty($certFileName)) {
            if ($_FILES['certifications']['size'][$index] > 500000) {
                die(json_encode(["success" => false, "message" => "Certification file '{$certFileName}' exceeds 500KB limit"]));
            }
            $certFileName = str_replace(" ", "_", basename($certFileName));
            $certPath = $certifications_folder . $certFileName;

            if (in_array($certPath, $certifications_path)) continue;
            if (move_uploaded_file($_FILES['certifications']['tmp_name'][$index], $certPath)) {
                $certifications_path[] = $certPath;
            } else {
                die(json_encode(["success" => false, "message" => "Failed to upload certification file: " . $certFileName]));
            }
        }
    }
}


// Form Inputs
$name = $_POST['name'] ?? "";
$email = $_POST['email'] ?? "";
$mobile = $_POST['mobile'] ?? "";
$job_roles = $_POST['job_roles'] ?? "";
$github_link = $_POST['github_link'] ?? "";
$linkedin_link = $_POST['linkedin_link'] ?? "";
$instagram_link = $_POST['instagram_link'] ?? "";
$about = $_POST['about'] ?? "";
$achievements = $_POST['achievements'] ?? "";

if (empty($name) || empty($email) || empty($mobile)) {
    die(json_encode(["success" => false, "message" => "Error: Name, Email, and Mobile are required fields."]));
}
// Process education, projects, and experience
$education = [];
if (isset($_POST['education'])) {
    foreach ($_POST['education'] as $edu) {
        if (!empty($edu['institution']) || !empty($edu['duration']) || !empty($edu['grade'])) {
            $education[] = [
                'institution' => $edu['institution'] ?? '',
                'duration' => $edu['duration'] ?? '',
                'grade' => $edu['grade'] ?? ''
            ];
        }
    }
}

$projects = [];
if (isset($_POST['projects'])) {
    foreach ($_POST['projects'] as $proj) {
        if (!empty($proj['projectName']) || !empty($proj['description']) || !empty($proj['gitrepolink'])) {
            $projects[] = [
                'projectName' => $proj['projectName'] ?? '',
                'description' => $proj['description'] ?? '',
                'gitrepolink' => $proj['gitrepolink'] ?? ''
            ];
        }
    }
}

$experience = [];
if (isset($_POST['experience'])) {
    foreach ($_POST['experience'] as $exp) {
        if (!empty($exp['company']) || !empty($exp['role']) || !empty($exp['years'])) {
            $experience[] = [
                'company' => $exp['company'] ?? '',
                'role' => $exp['role'] ?? '',
                'years' => $exp['years'] ?? ''
            ];
        }
    }
}

// Final document
$data = [
    "user_id" => $user_id,
    "name" => $name,
    "email" => $email,
    "mobile" => $mobile,
    "skills" => $skills,
    "job_roles" => $job_roles,
    "image_url" => $imagePath,
    "github_link" => $github_link,
    "linkedin_link" => $linkedin_link,
    "instagram_link" => $instagram_link,
    "education" => $education,
    "about" => $about,
    "projects" => $projects,
    "achievements" => $achievements,
    "certifications" => $certifications_path,
    "experience" => $experience
];

// Insert or Update
$collection->updateOne(
    ["user_id" => $user_id],
    ['$set' => $data],
    ['upsert' => true]
);

header("Location: portfolio.html");
exit;
?>
