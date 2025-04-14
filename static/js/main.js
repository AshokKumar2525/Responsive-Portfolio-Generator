// Function to remove empty fields (modified version)
function cleanEmptyFields(containerId, keepAtLeastOne = true) {
    const container = document.getElementById(containerId);
    const rows = container.querySelectorAll('.row.g-2');
    let nonEmptyCount = 0;

    // First count non-empty rows
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const allEmpty = Array.from(inputs).every(input => !input.value.trim());
        if (!allEmpty) {
            nonEmptyCount++;
        }
    });

    // Then remove empty rows, keeping at least one if needed
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const allEmpty = Array.from(inputs).every(input => !input.value.trim());
        
        if (allEmpty) {
            if (nonEmptyCount === 0 && keepAtLeastOne) {
                // Clear the values but keep one empty row
                inputs.forEach(input => input.value = '');
                nonEmptyCount++; // Now we have one
            } else {
                row.remove();
            }
        }
    });
}

// Modified populateFields function
function populateFields(containerId, data, addFunction) {
    let container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear existing content

    if (!data || data.length === 0) {
        addFunction(); // Add one default field
    } else {
        data.forEach(entry => addFunction(entry));
    }
    
    // Clean empty fields AFTER populating
    cleanEmptyFields(containerId);
}

// Add dynamic education fields
function addEducation(entry = {}) {
    let container = document.getElementById("education-container");
    let div = document.createElement("div");
    div.className = "row g-2 position-relative"; // Added position-relative for absolute positioning of remove button

    div.innerHTML = `
        <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Degree, Institute Name" name="education[]" value="${entry.institution || ''}" required>
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Duration : 2020-2024" name="education[]" value="${entry.duration || ''}" required>
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Grade : 9.23" name="education[]" value="${entry.grade || ''}" required>
        </div>
        <button type="button" class="btn-remove" onclick="this.parentNode.remove()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
        </button>
    `;
    container.appendChild(div);
}

// Add dynamic project fields
function addProject(entry = {}) {
    let container = document.getElementById("projects-container");
    let div = document.createElement("div");
    div.className = "row g-2 position-relative";

    div.innerHTML = `
        <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Project Name" name="projects[]" value="${entry.projectName || ''}">
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Description" name="projects[]" value="${entry.description || ''}">
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control" placeholder="GitRepo Link" name="projects[]" value="${entry.gitrepolink || ''}">
        </div>
        <button type="button" class="btn-remove" onclick="this.parentNode.remove()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
        </button>
    `;
    container.appendChild(div);
}

// Add dynamic experience fields
function addExperience(entry = {}) {
    let container = document.getElementById("experience-container");
    let div = document.createElement("div");
    div.className = "row g-2 position-relative";

    div.innerHTML = `
        <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Company Name" name="experience[]" value="${entry.company || ''}">
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Role" name="experience[]" value="${entry.role || ''}">
        </div>
        <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Years Worked" name="experience[]" value="${entry.years || ''}">
        </div>
        <button type="button" class="btn-remove" onclick="this.parentNode.remove()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
        </button>
    `;
    container.appendChild(div);
}


// Fetch and populate data after login
document.addEventListener("DOMContentLoaded", function () {
    fetch("data_fetch.php")
        .then(response => response.json())
        .then(data => {
            console.log("data fetched : "+data);
            if (data.error) {
                console.log("No logged-in user. Showing empty form.");
                populateFields("education-container", null, addEducation);
                populateFields("projects-container", null, addProject);
                populateFields("experience-container", null, addExperience);
            } else {
                // Populate basic fields
                document.querySelector("[name='name']").value = data.name || "";
                document.querySelector("[name='email']").value = data.email || "";
                document.querySelector("[name='mobile']").value = data.mobile || "";
                document.querySelector("[name='skills']").value = data.skills || "";
                document.querySelector("[name='job_roles']").value = data.job_roles || ""; // Populate Job Roles
                document.querySelector("[name='github_link']").value = data.github_link || "";
                document.querySelector("[name='linkedin_link']").value = data.linkedin_link || "";
                document.querySelector("[name='instagram_link']").value = data.instagram_link || ""; // Populate Instagram Link
                document.querySelector("[name='about']").value = data.about || "";
                document.querySelector("[name='achievements']").value = data.achievements || "";

                // Populate profile photo
                if (data.photo_url) {
                    let img = document.createElement("img");
                    img.src = data.photo_url;
                    img.style.width = "100px";
                    img.style.height = "100px";
                    img.style.objectFit = "cover";
                    img.style.borderRadius = "10px";
                    img.style.marginRight = "10px";
                    document.getElementById("profile-photo-container").appendChild(img);
                }

                // Populate certifications
                if (data.certifications && Array.isArray(data.certifications)) {
                    const certPreview = document.getElementById("certifications-preview");
                    certPreview.innerHTML = ""; // Clear old content if any

                    data.certifications.forEach(certUrl => {
                        let img = document.createElement("img");
                        img.src = certUrl;
                        img.style.width = "100px";
                        img.style.height = "100px";
                        img.style.objectFit = "cover";
                        img.style.borderRadius = "10px";
                        img.style.marginRight = "10px";
                        certPreview.appendChild(img);
                    });
                }

                // Education
                if (data.education && data.education.length > 0) {
                    populateFields("education-container", data.education, addEducation);
                } else {
                    populateFields("education-container", null, addEducation);
                }

                // Projects
                if (data.projects && data.projects.length > 0) {
                    populateFields("projects-container", data.projects, addProject);
                } else {
                    populateFields("projects-container", null, addProject);
                }

                // Experience
                if (data.experience && data.experience.length > 0) {
                    populateFields("experience-container", data.experience, addExperience);
                } else {
                    populateFields("experience-container", null, addExperience);
                }

            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            populateFields("education-container", null, addEducation);
            populateFields("projects-container", null, addProject);
            populateFields("experience-container", null, addExperience);
        });
});