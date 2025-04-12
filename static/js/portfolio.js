// Fetch user details from portfolio.php
document.addEventListener('DOMContentLoaded', function () {
    fetch('../portfolio.php')
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }
            // Populate basic details
            populateBasicInfo(data);
            populateAbout(data);
            populateEducation(data);
            populateExperience(data);
            populateProjects(data);
            populateCertifications(data);
            populateSkills(data);
            populateContact(data);
            populateAchievements(data);
            animateJobRoles(data);
            setupCertificateModal();


        })
        .catch(error => {
            console.error("Error fetching data:", error);
            showErrorMessages();
        });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Handle contact form submission
document.getElementById('contact_us')?.addEventListener('submit', function (e) {
        const alertDiv = document.createElement('div');
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.padding = '15px';
        alertDiv.style.backgroundColor = '#4CAF50';
        alertDiv.style.color = 'white';
        alertDiv.style.borderRadius = '5px';
        alertDiv.style.zIndex = '1000';
        alertDiv.textContent = "message sent successfully..!";

        // Add to document
        document.body.appendChild(alertDiv);

        // Remove after 2 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 2000);
    })




// Helper functions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Population functions
function populateBasicInfo(data) {
    document.getElementById('name').textContent = data.name;
    document.getElementById('role').textContent = data.job_roles;
    document.getElementById('profile-pic').src = data.photo_url;
}

function populateAbout(data) {
    document.getElementById('about-text').textContent = data.about;
    document.getElementById('about-pic').src = data.photo_url;
}

function animateJobRoles() {
    const roleElement = document.getElementById('role');
    if (!roleElement) return;

    const roles = roleElement.textContent.split(', ').map(role => role.trim());
    if (roles.length <= 1) return;

    let currentRoleIndex = 0;
    let isDeleting = false;
    let currentText = '';
    let typingSpeed = 100;
    let pauseBetweenRoles = 2000;

    function type() {
        const fullText = roles[currentRoleIndex];

        if (isDeleting) {
            currentText = fullText.substring(0, currentText.length - 1);
        } else {
            currentText = fullText.substring(0, currentText.length + 1);
        }

        roleElement.textContent = currentText;

        if (!isDeleting && currentText === fullText) {
            typingSpeed = pauseBetweenRoles;
            isDeleting = true;
        } else if (isDeleting && currentText === '') {
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            typingSpeed = 100;
        } else {
            typingSpeed = isDeleting ? 50 : 100;
        }

        setTimeout(type, typingSpeed);
    }

    // Start the animation
    setTimeout(type, 1000);
}

function populateEducation(data) {
    const container = document.getElementById('education-container');
    const section = document.getElementById('education');
    const navItem = document.querySelector('a.nav-link[href="#education"]')?.parentElement;

    if (!data.education || data.education.length === 0 || !hasValidEducation(data.education)) {
        if (section) section.style.display = 'none';
        if (navItem) navItem.remove();
        return;
    }

    container.innerHTML = '';
    data.education.forEach(edu => {
        if (!edu.institution || !edu.duration) return;

        const col = document.createElement('div');
        col.className = 'col-md-6';
        col.innerHTML = `
          <div class="education-item h-100">
              <h3>${edu.institution}</h3>
              <p class="text-muted mb-1"><i class="bi bi-calendar me-2"></i>${edu.duration}</p>
              ${edu.grade ? `<p class="mb-0"><strong>Grade:</strong> ${edu.grade}</p>` : ''}
          </div>
      `;
        container.appendChild(col);
    });
}

function hasValidEducation(education) {
    return education.some(edu => edu.institution && edu.duration);
}

function populateExperience(data) {
    const container = document.getElementById('experience-container');
    const section = document.getElementById('experience');
    const navItem = document.querySelector('a.nav-link[href="#experience"]')?.parentElement;

    if (!data.experience || data.experience.length === 0 || !hasValidExperience(data.experience)) {
        if (section) section.style.display = 'none';
        if (navItem) navItem.remove();
        return;
    }

    container.innerHTML = '';
    data.experience.forEach(exp => {
        if (!exp.role || !exp.company || !exp.years) return;

        const col = document.createElement('div');
        col.className = 'col-md-6';
        col.innerHTML = `
          <div class="experience-item h-100">
              <h3 class="experience-position">${exp.role}</h3>
              <p class="experience-company">${exp.company}</p>
              <p class="experience-duration"><i class="bi bi-calendar me-2"></i>${exp.years} years</p>
              ${exp.description ? `<div class="experience-description">${exp.description}</div>` : ''}
          </div>
      `;
        container.appendChild(col);
    });
}

function hasValidExperience(experience) {
    return experience.some(exp => exp.role && exp.company && exp.years);
}

function populateProjects(data) {
    const container = document.getElementById('projects-container');
    const section = document.getElementById('projects');
    const navItem = document.querySelector('a.nav-link[href="#projects"]')?.parentElement;

    if (!data.projects || data.projects.length === 0 || !hasValidProjects(data.projects)) {
        if (section) section.style.display = 'none';
        if (navItem) navItem.remove();
        return;
    }

    container.innerHTML = '';
    data.projects.forEach(project => {
        if (!project.projectName || !project.description) return;

        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
          <div class="card project-card h-100">
              ${project.image ? `<img src="${project.image}" class="card-img-top" alt="${project.projectName}">` : ''}
              <div class="card-body">
                  <h5 class="card-title">${project.projectName}</h5>
                  <p class="card-text">${project.description}</p>
              </div>
              ${project.gitrepolink ? `
              <div class="card-footer bg-transparent">
                  <a href="${project.gitrepolink}" target="_blank" class="btn btn-primary">
                      <i class="bi bi-github me-1"></i> View Code
                  </a>
              </div>
              ` : ''}
          </div>
      `;
        container.appendChild(col);
    });
}

function hasValidProjects(projects) {
    return projects.some(project => project.projectName && project.description);
}

function populateAchievements(data) {
    const container = document.getElementById('achievements-list');
    const section = document.getElementById('achievements');
    const navItem = document.querySelector('a.nav-link[href="#achievements"]')?.parentElement;

    if (!data.achievements || data.achievements.length === 0 || !hasValidAchievements(data.achievements)) {
        if (section) section.style.display = 'none';
        if (navItem) navItem.remove();
        return;
    }

    container.innerHTML = '';
    data.achievements.forEach(item => {
        if (!item) return;

        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = item;
        container.appendChild(li);
    });
}

function hasValidAchievements(achievements) {
    return achievements.some(item => item && item.trim() !== '');
}

function populateCertifications(data) {
    const container = document.getElementById('certifications-container');
    const section = document.getElementById('certifications');
    const navItem = document.querySelector('a.nav-link[href="#certifications"]')?.parentElement;

    if (!data.certifications || data.certifications.length === 0 || !hasValidCertifications(data.certifications)) {
        if (section) section.style.display = 'none';
        if (navItem) navItem.remove();
        return;
    }

    container.innerHTML = '';
    data.certifications.forEach(cert => {
        if (!cert) return;

        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
          <div class="card certification-card h-100">
              <img src="${cert}" class="card-img-top" alt="Certification">
          </div>
      `;
        container.appendChild(col);
    });
}

function hasValidCertifications(certifications) {
    return certifications.some(cert => cert && cert.trim() !== '');
}

function setupCertificateModal() {
    const modal = document.createElement('div');
    modal.className = 'certification-modal';
    modal.innerHTML = '<img src="" alt="Certificate">';
    document.body.appendChild(modal);

    document.addEventListener('click', function (e) {
        if (e.target.closest('.certification-card img')) {
            const imgSrc = e.target.closest('.certification-card img').src;
            modal.querySelector('img').src = imgSrc;
            modal.classList.add('active');
        } else if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function populateSkills(data) {
    const container = document.getElementById('skills-list');
    container.innerHTML = '';

    if (data.skills) {
        const skillIcons = {
            'python': 'filetype-py',
            'java': 'filetype-java',
            'c': 'code-slash',
            'c++': 'filetype-cpp',
            'php': 'filetype-php',
            'javascript': 'filetype-js',
            'html': 'filetype-html',
            'css': 'filetype-css',
            'react': 'react',
            'node': 'node-plus',
            'sql': 'database',
            'ml': 'robot',
            'ai': 'cpu',
            'dl': 'motherboard',
            'dsa': 'diagram-3',
            'web technologies': 'globe'
        };

        const skillColors = {
            'python': '#3776AB',
            'java': '#007396',
            'c': '#A8B9CC',
            'c++': '#00599C',
            'php': '#777BB4',
            'javascript': '#F7DF1E',
            'html': '#E34F26',
            'css': '#1572B6',
            'react': '#61DAFB',
            'node': '#339933',
            'sql': '#4479A1',
            'ml': '#FF6B6B',
            'ai': '#4ECDC4',
            'dsa': '#45B7D1',
            'web technologies': '#FFA502'
        };

        data.skills.split(',').forEach(skill => {
            const trimmedSkill = skill.trim().toLowerCase();
            if (!trimmedSkill) return;

            const icon = skillIcons[trimmedSkill] || 'patch-check-fill';
            const color = skillColors[trimmedSkill] || '#6C757D';

            const li = document.createElement('li');
            li.className = 'skill-item';
            li.innerHTML = `
              <div class="text-center">
                  <i class="bi bi-${icon}" style="color: ${color};"></i>
                  <p class="mt-2">${capitalizeFirstLetter(trimmedSkill)}</p>
              </div>
          `;
            container.appendChild(li);
        });
    }
}

function populateContact(data) {
    if (data.mobile) {
        document.getElementById('mobile').textContent = data.mobile;
        document.getElementById('mobile').href = `tel:${data.mobile}`;
    }
    if (data.email) {
        document.getElementById('email').textContent = data.email;
        document.getElementById('sender_email').href = `mailto:${data.email}`;
    }
    if (data.linkedin_link) {
        document.getElementById('linkedin').href = data.linkedin_link;
    }
    if (data.github_link) {
        document.getElementById('github').href = data.github_link;
    }
    if (data.instagram_link) {
        document.getElementById('instagram').href = data.instagram_link;
    }
}