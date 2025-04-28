// Fetch user details from portfolio.php
document.addEventListener('DOMContentLoaded', function () {
    const errorDisplay = document.createElement('div');
    errorDisplay.id = 'error-message';
    errorDisplay.style.display = 'none';
    document.body.prepend(errorDisplay);

    fetch('portfolio.php')
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data.error) {
                if (data.error === "User not identified") {
                    window.location.href = 'index.html';
                    return;
                }
                showError(data.error);
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
            showError(error.message);
            console.error("Error:", error);
        });

    function showError(message) {
        errorDisplay.textContent = `Error: ${message}`;
        errorDisplay.style.display = 'block';
        errorDisplay.style.color = 'red';
        errorDisplay.style.padding = '1rem';
        errorDisplay.style.backgroundColor = '#ffeeee';
        errorDisplay.style.border = '1px solid red';
        errorDisplay.style.margin = '1rem';
    }

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

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav'); // Adjust selector to match your nav links container

    // Toggle menu
    hamburger.addEventListener('click', function () {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked and scroll to section
    navLinks.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            // Close menu
            hamburger.classList.remove('active');
            this.classList.remove('active');

            // Get target section
            const targetId = e.target.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });
});


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
    const yearSpan = document.getElementById('year');
    if (yearSpan && data.name) {
        yearSpan.parentElement.innerHTML = `&copy; ${new Date().getFullYear()} ${data.name}. All rights reserved.`;
    }
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
              <h3><b>${edu.institution}</b></h3>
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
              <h3 class="experience-position"><b>${exp.role}</b></h3>
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

async function populateProjects(data) {
    const container = document.getElementById('projects-container');
    const section = document.getElementById('projects');
    const navItem = document.querySelector('a.nav-link[href="#projects"]')?.parentElement;

    if (!data.projects || data.projects.length === 0 || !hasValidProjects(data.projects)) {
        if (section) section.style.display = 'none';
        if (navItem) navItem.remove();
        return;
    }

    container.innerHTML = '';

    // Predefined tech-related keywords for better images
    const techKeywords = ['code', 'programming', 'computer', 'tech', 'developer', 'software', 'web', 'app'];

    for (const project of data.projects) {
        if (!project.projectName || !project.description) continue;

        // Generate initials from project name
        const initials = project.projectName
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);

        // Generate a consistent color based on project name
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA502', '#A29BFE', '#6C5CE7', '#00B894'];
        const colorIndex = Math.abs(hashCode(project.projectName)) % colors.length;
        const color = colors[colorIndex];

        // Create SVG placeholder as fallback
        const svgPlaceholder = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'>
                <rect width='600' height='400' fill='${color}'/>
                <text x='50%' y='50%' fill='white' font-family='Arial' font-size='80' font-weight='bold' 
                      text-anchor='middle' dominant-baseline='middle'>
                    ${initials}
                </text>
            </svg>`
        )}`;

        // Create project card
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-4';
        col.innerHTML = `
            <div class="card project-card h-100">
                <div class="project-image-container">
                    <img src="${svgPlaceholder}" class="card-img-top project-image" alt="${project.projectName}">
                </div>
                <div class="card-body">
                    <h5 class="card-title"><b>${project.projectName}</b></h5>
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

        // Try to load a random tech image in the background
        try {
            const randomKeyword = techKeywords[Math.floor(Math.random() * techKeywords.length)];
            const imgElement = col.querySelector('.project-image');
            const tempImg = new Image();

            tempImg.onload = function () {
                imgElement.src = `https://source.unsplash.com/random/600x400/?${randomKeyword},technology`;
            };
            tempImg.onerror = function () {
                // Keep the SVG placeholder if image fails to load
            };
            tempImg.src = `https://source.unsplash.com/random/600x400/?${randomKeyword},technology`;
        } catch (error) {
            console.error('Error loading image:', error);
        }
    }
}

// Helper function to generate consistent hash from string
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

// Helper function to check if projects are valid
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
// Replace the populateSkills function in portfolio.js with this:
function populateSkills(data) {
    const container = document.getElementById('skills-list');
    container.innerHTML = '';

    if (data.skills && Array.isArray(data.skills)) {
        const skillIcons = {
            'python': 'filetype-py', // Will customize this with CSS later
            'java': 'cup-hot', // Coffee cup for Java
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
            'web technologies': 'globe',
            'typescript': 'filetype-tsx',
            'mongodb': 'database-fill',
            'express': 'terminal',
            'nextjs': 'layers',
            'tailwind': 'wind',
            'bootstrap': 'bootstrap',
            'git': 'git',
            'github': 'github',
            'firebase': 'flame',
            'docker': 'box',
            'linux': 'ubuntu',
            'bash': 'terminal-square',
            'cloud computing': 'cloud',
            'aws': 'cloud-arrow-up',
            'azure': 'cloud-rain',
            'gcp': 'cloud-sun',
            'cyber security': 'shield-check',
            'networking': 'wifi',
            'blockchain': 'link-45deg',
            'devops': 'gear-wide-connected',
            'kubernetes': 'boxes',
            'nginx': 'server',
            'graphql': 'graph-up',
            'postman': 'send',
            'jira': 'kanban',
            'figma': 'vector-pen',
            'ui/ux': 'layout-text-window'
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
            'dl': '#8E44AD',
            'dsa': '#45B7D1',
            'web technologies': '#FFA502',
            'typescript': '#3178C6',
            'mongodb': '#47A248',
            'express': '#303030',
            'nextjs': '#000000',
            'tailwind': '#38BDF8',
            'bootstrap': '#7952B3',
            'git': '#F05032',
            'github': '#24292E',
            'firebase': '#FFCA28',
            'docker': '#0db7ed',
            'linux': '#FCC624',
            'bash': '#4EAA25',
            'cloud computing': '#00BFFF',
            'aws': '#FF9900',
            'azure': '#007FFF',
            'gcp': '#4285F4',
            'cyber security': '#FF4757',
            'networking': '#2ED573',
            'blockchain': '#5865F2',
            'devops': '#0F9D58',
            'kubernetes': '#326CE5',
            'nginx': '#009639',
            'graphql': '#E10098',
            'postman': '#FF6C37',
            'jira': '#0052CC',
            'figma': '#F24E1E',
            'ui/ux': '#A29BFE'
        };


        data.skills.forEach(skill => {
            if (!skill.name) return;

            const trimmedSkill = skill.name.trim().toLowerCase();
            const icon = skillIcons[trimmedSkill] || 'patch-check'; // fallback icon
            const color = skillColors[trimmedSkill] || '#6C757D'; // fallback color
            const percentage = skill.percentage || 70; // default percentage

            const li = document.createElement('li');
            li.className = 'skill-item';

            li.innerHTML = `
                <div class="skill-circle-container">
                    <div class="skill-circle" 
                         style="--percentage: ${percentage}; 
                                --color: ${color};
                                position: relative;">
                        <div class="skill-icon-container">
                            <i class="bi bi-${icon}" 
                               style="color: ${color};"></i>
                        </div>
                        <div class="skill-percentage">${percentage}%</div>
                    </div>
                    <p>${capitalizeFirstLetter(trimmedSkill)}</p>
                </div>
            `;
            container.appendChild(li);
        });
    }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.toUpperCase();
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


// Enhanced download functionality
document.getElementById('download-portfolio').addEventListener('click', async function () {
    this.innerHTML = '<i class="bi bi-arrow-clockwise animate-spin"></i>';

    try {
        // 1. Fetch current data from MongoDB
        const response = await fetch('portfolio.php');
        const data = await response.json();

        // 2. Create ZIP structure
        const zip = new JSZip();
        const static = zip.folder("static");
        const css = static.folder("css");
        const js = static.folder("js");
        const images = static.folder("images");

        // 3. Add HTML with embedded data
        let htmlContent = `<!DOCTYPE html>
  <html lang="en">
  <head>
      ${document.head.innerHTML.replace('<script defer src="/static/js/portfolio.js"></script>', '')}
      <style>${await fetchCSS()}</style>
  </head>
  <body>
      ${document.body.innerHTML.replace('<div id="download-portfolio"', '<!-- Download button removed -->')}
      <script>${await fetchJS()}</script>
      <script>
          // Embedded data
          const portfolioData = ${JSON.stringify(data)};
          document.addEventListener('DOMContentLoaded', function() {
              populateBasicInfo(portfolioData);
              populateAbout(portfolioData);
              populateEducation(portfolioData);
              populateProjects(portfolioData);
              populateSkills(portfolioData);
              populateCertifications(portfolioData);
              populateContact(portfolioData);
              animateJobRoles(portfolioData);
          });
      </script>
  </body>
  </html>`;

        zip.file("index.html", htmlContent);

        // 4. Add CSS and JS as separate files
        css.file("portfolio.css", await fetchCSS());
        js.file("portfolio.js", await fetchJS());

        // 5. Add images (profile and certifications)
        await addImageToZip(zip, data.photo_url, "static/images/profile.jpg");
        if (data.certifications) {
            for (let i = 0; i < data.certifications.length; i++) {
                await addImageToZip(zip, data.certifications[i], `static/images/certificate_${i}.jpg`);
            }
        }

        // 6. Generate and download ZIP
        const content = await zip.generateAsync({ type: "blob" });
        downloadBlob(content, "portfolio.zip");

    } catch (error) {
        console.error("Download failed:", error);
        alert("Download failed. Please try again.");
    } finally {
        this.innerHTML = '<i class="bi bi-download"></i>';
    }
});

// Helper functions
async function fetchCSS() {
    const link = Array.from(document.styleSheets)
        .find(sheet => sheet.href && sheet.href.includes('portfolio.css'));
    return link ? await (await fetch(link.href)).text() : '';
}

async function fetchJS() {
    const script = Array.from(document.scripts)
        .find(script => script.src && script.src.includes('portfolio.js'));
    return script ? await (await fetch(script.src)).text() : '';
}

async function addImageToZip(zip, url, filename) {
    if (!url) return;
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        zip.file(filename, blob);
    } catch (error) {
        console.error("Failed to add image:", url, error);
    }
}

function downloadBlob(blob, filename) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}