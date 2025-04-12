function populateFields(containerId, data, addFunction) {
    let container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear existing content

    data.forEach(entry => addFunction(entry));
}
// Add dynamic education fields
function addEducation(entry = {}) {
    let container = document.getElementById("education-container");
    let div = document.createElement("div");
    div.className = "row g-2"; // Bootstrap row with gap

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
    `;
    container.appendChild(div);
}



// Add dynamic project fields
function addProject(entry = {}) {
    let container = document.getElementById("projects-container");
    let div = document.createElement("div");
    div.className = "row g-2";

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
    `;
    container.appendChild(div);
}

// Add dynamic experience fields
function addExperience(entry = {}) {
    let container = document.getElementById("experience-container");
    let div = document.createElement("div");
    div.className = "row g-2";

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
    `;
    container.appendChild(div);
}



// Fetch and populate data after login
document.addEventListener("DOMContentLoaded", function () {
    fetch("data_fetch.php")
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log("No logged-in user. Showing empty form.");
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
                    addEducation(); // add a default empty field
                }

                // Projects
                if (data.projects && data.projects.length > 0) {
                    populateFields("projects-container", data.projects, addProject);
                } else {
                    addProject(); // default
                }

                // Experience
                if (data.experience && data.experience.length > 0) {
                    populateFields("experience-container", data.experience, addExperience);
                } else {
                    addExperience(); // default
                }

            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            addEducation();
            addProject();
            addExperience();
        });
});