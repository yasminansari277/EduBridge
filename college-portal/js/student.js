/* ==========================================
   EduBridge - Student Module Frontend JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = EduBridgeData.getCurrentUser();
  if (!currentUser || currentUser.role !== 'student') return;

  // 1. Student Dashboard Stats & Quick Lists
  const totalResourcesEl = document.getElementById('stat-total-resources');
  const pendingAsgEl = document.getElementById('stat-pending-assignments');
  const submittedAsgEl = document.getElementById('stat-submitted-assignments');
  const avgGradeEl = document.getElementById('stat-avg-grade');

  if (totalResourcesEl) {
    const resources = EduBridgeData.getResources().filter(r => r.status === 'Approved');
    const assignments = EduBridgeData.getAssignments();
    const submissions = EduBridgeData.getSubmissions().filter(s => s.studentId === currentUser.id);

    totalResourcesEl.textContent = resources.length;
    submittedAsgEl.textContent = submissions.length;
    pendingAsgEl.textContent = Math.max(0, assignments.length - submissions.length);

    // Calculate Average Grade
    const gradedList = submissions.filter(s => s.status === 'Graded');
    if (gradedList.length > 0) {
      const totalPct = gradedList.reduce((acc, curr) => acc + ((curr.gradeMarks / curr.maxMarks) * 100), 0);
      avgGradeEl.textContent = `${Math.round(totalPct / gradedList.length)}%`;
    } else {
      avgGradeEl.textContent = 'N/A';
    }

    // Render Recent Resources List on Dashboard
    const recentResContainer = document.getElementById('recent-resources-list');
    if (recentResContainer) {
      recentResContainer.innerHTML = resources.slice(0, 4).map(r => `
        <div class="d-flex align-items-center justify-between p-3 mb-2" style="background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
          <div class="d-flex align-items-center gap-3">
            <i class="fas fa-file-pdf text-danger" style="font-size:1.25rem;"></i>
            <div>
              <h4 style="font-size:0.9375rem; margin-bottom:0.15rem;">${r.title}</h4>
              <span class="text-xs text-muted">${r.subject} • ${r.teacher} • ${r.uploadDate}</span>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="EduBridgeResources.viewResource('${r.id}')">View</button>
        </div>
      `).join('');
    }

    // Render Upcoming Assignments on Dashboard
    const upcomingAsgContainer = document.getElementById('upcoming-assignments-list');
    if (upcomingAsgContainer) {
      upcomingAsgContainer.innerHTML = assignments.slice(0, 3).map(a => {
        const mySubm = submissions.find(s => s.assignmentId === a.id);
        return EduBridgeAssignments.renderAssignmentCard(a, mySubm);
      }).join('');
    }
  }

  // 2. Student Resources Catalog Page (Search, Filter, Sort)
  const resourceCatalogGrid = document.getElementById('student-resources-grid');
  if (resourceCatalogGrid) {
    const searchInput = document.getElementById('res-search-input');
    const deptFilter = document.getElementById('res-dept-filter');
    const semFilter = document.getElementById('res-sem-filter');
    const typeFilter = document.getElementById('res-type-filter');
    const sortFilter = document.getElementById('res-sort-filter');

    function filterAndRenderResources() {
      let list = EduBridgeData.getResources().filter(r => r.status === 'Approved');

      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const dept = deptFilter ? deptFilter.value : '';
      const sem = semFilter ? semFilter.value : '';
      const type = typeFilter ? typeFilter.value : '';
      const sort = sortFilter ? sortFilter.value : 'newest';

      if (q) {
        list = list.filter(r => r.title.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q) || r.teacher.toLowerCase().includes(q));
      }
      if (dept) list = list.filter(r => r.department === dept);
      if (sem) list = list.filter(r => r.semester === sem);
      if (type) list = list.filter(r => r.type === type);

      if (sort === 'newest') list.sort((a,b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      if (sort === 'oldest') list.sort((a,b) => new Date(a.uploadDate) - new Date(b.uploadDate));

      if (list.length === 0) {
        resourceCatalogGrid.innerHTML = `
          <div style="grid-column: 1/-1; text-align:center; padding:3rem; background:#fff; border-radius:12px; border:1px solid #e2e8f0;">
            <i class="fas fa-search" style="font-size:2.5rem; color:#94a3b8; margin-bottom:1rem;"></i>
            <h4 style="color:#1e293b;">No Resources Found</h4>
            <p class="text-muted text-sm">Try clearing your filters or changing your search terms.</p>
          </div>
        `;
      } else {
        resourceCatalogGrid.innerHTML = list.map(r => EduBridgeResources.renderResourceCard(r)).join('');
      }
    }

    [searchInput, deptFilter, semFilter, typeFilter, sortFilter].forEach(el => {
      if (el) el.addEventListener('input', filterAndRenderResources);
      if (el) el.addEventListener('change', filterAndRenderResources);
    });

    filterAndRenderResources();
  }

  // 3. Student Assignments Page (Tabs & Filters)
  const studentAsgList = document.getElementById('student-assignments-list');
  if (studentAsgList) {
    const tabBtns = document.querySelectorAll('.asg-tab-btn');
    let currentTab = 'all';

    function renderAssignmentsList() {
      const assignments = EduBridgeData.getAssignments();
      const submissions = EduBridgeData.getSubmissions().filter(s => s.studentId === currentUser.id);
      const today = new Date().toISOString().split('T')[0];

      let filtered = assignments.filter(a => {
        const mySubm = submissions.find(s => s.assignmentId === a.id);
        if (currentTab === 'pending') return !mySubm && a.deadline >= today;
        if (currentTab === 'submitted') return mySubm && mySubm.status === 'Submitted';
        if (currentTab === 'graded') return mySubm && mySubm.status === 'Graded';
        if (currentTab === 'overdue') return !mySubm && a.deadline < today;
        return true;
      });

      if (filtered.length === 0) {
        studentAsgList.innerHTML = `<div class="card text-center p-4 text-muted">No assignments in this tab.</div>`;
      } else {
        studentAsgList.innerHTML = filtered.map(a => {
          const mySubm = submissions.find(s => s.assignmentId === a.id);
          return EduBridgeAssignments.renderAssignmentCard(a, mySubm);
        }).join('');
      }
    }

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTab = btn.dataset.tab;
        renderAssignmentsList();
      });
    });

    renderAssignmentsList();
  }

  // 4. Student Grades & Feedback Table Page
  const gradesTableBody = document.getElementById('student-grades-table-body');
  if (gradesTableBody) {
    const submissions = EduBridgeData.getSubmissions().filter(s => s.studentId === currentUser.id);

    gradesTableBody.innerHTML = submissions.map(s => `
      <tr>
        <td><strong>${s.assignmentTitle}</strong></td>
        <td>${s.subject}</td>
        <td>${s.submittedDate}</td>
        <td><span class="badge badge-${s.status.toLowerCase()}">${s.status}</span></td>
        <td><strong>${s.gradeMarks !== null ? `${s.gradeMarks} / ${s.maxMarks}` : 'Pending Review'}</strong></td>
        <td>
          ${s.feedback ? `<button class="btn btn-outline btn-sm" onclick="showFeedbackModal('${s.id}')"><i class="fas fa-comment-alt"></i> View Feedback</button>` : '<span class="text-xs text-muted">No feedback yet</span>'}
        </td>
      </tr>
    `).join('');

    window.showFeedbackModal = function(submId) {
      const subm = submissions.find(x => x.id === submId);
      if (!subm) return;

      const body = document.getElementById('feedback-modal-body');
      if (body) {
        body.innerHTML = `
          <h4>${subm.assignmentTitle}</h4>
          <p class="text-sm text-muted mb-3">Evaluated on ${subm.evalDate || 'N/A'}</p>
          <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:1rem; margin-bottom:1rem;">
            <strong>Marks Obtained:</strong> <span style="color:var(--primary); font-size:1.25rem; font-weight:700;">${subm.gradeMarks} / ${subm.maxMarks}</span>
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:1rem;">
            <strong>Teacher Feedback:</strong>
            <p style="margin-top:0.5rem; color:#334155; line-height:1.6;">"${subm.feedback}"</p>
          </div>
        `;
        EduBridge.openModal('feedback-modal');
      }
    };
  }

  // 5. Student Profile Page Form
  const profileForm = document.getElementById('student-profile-form');
  if (profileForm) {
    document.getElementById('prof-name').value = currentUser.name;
    document.getElementById('prof-email').value = currentUser.email;
    document.getElementById('prof-dept').value = currentUser.department;
    if (document.getElementById('prof-sem')) document.getElementById('prof-sem').value = currentUser.semester || 'Sem 5';

    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      currentUser.name = document.getElementById('prof-name').value;
      currentUser.department = document.getElementById('prof-dept').value;
      if (document.getElementById('prof-sem')) currentUser.semester = document.getElementById('prof-sem').value;

      EduBridgeData.setCurrentUser(currentUser);
      EduBridge.toast('Profile updated successfully!', 'success');
    });
  }
});
