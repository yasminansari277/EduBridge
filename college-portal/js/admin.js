/* ==========================================
   EduBridge - Admin Module Frontend JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = EduBridgeData.getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') return;

  // 1. Admin Dashboard Stats
  const statStudents = document.getElementById('admin-stat-students');
  const statTeachers = document.getElementById('admin-stat-teachers');
  const statResources = document.getElementById('admin-stat-resources');
  const statAssignments = document.getElementById('admin-stat-assignments');

  if (statStudents) {
    const users = EduBridgeData.getUsers();
    const resources = EduBridgeData.getResources();
    const assignments = EduBridgeData.getAssignments();

    statStudents.textContent = users.filter(u => u.role === 'student').length;
    statTeachers.textContent = users.filter(u => u.role === 'teacher').length;
    statResources.textContent = resources.length;
    statAssignments.textContent = assignments.length;
  }

  // 2. User Management Page Logic
  const usersTableBody = document.getElementById('admin-users-table-body');
  if (usersTableBody) {
    const searchInput = document.getElementById('user-search');
    const roleFilter = document.getElementById('user-role-filter');
    const statusFilter = document.getElementById('user-status-filter');

    function renderUsersTable() {
      let users = EduBridgeData.getUsers();
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const role = roleFilter ? roleFilter.value : '';
      const status = statusFilter ? statusFilter.value : '';

      if (q) users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
      if (role) users = users.filter(u => u.role === role);
      if (status) users = users.filter(u => u.status === status);

      usersTableBody.innerHTML = users.map(u => `
        <tr>
          <td>
            <div class="d-flex align-items-center gap-2">
              <div class="avatar" style="width:32px; height:32px; font-size:0.75rem;">${u.avatar || 'U'}</div>
              <strong>${u.name}</strong>
            </div>
          </td>
          <td>${u.email}</td>
          <td><span class="badge badge-info">${u.role.toUpperCase()}</span></td>
          <td>${u.department} ${u.semester ? `(${u.semester})` : ''}</td>
          <td><span class="badge badge-${u.status === 'active' ? 'active' : 'inactive'}">${u.status}</span></td>
          <td>
            <div class="d-flex gap-1">
              <button class="btn btn-outline btn-sm" onclick="EduBridgeAdmin.toggleUserStatus('${u.id}')">
                <i class="fas ${u.status === 'active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
              </button>
              <button class="btn btn-danger btn-sm" onclick="EduBridgeAdmin.deleteUser('${u.id}')">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    [searchInput, roleFilter, statusFilter].forEach(el => {
      if (el) el.addEventListener('input', renderUsersTable);
      if (el) el.addEventListener('change', renderUsersTable);
    });

    renderUsersTable();

    // Add User Form Listener
    const addUserForm = document.getElementById('add-user-form');
    if (addUserForm) {
      addUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('new-user-name').value.trim();
        const email = document.getElementById('new-user-email').value.trim();
        const role = document.getElementById('new-user-role').value;
        const dept = document.getElementById('new-user-dept').value;

        if (!name || !email || !role || !dept) {
          EduBridge.toast('Please fill all required fields', 'danger');
          return;
        }

        const newUser = {
          name,
          email,
          role,
          department: dept,
          semester: role === 'student' ? 'Sem 1' : '',
          avatar: name.split(' ').map(n=>n[0]).join('').toUpperCase().substring(0,2),
          status: 'active'
        };

        EduBridgeData.addUser(newUser);
        EduBridge.toast('User added successfully!', 'success');
        EduBridge.closeModal('add-user-modal');
        renderUsersTable();
      });
    }
  }

  // 3. Subject Management Page Logic
  const subjectsTableBody = document.getElementById('admin-subjects-table-body');
  if (subjectsTableBody) {
    function renderSubjectsTable() {
      const list = EduBridgeData.getSubjects();
      subjectsTableBody.innerHTML = list.map(s => `
        <tr>
          <td><strong>${s.code}</strong></td>
          <td>${s.name}</td>
          <td>${s.department}</td>
          <td>${s.semester}</td>
          <td>${s.teacher}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="EduBridgeAdmin.deleteSubject('${s.id}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </td>
        </tr>
      `).join('');
    }

    renderSubjectsTable();

    const addSubjForm = document.getElementById('add-subject-form');
    if (addSubjForm) {
      addSubjForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('subj-code').value.trim();
        const name = document.getElementById('subj-name').value.trim();
        const dept = document.getElementById('subj-dept').value;
        const sem = document.getElementById('subj-sem').value;
        const teacher = document.getElementById('subj-teacher').value;

        EduBridgeData.addSubject({ code, name, department: dept, semester: sem, teacher });
        EduBridge.toast('Subject added successfully!', 'success');
        EduBridge.closeModal('add-subject-modal');
        renderSubjectsTable();
      });
    }
  }

  // 4. Moderation Page Logic
  const moderationGrid = document.getElementById('admin-moderation-grid');
  if (moderationGrid) {
    function renderModerationGrid() {
      const resources = EduBridgeData.getResources();
      moderationGrid.innerHTML = resources.map(r => `
        <div class="moderation-card ${r.status.toLowerCase()}">
          <div class="moderation-meta">
            <div class="d-flex justify-between align-items-center mb-2">
              <span class="badge badge-info">${r.type}</span>
              <span class="badge badge-${r.status.toLowerCase()}">${r.status}</span>
            </div>
            <h4 style="font-size:1rem; margin-bottom:0.35rem;">${r.title}</h4>
            <p class="text-xs text-muted mb-2">Subject: ${r.subject} | Teacher: ${r.teacher}</p>
            <p class="text-xs text-muted">Uploaded on ${r.uploadDate} (${r.fileName})</p>
          </div>
          
          <div class="moderation-actions">
            ${r.status === 'Pending' ? `
              <button class="btn btn-success btn-sm w-100" onclick="EduBridgeAdmin.updateResourceStatus('${r.id}', 'Approved')">
                <i class="fas fa-check"></i> Approve
              </button>
              <button class="btn btn-danger btn-sm w-100" onclick="EduBridgeAdmin.updateResourceStatus('${r.id}', 'Rejected')">
                <i class="fas fa-times"></i> Reject
              </button>
            ` : `
              <button class="btn btn-outline btn-sm w-100" onclick="EduBridgeAdmin.updateResourceStatus('${r.id}', '${r.status === 'Approved' ? 'Pending' : 'Approved'}')">
                Toggle Status
              </button>
            `}
          </div>
        </div>
      `).join('');
    }

    renderModerationGrid();
  }
});

window.EduBridgeAdmin = {
  toggleUserStatus: function(id) {
    const users = EduBridgeData.getUsers();
    const u = users.find(x => x.id === id);
    if (!u) return;

    const newStatus = u.status === 'active' ? 'inactive' : 'active';
    EduBridgeData.updateUserStatus(id, newStatus);
    EduBridge.toast(`User ${u.name} status changed to ${newStatus}`, 'info');
    setTimeout(() => window.location.reload(), 500);
  },

  deleteUser: function(id) {
    if (confirm('Are you sure you want to delete this user?')) {
      EduBridgeData.deleteUser(id);
      EduBridge.toast('User deleted', 'warning');
      setTimeout(() => window.location.reload(), 500);
    }
  },

  deleteSubject: function(id) {
    if (confirm('Are you sure you want to delete this subject?')) {
      EduBridgeData.deleteSubject(id);
      EduBridge.toast('Subject deleted', 'warning');
      setTimeout(() => window.location.reload(), 500);
    }
  },

  updateResourceStatus: function(id, status) {
    EduBridgeData.updateResourceStatus(id, status);
    EduBridge.toast(`Resource status updated to ${status}`, 'success');
    setTimeout(() => window.location.reload(), 500);
  }
};
