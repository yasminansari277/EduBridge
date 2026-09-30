

document.addEventListener('DOMContentLoaded', () => {
  // Password Show / Hide Toggle
  const togglePasswordBtns = document.querySelectorAll('.password-toggle-btn');
  togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling || btn.parentElement.querySelector('input');
      if (input) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        }
      }
    });
  });

  // Role Tab Switching on Login Form
  const roleTabBtns = document.querySelectorAll('.role-tab-btn');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  let selectedRole = 'student';

  if (roleTabBtns.length > 0) {
    roleTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        roleTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedRole = btn.dataset.role;

        // Auto fill demo credentials for user convenience
        if (selectedRole === 'student') {
          if (emailInput) emailInput.value = 'aarav.student@college.edu';
          if (passwordInput) passwordInput.value = 'password123';
        } else if (selectedRole === 'teacher') {
          if (emailInput) emailInput.value = 'suresh.teacher@college.edu';
          if (passwordInput) passwordInput.value = 'password123';
        } else if (selectedRole === 'admin') {
          if (emailInput) emailInput.value = 'admin@college.edu';
          if (passwordInput) passwordInput.value = 'password123';
        }
      });
    });
  }

  // Handle Login Form Submit
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';

      if (!email || !password) {
        EduBridge.toast('Please enter both email and password', 'danger');
        return;
      }

      // Check users from mock storage
      const users = EduBridgeData.getUsers();
      let matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!matchedUser) {
        // Fallback for role tab demo if email not matched
        matchedUser = users.find(u => u.role === selectedRole);
      }

      if (matchedUser) {
        EduBridgeData.setCurrentUser(matchedUser);
        EduBridge.toast(`Welcome back, ${matchedUser.name}! Logging in...`, 'success');
        
        setTimeout(() => {
          if (matchedUser.role === 'student') {
            window.location.href = 'student/dashboard.html';
          } else if (matchedUser.role === 'teacher') {
            window.location.href = 'teacher/dashboard.html';
          } else if (matchedUser.role === 'admin') {
            window.location.href = 'admin/dashboard.html';
          }
        }, 800);
      } else {
        EduBridge.toast('Invalid login credentials', 'danger');
      }
    });
  }

  // Handle Register Form Submit
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const confirmPassword = document.getElementById('reg-confirm-password').value;
      const role = document.getElementById('reg-role').value;
      const department = document.getElementById('reg-department').value;
      const semester = document.getElementById('reg-semester') ? document.getElementById('reg-semester').value : '';

      if (!name || !email || !password || !role || !department) {
        EduBridge.toast('Please fill in all required fields', 'danger');
        return;
      }

      if (password !== confirmPassword) {
        EduBridge.toast('Passwords do not match', 'danger');
        return;
      }

      // Add user to mock database
      const newUser = {
        name,
        email,
        role,
        department,
        semester: role === 'student' ? semester : '',
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
        status: 'active'
      };

      EduBridgeData.addUser(newUser);
      EduBridgeData.setCurrentUser(newUser);

      EduBridge.toast('Account registered successfully! Redirecting...', 'success');
      setTimeout(() => {
        if (role === 'student') window.location.href = 'student/dashboard.html';
        else if (role === 'teacher') window.location.href = 'teacher/dashboard.html';
        else window.location.href = 'admin/dashboard.html';
      }, 1000);
    });

    // Dynamic show/hide semester dropdown for registration
    const roleSelect = document.getElementById('reg-role');
    const semGroup = document.getElementById('reg-semester-group');
    if (roleSelect && semGroup) {
      roleSelect.addEventListener('change', () => {
        if (roleSelect.value === 'student') {
          semGroup.style.display = 'block';
        } else {
          semGroup.style.display = 'none';
        }
      });
    }
  }

  // Handle Forgot Password Form Submit
  const forgotForm = document.getElementById('forgot-password-form');
  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email').value.trim();
      if (!email) {
        EduBridge.toast('Please enter your email address', 'danger');
        return;
      }

      const msgBox = document.getElementById('forgot-success-message');
      if (msgBox) {
        msgBox.style.display = 'block';
        msgBox.innerHTML = `
          <i class="fas fa-check-circle" style="color: var(--success);"></i>
          <span>Password reset link sent to <strong>${email}</strong>. (PHP Mailer simulation)</span>
        `;
      }
      EduBridge.toast('Password reset link sent!', 'success');
    });
  }
});
