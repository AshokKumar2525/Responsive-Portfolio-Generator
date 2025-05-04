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
            setupMobileFooterNav();

        })
        .catch(error => {
            console.error("Error:", error);
        });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    window.addEventListener('load', setupMobileFooterNav);
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
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav');

    // Keep hamburger toggle functionality
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Update nav link click handler
    navLinks.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.classList.contains('nav-link')) {
            // Close hamburger menu
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            
            // Remove active class from all nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Scroll to section
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

    // Keep your existing setupMobileFooterNav call
    setupMobileFooterNav();
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
    if (data.linkedin_link) {
        document.getElementById('home-linkedin').href = data.linkedin_link;
    }
    if (data.github_link) {
        document.getElementById('home-github').href = data.github_link;
    }
    if (data.instagram_link) {
        document.getElementById('home-instagram').href = data.instagram_link;
    }
}

function populateAbout(data) {
    document.getElementById('about-text').textContent = data.about;
    document.getElementById('about-pic').src = data.photo_url;
}

function animateJobRoles() {
    const roleElement = document.getElementById('role');
    if (!roleElement) return;

    const roles = roleElement.textContent.split(',').map(role => role.trim());
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

    // Category images
    const projectImages = {
        web: 'https://www.simplilearn.com/ice9/free_resources_article_thumb/is_web_development_good_career.jpg',
        app: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSulieNelCE-4vVUdJEkKqzaB1ozfaiBVD2cg&s',
        ai: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrnHVCs-jJahz5GCiPcMMnI0eI02wsr7rpIw&s",
        ml: "data:image/jpeg;base64,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",
        backend: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzPx1LnsBlPmhxk2riPgf0qEAnW6swPq9lhQ&s',
        dataviz: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3iIl_tl_g_UxtJzzrjgqkt6GNRB93vtMPVw&s',
        iot: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-rBlnaAsGOGbUu6XGabpH8x27DwIQcaPgwg&s',
        cloud: 'data:image/jpeg;base64,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',
        security: 'data:image/jpeg;base64,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',
        automation: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj0T6Bwn6Qc1MAPlDXeFwxeHO__VaNmUISAg&s',
        uiux: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7RDZwGRd1I7JmgQFoy7bhK3KdHCl13TWJgA&s'
    };

    // Keywords for category detection
    const categoryKeywords = {
        web: ['website', 'html', 'css', 'frontend', 'web app'],
        app: ['android', 'ios', 'mobile', 'flutter', 'react native'],
        ai: ['ai', 'model'],
        backend: ['api', 'node', 'server', 'express', 'mongodb', 'mysql', 'backend'],
        dataviz: ['graph', 'chart', 'visualization', 'dashboard', 'plot'],
        iot: ['iot', 'arduino', 'raspberry', 'sensor', 'hardware', 'robotics'],
        cloud: ['cloud', 'aws', 'gcp', 'azure', 'deployment', 'kubernetes'],
        security: ['security', 'authentication', 'encryption', 'jwt', 'cyber'],
        automation: ['bot', 'automation', 'script', 'task', 'automate'],
        uiux: ['design', 'ui', 'ux', 'prototype', 'figma', 'responsive'],
        ml: ['ml', 'machine learning', 'deep learning', 'neural network', 'predictive model',"predict", 'classification']
    };
    

    function getProjectCategory(text) {
        text = text.toLowerCase();
        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                return category;
            }
        }
        return 'web'; // default fallback
    }

    for (const project of data.projects) {
        if (!project.projectName || !project.description) continue;

        const fullText = `${project.projectName} ${project.description}`;
        const category = getProjectCategory(fullText);
        const backgroundImage = projectImages[category];

        const initials = project.projectName
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);

        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA502', '#A29BFE', '#6C5CE7', '#00B894'];
        const colorIndex = Math.abs(hashCode(project.projectName)) % colors.length;
        const color = colors[colorIndex];

        const svgPlaceholder = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'>
                <rect width='600' height='400' fill='${color}'/>
                <text x='50%' y='50%' fill='white' font-family='Arial' font-size='80' font-weight='bold' 
                      text-anchor='middle' dominant-baseline='middle'>
                    ${initials}
                </text>
            </svg>`
        )}`;

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

        // Load background image
        const imgElement = col.querySelector('.project-image');
        const tempImg = new Image();
        tempImg.onload = function () {
            imgElement.src = backgroundImage;
        };
        tempImg.onerror = function () {
            // SVG stays
        };
        tempImg.src = backgroundImage;
    }

    function hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }
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
            'c++': 'braces',
            'php': 'filetype-php',
            'javascript': 'filetype-js',
            'html': 'filetype-html',
            'css': 'filetype-css',
            'react': 'globe2',
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
            'firebase': 'bi bi-fire',
            'docker': 'box',
            'linux': 'ubuntu',
            'bash': 'bi bi-terminal',
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
// Add this function to your portfolio.js
function setupMobileFooterNav() {
    // Get all nav links from the header
    const navLinks = document.querySelectorAll('header .nav-link[href^="#"]');
    const footerNav = document.getElementById('mobile-footer-nav');
    
    // Clear existing footer links
    if (footerNav) footerNav.innerHTML = '';
    
    // Clone each nav link to the footer
    navLinks.forEach(link => {
        if (link.href.includes('#logout')) return; // Skip logout button
        
        const li = document.createElement('li');
        const a = link.cloneNode(true);
        
        // Remove navbar-specific classes and add footer classes
        a.className = '';
        a.classList.add('footer-nav-link');
        
        li.appendChild(a);
        if (footerNav) footerNav.appendChild(li);
    });
    
    // Hide footer nav if no links were added
    if (footerNav && footerNav.children.length === 0) {
        document.querySelector('.mobile-footer-nav').style.display = 'none';
    }
}

document.getElementById('download-portfolio').addEventListener('click', async function () {
    this.innerHTML = '<i class="bi bi-arrow-clockwise animate-spin"></i>';
    
    try {
        // 1. Fetch current data
        const response = await fetch('portfolio.php');
        const data = await response.json();
        
        // 2. Create ZIP structure
        const zip = new JSZip();
        const static = zip.folder("static");
        const css = static.folder("css");
        const js = static.folder("js");
        const images = static.folder("images");
        
        // 3. Add HTML with corrected paths
        let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="Cache-Control" content="no-store">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data.name || 'Professional Portfolio'}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="static/css/portfolio.css" />
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <style>${await fetchCSS()}</style>
</head>
<body>
    ${document.body.innerHTML
        .replace(/<div id="download-portfolio"[^>]*>.*?<\/div>/gs, '')
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
        .replace(/<li class="nav-item">\s*<a href="portfolio\.php\?action=logout" class="btn btn-outline-danger btn-sm logout-btn">\s*<i class="bi bi-box-arrow-right me-1"><\/i> Logout\s*<\/a>\s*<\/li>/g, '')
    }
    <script src="static/js/portfolio.js"></script>
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Embedded data
        const portfolioData = ${JSON.stringify(data)};
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize with embedded data
            if (typeof populateBasicInfo === 'function') populateBasicInfo(portfolioData);
            if (typeof populateAbout === 'function') populateAbout(portfolioData);
            if (typeof populateEducation === 'function') populateEducation(portfolioData);
            if (typeof populateExperience === 'function') populateExperience(portfolioData);
            if (typeof populateProjects === 'function') populateProjects(portfolioData);
            if (typeof populateSkills === 'function') populateSkills(portfolioData);
            if (typeof populateCertifications === 'function') populateCertifications(portfolioData);
            if (typeof populateContact === 'function') populateContact(portfolioData);
            if (typeof populateAchievements === 'function') populateAchievements(portfolioData);
            if (typeof animateJobRoles === 'function') animateJobRoles(portfolioData);
            if (typeof setupCertificateModal === 'function') setupCertificateModal();
            
            // Initialize AOS animation
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    easing: 'ease-in-out',
                    once: true
                });
            }
        });
    </script>
</body>
</html>`;

        zip.file("index.html", htmlContent);
        
        // 4. Add CSS and JS files
        css.file("portfolio.css", await fetchCSS());
        
        // Modified JS file handling to prevent corruption
        const jsContent = await fetchJS();
        js.file("portfolio.js", jsContent);
        
        // 5. Download and add profile photo
        if (data.photo_url) {
            try {
                const imgResponse = await fetch(data.photo_url);
                if (imgResponse.ok) {
                    const imgBlob = await imgResponse.blob();
                    images.file("profile.jpg", imgBlob);
                    // Update the HTML to use local path
                    htmlContent = htmlContent
                        .replace(new RegExp(data.photo_url, 'g'), 'static/images/profile.jpg')
                        .replace(/src="[^"]*\/about-pic[^"]*"/g, 'src="static/images/profile.jpg"');
                }
            } catch (error) {
                console.error("Failed to download profile image:", error);
            }
        }
        
        // 6. Download and add certification images
        if (data.certifications && data.certifications.length > 0) {
            for (let i = 0; i < data.certifications.length; i++) {
                const certUrl = data.certifications[i];
                try {
                    const certResponse = await fetch(certUrl);
                    if (certResponse.ok) {
                        const certBlob = await certResponse.blob();
                        images.file(`certificate_${i}.jpg`, certBlob);
                        // Update the HTML to use local paths
                        htmlContent = htmlContent.replace(
                            new RegExp(certUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 
                            `static/images/certificate_${i}.jpg`
                        );
                    }
                } catch (error) {
                    console.error("Failed to download certificate image:", certUrl, error);
                }
            }
        }
        
        // Update the HTML in the zip with the corrected image paths
        zip.file("index.html", htmlContent);
        
        // 7. Generate and download ZIP
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = "portfolio.zip";
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
    } catch (error) {
        console.error("Download failed:", error);
        alert("Download failed. Please try again.");
    } finally {
        this.innerHTML = '<i class="bi bi-download"></i>';
    }
});

// Improved JS file fetcher
async function fetchJS() {
    try {
        // Get all script tags
        const scripts = Array.from(document.scripts);
        const portfolioScript = scripts.find(script => 
            script.src && script.src.includes('portfolio.js')
        );
        
        if (!portfolioScript) return '';
        
        // Fetch original JS content
        const response = await fetch(portfolioScript.src);
        let jsContent = await response.text();
        
        // Clean up the content more carefully
        jsContent = jsContent
            // Remove the download event listener
            .replace(
                /\/\/\s*Download\s*button[\s\S]*?document\.getElementById\('download-portfolio'\)[\s\S]*?}\);?/g,
                ''
            )
            // Remove any sourceMappingURL comment
            .replace(/\/\/#\s*sourceMappingURL=.*$/gm, '')
            // Ensure proper termination
            .trim();
            
        // Validate the JS content
        try {
            new Function(jsContent);
            return jsContent;
        } catch (e) {
            console.error("Invalid JS content after processing:", e);
            return '';
        }
    } catch (error) {
        console.error("Failed to fetch JS:", error);
        return '';
    }
}

// CSS file fetcher remains the same
async function fetchCSS() {
    const link = Array.from(document.styleSheets)
        .find(sheet => sheet.href && sheet.href.includes('portfolio.css'));
    return link ? await (await fetch(link.href)).text() : '';
}