/* ==========================================
   EduBridge - Assignments Module JavaScript
   ========================================== */

window.EduBridgeAssignments = {
  getAssignmentStatusBadge: function(asg, studentSubmission) {
    const today = new Date().toISOString().split('T')[0];
    
    if (studentSubmission) {
      if (studentSubmission.status === 'Graded') {
        return `<span class="badge badge-graded"><i class="fas fa-star"></i> Graded (${studentSubmission.gradeMarks}/${studentSubmission.maxMarks})</span>`;
      }
      return `<span class="badge badge-submitted"><i class="fas fa-check-circle"></i> Submitted</span>`;
    }

    if (asg.deadline < today) {
      return `<span class="badge badge-overdue"><i class="fas fa-exclamation-triangle"></i> Overdue</span>`;
    }

    return `<span class="badge badge-pending"><i class="fas fa-clock"></i> Pending</span>`;
  },

  renderAssignmentCard: function(asg, studentSubmission = null) {
    const badge = EduBridgeAssignments.getAssignmentStatusBadge(asg, studentSubmission);

    return `
      <div class="card mb-3" id="asg-card-${asg.id}">
        <div class="d-flex justify-between align-items-center mb-2">
          <span class="badge badge-info">${asg.subject}</span>
          ${badge}
        </div>
        
        <h3 class="card-title mb-2" style="font-size:1.1rem;">${asg.title}</h3>
        <p class="text-sm text-muted mb-3">${asg.description}</p>
        
        <div class="d-flex justify-between align-items-center text-xs text-muted pt-3" style="border-top: 1px solid var(--border-color);">
          <div>
            <span><i class="fas fa-user-tie"></i> ${asg.teacher}</span> |
            <span><i class="fas fa-calendar-alt"></i> Deadline: <strong>${asg.deadline}</strong></span>
          </div>
          <div>
            <button class="btn btn-outline btn-sm" onclick="EduBridgeAssignments.viewDetails('${asg.id}')">
              <i class="fas fa-arrow-right"></i> View Details
            </button>
          </div>
        </div>
      </div>
    `;
  },

  viewDetails: function(id) {
    const list = EduBridgeData.getAssignments();
    const asg = list.find(a => a.id === id);
    if (!asg) return;

    sessionStorage.setItem('edubridge_selected_assignment', JSON.stringify(asg));
    window.location.href = `assignment-details.html?id=${id}`;
  },

  loadDetailsPage: function() {
    const selected = sessionStorage.getItem('edubridge_selected_assignment');
    const asg = selected ? JSON.parse(selected) : EduBridgeData.getAssignments()[0];
    if (!asg) return;

    const titleEl = document.getElementById('asg-details-title');
    const subjEl = document.getElementById('asg-details-subj');
    const teacherEl = document.getElementById('asg-details-teacher');
    const deadlineEl = document.getElementById('asg-details-deadline');
    const marksEl = document.getElementById('asg-details-marks');
    const descEl = document.getElementById('asg-details-desc');
    const attachEl = document.getElementById('asg-details-attach');

    if (titleEl) titleEl.textContent = asg.title;
    if (subjEl) subjEl.textContent = asg.subject;
    if (teacherEl) teacherEl.textContent = asg.teacher;
    if (deadlineEl) deadlineEl.textContent = asg.deadline;
    if (marksEl) marksEl.textContent = `${asg.maxMarks} Marks`;
    if (descEl) descEl.textContent = asg.description;
    if (attachEl && asg.attachment) {
      attachEl.innerHTML = `
        <a href="#" class="btn btn-outline btn-sm" onclick="EduBridge.toast('Downloading attachment: ${asg.attachment}', 'info'); return false;">
          <i class="fas fa-paperclip"></i> ${asg.attachment}
        </a>
      `;
    }

    // Check existing submission for current logged in user
    const currentUser = EduBridgeData.getCurrentUser();
    const submissions = EduBridgeData.getSubmissions();
    const mySubm = submissions.find(s => s.assignmentId === asg.id && s.studentId === currentUser.id);

    const submStatusBox = document.getElementById('submission-status-box');
    if (submStatusBox) {
      if (mySubm) {
        submStatusBox.innerHTML = `
          <div class="card" style="background:var(--success-light); border-color:var(--success-border);">
            <div class="d-flex align-items-center gap-3">
              <i class="fas fa-check-circle text-success" style="font-size:2rem;"></i>
              <div>
                <h4 style="color:var(--navy-900);">Assignment Already Submitted</h4>
                <p class="text-sm text-muted">File: <strong>${mySubm.fileName}</strong> (${mySubm.submittedDate})</p>
                ${mySubm.status === 'Graded' ? `<p class="text-sm font-semibold text-primary mt-1">Grade: ${mySubm.gradeMarks}/${mySubm.maxMarks} — Feedback: "${mySubm.feedback}"</p>` : ''}
              </div>
            </div>
          </div>
        `;
      }
    }

    // Form submission listener
    const submForm = document.getElementById('assignment-submit-form');
    if (submForm) {
      submForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('subm-file');
        const comments = document.getElementById('subm-comments') ? document.getElementById('subm-comments').value : '';

        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
          EduBridge.toast('Please select a file to submit (PDF, DOCX, JPG, PNG, ZIP)', 'danger');
          return;
        }

        const file = fileInput.files[0];
        const ext = file.name.split('.').pop().toLowerCase();
        const validExts = ['pdf', 'docx', 'jpg', 'png', 'zip', 'py'];

        if (!validExts.includes(ext)) {
          EduBridge.toast(`Unsupported file extension: .${ext}. Only PDF, DOCX, Images, and ZIP allowed.`, 'danger');
          return;
        }

        // Add to submissions
        const newSubm = {
          assignmentId: asg.id,
          assignmentTitle: asg.title,
          studentId: currentUser.id,
          studentName: currentUser.name,
          subject: asg.subject,
          fileName: file.name,
          fileType: ext,
          comments: comments,
          maxMarks: asg.maxMarks
        };

        EduBridgeData.addSubmission(newSubm);
        EduBridge.toast('Assignment submitted successfully!', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
  }
};
