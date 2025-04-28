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
function addEducation(entry = {}, index = document.querySelectorAll('#education-container .row.g-2').length) {
    let container = document.getElementById("education-container");
    let div = document.createElement("div");
    div.className = "row g-2 position-relative";

    div.innerHTML = `
    <div class="col-md-4">
        <label class="form-label"><i class="fas fa-graduation-cap text-primary me-2"></i>Degree/Institute</label>
        <input type="text" class="form-control" placeholder="Degree, Institute Name" name="education[${index}][institution]" value="${entry.institution || ''}" required>
    </div>
    <div class="col-md-4">
        <label class="form-label"><i class="fas fa-calendar-alt text-success me-2"></i>Duration</label>
        <input type="text" class="form-control" placeholder="Duration : 2020-2024" name="education[${index}][duration]" value="${entry.duration || ''}" required>
    </div>
    <div class="col-md-4">
        <label class="form-label"><i class="fas fa-star text-warning me-2"></i>Grade</label>
        <input type="text" class="form-control" placeholder="Grade : 9.23" name="education[${index}][grade]" value="${entry.grade || ''}" required>
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
function addProject(entry = {}, index = document.querySelectorAll('#projects-container .row.g-2').length) {
    let container = document.getElementById("projects-container");
    let div = document.createElement("div");
    div.className = "row g-2 position-relative";

    div.innerHTML = `
    <div class="col-md-4">
        <label class="form-label"><i class="fas fa-project-diagram text-info me-2"></i>Project Name</label>
        <input type="text" class="form-control" placeholder="Project Name" name="projects[${index}][projectName]" value="${entry.projectName || ''}">
    </div>
    <div class="col-md-4">
        <label class="form-label"><i class="fas fa-file-alt text-secondary me-2"></i>Description</label>
        <input type="text" class="form-control" placeholder="Description" name="projects[${index}][description]" value="${entry.description || ''}">
    </div>
    <div class="col-md-4">
        <label class="form-label"><i class="fab fa-github text-dark me-2"></i>GitRepo Link</label>
        <input type="text" class="form-control" placeholder="GitRepo Link" name="projects[${index}][gitrepolink]" value="${entry.gitrepolink || ''}">
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
function addExperience(entry = {}, index = document.querySelectorAll('#experience-container .row.g-2').length) {
    let container = document.getElementById("experience-container");
    let div = document.createElement("div");
    div.className = "row g-2 position-relative";

    div.innerHTML = `
    <div class="col-md-4">
        <label class="form-label"><i class="fas fa-building text-primary me-2"></i>Company Name</label>
        <input type="text" class="form-control" placeholder="Company Name" name="experience[${index}][company]" value="${entry.company || ''}">
    </div>
    <div class="col-md-4">
        <label class="form-label"><i class="fas fa-user-tie text-success me-2"></i>Role</label>
        <input type="text" class="form-control" placeholder="Role" name="experience[${index}][role]" value="${entry.role || ''}">
    </div>
    <div class="col-md-4">
        <label class="form-label"><i class="fas fa-clock text-warning me-2"></i>Years Worked</label>
        <input type="text" class="form-control" placeholder="Years Worked" name="experience[${index}][years]" value="${entry.years || ''}">
    </div>
    <button type="button" class="btn-remove" onclick="this.parentNode.remove()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
    </button>
`;
    container.appendChild(div);
}

// Helper function to update datalist options
function updateDatalistOptions() {
    const datalist = document.getElementById('skills-datalist');
    const currentSkills = Array.from(document.querySelectorAll('.skill-name')).map(el => el.textContent.toLowerCase());
    
    // Clear existing options
    datalist.innerHTML = '';
    
    // Add only options that aren't already selected
    const allSkills = [
        'Python', 'Java', 'C', 'C++', 'PHP', 'JavaScript', 'HTML', 'CSS', 'React', 
        'Node', 'SQL', 'ML', 'AI', 'DL', 'DSA', 'Web Technologies', 'TypeScript', 
        'MongoDB', 'Express', 'NextJS', 'Tailwind', 'Bootstrap', 'Git', 'GitHub', 
        'Firebase', 'Docker', 'Linux', 'Bash', 'Cloud Computing', 'AWS', 'Azure', 
        'GCP', 'Cyber Security', 'Networking', 'Blockchain', 'DevOps', 'Kubernetes', 
        'Nginx', 'GraphQL', 'Postman', 'Jira', 'Figma', 'UI/UX'
    ];
    
    allSkills.forEach(skill => {
        if (!currentSkills.includes(skill.toLowerCase())) {
            const option = document.createElement('option');
            option.value = skill;
            datalist.appendChild(option);
        }
    });
}

// Check if skill already exists
function skillExists(skillName) {
    const currentSkills = Array.from(document.querySelectorAll('.skill-name')).map(el => el.textContent.toLowerCase());
    return currentSkills.includes(skillName.toLowerCase());
}

// Add dynamic skills fields
function addSkill() {
    const skillInput = document.getElementById('skill-name');
    const skillPercentage = document.getElementById('skill-percentage');
    const skillsContainer = document.getElementById('skills-container');
    
    const skillName = skillInput.value.trim();
    
    if (!skillName) {
        alert('Please enter a skill');
        return;
    }
    
    if (skillExists(skillName)) {
        alert('This skill already exists!');
        return;
    }

    const skillId = 'skill-' + Date.now();
    const percentage = skillPercentage.value;
    
    const skillDiv = document.createElement('div');
    skillDiv.className = 'skill-item';
    skillDiv.innerHTML = `
        <div class="skill-header">
            <span class="skill-name">${skillName}</span>
            <div>
                <span class="skill-percentage">${percentage}%</span>
                <span class="remove-skill" onclick="removeSkill(this)">
                    <i class="fas fa-times"></i>
                </span>
            </div>
        </div>
        <div class="skill-bar-container">
            <div class="skill-bar" style="width: ${percentage}%"></div>
        </div>
        <input type="hidden" name="skills[${skillId}][name]" value="${skillName}">
        <input type="hidden" name="skills[${skillId}][percentage]" value="${percentage}">
    `;
    
    skillsContainer.appendChild(skillDiv);
    skillInput.value = '';
    
    // Update datalist options
    updateDatalistOptions();
}

function removeSkill(element) {
    const skillItem = element.closest('.skill-item');
    skillItem.remove();
    
    // Update datalist options when a skill is removed
    updateDatalistOptions();
}

// Populate skills from fetched data
function populateSkillsFromData(data) {
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = '';
    
    if (data.skills && typeof data.skills === 'object') {
        Object.values(data.skills).forEach(skill => {
            const skillId = 'skill-' + Date.now();
            const skillDiv = document.createElement('div');
            skillDiv.className = 'skill-item';
            skillDiv.innerHTML = `
                <div class="skill-header">
                    <span class="skill-name">${skill.name}</span>
                    <div>
                        <span class="skill-percentage">${skill.percentage}%</span>
                        <span class="remove-skill" onclick="removeSkill(this)">
                            <i class="fas fa-times"></i>
                        </span>
                    </div>
                </div>
                <div class="skill-bar-container">
                    <div class="skill-bar" style="width: ${skill.percentage}%"></div>
                </div>
                <input type="hidden" name="skills[${skillId}][name]" value="${skill.name}">
                <input type="hidden" name="skills[${skillId}][percentage]" value="${skill.percentage}">
            `;
            skillsContainer.appendChild(skillDiv);
        });
    }
    
    // Update datalist options after populating
    updateDatalistOptions();
}
// Update percentage display
document.addEventListener('DOMContentLoaded', function () {
    const percentageInput = document.getElementById('skill-percentage');
    const percentageDisplay = document.getElementById('skill-percentage-value');
    
    percentageInput.addEventListener('input', function() {
        percentageDisplay.textContent = this.value + '%';
    });
});
// Fetch and populate data after login
document.addEventListener("DOMContentLoaded", function () {
    fetch("data_fetch.php")
        .then(response => {
            // First check HTTP status
            if (response.status === 401) { // Unauthorized
                window.location.href = "index.html";
                return Promise.reject("Session expired");
            }
            if (!response.ok) {
                return Promise.reject(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("data fetched : " + data);
            if (data.error) {
                if (data.error === "User not logged in") {
                    window.location.href = "index.html";
                    return;
                }
                throw new Error(data.error);
            } else {
                // Populate basic fields
                document.querySelector("[name='name']").value = data.name || "";
                document.querySelector("[name='email']").value = data.email || "";
                document.querySelector("[name='mobile']").value = data.mobile || "";
                populateSkillsFromData(data);
                updateDatalistOptions();
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