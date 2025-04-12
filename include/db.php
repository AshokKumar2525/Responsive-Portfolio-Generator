
<?php
$servername = "localhost";
$username = "root";
$password = ""; // Provide your password here
$db = "portfolio"; // This is your database name, create one manually if it doesn't exist

// Create connection
$con = mysqli_connect($servername, $username, $password, $db);
if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}

// ✅ Create Users Table
$sql_users = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);";

if (!mysqli_query($con, $sql_users)) {
    die("Error creating users table: " . mysqli_error($con));
}

// ✅ Create Details Table with Foreign Key (1:1 Relationship)
$sql_details = "CREATE TABLE IF NOT EXISTS details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL,
    skills TEXT NOT NULL,
    job_roles VARCHAR(255), -- Added job_roles column
    image_url VARCHAR(500) NOT NULL,
    github_link VARCHAR(500),
    linkedin_link VARCHAR(500),
    instagram_link VARCHAR(500), -- Added instagram_link column
    education TEXT NOT NULL, -- Stored as JSON-encoded array of objects
    about TEXT NOT NULL,
    projects JSON NOT NULL,
    achievements TEXT, -- Optional
    certifications JSON, -- Array of image paths
    experience JSON, -- Array of objects
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);";

if (!mysqli_query($con, $sql_details)) {
    die("Error creating details table: " . mysqli_error($con));
}

echo "✅ Tables created successfully (if they didn't exist already).";

mysqli_close($con);
?>