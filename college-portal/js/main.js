/* ==========================================
   EduBridge - Main Application Shared Utilities
   ========================================= */

window.EduBridge = {
  // Toast Alerts
  toast: function(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toastEl = document.createElement('div');
    toastEl.className = `toast toast-${type}`;
    
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'danger') iconClass = 'fa-exclamation-circle';
    if (type === 'warning') iconClass = 'fa-exclamation-triangle';

    toastEl.innerHTML = `
      <i class="fas ${iconClass}"></i>
      <span style="flex:1;">${message}</span>
      <button style="background:none;border:none;color:#fff;cursor:pointer;opacity:0.8;" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;

    container.appendChild(toastEl);
    setTimeout(() => {
      if (toastEl.parentElement) {
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateY(15px)';
        toastEl.style.transition = 'all 0.3s ease';
        setTimeout(() => toastEl.remove(), 300);
      }
    }, 4000);
  },

  // Modal Manager
  openModal: function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal: function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  },

  // Session Check & User Role Display
  initUserSession: function() {
    const currentUser = EduBridgeData.getCurrentUser();
    if (!currentUser) return;

    // Update avatar text & user info labels if elements present
    const avatars = document.querySelectorAll('.user-avatar-text');
    avatars.forEach(el => el.textContent = currentUser.avatar || 'U');

    const nameEls = document.querySelectorAll('.user-name-text');
    nameEls.forEach(el => el.textContent = currentUser.name);

    const roleEls = document.querySelectorAll('.user-role-text');
    roleEls.forEach(el => el.textContent = currentUser.role.toUpperCase());
  },

  // Logout Handler
  logout: function() {
    EduBridge.toast('Logged out successfully', 'info');
    setTimeout(() => {
      window.location.href = '../login.html';
    }, 500);
  }
};

// Global Event Listeners & UI Binding on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  EduBridge.initUserSession();

  // Sidebar toggle for tablet & mobile
  const toggleBtn = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('show');
      }
    });
  }

  // Active Link Highlighting
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-item-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href.replace('../', ''))) {
      link.classList.add('active');
    }
  });

  // Notification Bell Popover
  const notifBtn = document.getElementById('notif-btn');
  const notifPopover = document.getElementById('notif-popover');
  if (notifBtn && notifPopover) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifPopover.classList.toggle('show');
      EduBridgeData.markNotificationsRead();
      const badge = notifBtn.querySelector('.notif-badge');
      if (badge) badge.style.display = 'none';
    });

    document.addEventListener('click', () => {
      notifPopover.classList.remove('show');
    });
  }

  // Modal Backdrop Close Listeners
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        EduBridge.closeModal(modal.id);
      }
    });
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) EduBridge.closeModal(modal.id);
    });
  });
});
