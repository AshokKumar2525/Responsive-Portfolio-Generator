// Fetch user details from portfolio.php
document.addEventListener('DOMContentLoaded', function() {
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
  container.innerHTML = '';

  if (data.education && data.education.length > 0) {
      data.education.forEach(edu => {
          const col = document.createElement('div');
          col.className = 'col-md-6';
          col.innerHTML = `
              <div class="education-item h-100">
                  <h3>${edu.institution}</h3>
                  <p class="text-muted mb-1"><i class="bi bi-calendar me-2"></i>${edu.duration}</p>
                  <p class="mb-0"><strong>Grade:</strong> ${edu.grade}</p>
              </div>
          `;
          container.appendChild(col);
      });
  } else {
      container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No education information available</p></div>';
  }
}

function populateExperience(data) {
  const container = document.getElementById('experience-container');
  container.innerHTML = '';

  if (data.experience && data.experience.length > 0) {
      data.experience.forEach(exp => {

        // if (!exp.years || !exp.role || !exp.company) {
        //   experience.innerHTML = ""
        //   experience.style.display = 'none';
        //   const navItem = document.querySelector('a.nav-link[href="#experience"]')?.parentElement;
        //   if (navItem) navItem.remove(); // Removes the entire <li> element

        // }else{
          const col = document.createElement('div');
          col.className = 'col-md-6';
          col.innerHTML = `
              <div class="experience-item h-100">
                  <h3 class="experience-position">${exp.role || 'Position not specified'}</h3>
                  <p class="experience-company">${exp.company || 'Company not specified'}</p>
                  <p class="experience-duration"><i class="bi bi-calendar me-2"></i>${exp.years+"years" || 'Duration not specified'}</p>
                  ${exp.description ? `<div class="experience-description">${exp.description}</div>` : ''}
              </div>
          `;
          container.appendChild(col);
        // }
      });
  } else {
    experience.innerHTML = ""
    experience.style.display = 'none';
    const navItem = document.querySelector('a.nav-link[href="#experience"]')?.parentElement;
    if (navItem) navItem.remove(); // Removes the entire <li> element  }
  }
}


function populateProjects(data) {
  const container = document.getElementById('projects-container');
  container.innerHTML = '';

  if (data.projects && data.projects.length > 0) {
      data.projects.forEach(project => {
          const col = document.createElement('div');
          col.className = 'col-md-6 col-lg-4';
          col.innerHTML = `
              <div class="card project-card h-100">
                  ${project.image ? `<img src="${project.image}" class="card-img-top" alt="${project.projectName}">` : ''}
                  <div class="card-body">
                      <h5 class="card-title">${project.projectName}</h5>
                      <p class="card-text">${project.description}</p>
                  </div>
                  <div class="card-footer bg-transparent">
                      <a href="${project.gitrepolink}" target="_blank" class="btn btn-primary">
                          <i class="bi bi-github me-1"></i> View Code
                      </a>
                  </div>
              </div>
          `;
          container.appendChild(col);
      });
  } 
}


function populateAchievements(data) {
  const container = document.getElementById('achievements-list');
  container.innerHTML = '';

  if (data.achievements && data.achievements.length > 0) {
    data.achievements.forEach(item => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = item;
      container.appendChild(li);
    });
  } else {
      achievements.innerHTML = ""
      achievements.style.display = 'none';
      const navItem = document.querySelector('a.nav-link[href="#achievements"]')?.parentElement;
      if (navItem) navItem.remove(); // Removes the entire <li> element
      return
  }
}


function populateCertifications(data) {
  const container = document.getElementById('certifications-container');
  container.innerHTML = '';

  if (data.certifications && data.certifications.length > 0) {
      data.certifications.forEach(cert => {
          const col = document.createElement('div');
          col.className = 'col-md-6 col-lg-4';
          col.innerHTML = `
              <div class="card certification-card h-100">
                  <img src="${cert}" class="card-img-top" alt="Certification">
              </div>
          `;
          container.appendChild(col);
      });
  } else {
      container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No certifications available</p></div>';
  }
}

function setupCertificateModal() {
  const modal = document.createElement('div');
  modal.className = 'certification-modal';
  modal.innerHTML = '<img src="" alt="Certificate">';
  document.body.appendChild(modal);

  document.addEventListener('click', function(e) {
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
  document.getElementById('mobile').textContent = data.mobile;
  document.getElementById('mobile').href = `tel:${data.mobile}`;
  document.getElementById('email').textContent = data.email;
  document.getElementById('sender_email').href = `mailto:${data.email}`;
  document.getElementById('linkedin').href = data.linkedin_link;
  document.getElementById('github').href = data.github_link;
  document.getElementById('instagram').href = data.instagram_link;
}

// // Add this to your portfolio.js
// document.querySelector('.contact-form').addEventListener('submit', function(e) {
//     e.preventDefault();
    
//     const form = e.target;
//     const formData = new FormData(form);
//     const submitButton = form.querySelector('button[type="submit"]');
//     const originalButtonText = submitButton.textContent;
    
//     console.log("fetched : "+formData);
//     // Show loading state
//     // submitButton.disabled = true;
//     // submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
    
//     fetch('send_email.php', {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(response.statusText);
//         }
//         return response.text();
//     })
//     .then(data => {
//         // Show success message
//         const alertDiv = document.createElement('div');
//         alertDiv.className = 'alert alert-success mt-3';
//         alertDiv.textContent = data;
//         form.appendChild(alertDiv);
        
//         // Clear form
//         form.reset();
        
//         // Remove alert after 5 seconds
//         setTimeout(() => {
//             alertDiv.remove();
//         }, 3000);
//     })
//     .catch(error => {
//         // Show error message
//         const alertDiv = document.createElement('div');
//         alertDiv.className = 'alert alert-danger mt-3';
//         alertDiv.textContent = error.message || 'Failed to send message. Please try again.';
//         form.appendChild(alertDiv);
//     })
//     .finally(() => {
//         // Reset button
//         submitButton.disabled = false;
//         submitButton.textContent = originalButtonText;
//     });
// });
