/* ==========================================
   EduBridge - Teacher Module Frontend JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = EduBridgeData.getCurrentUser();
  if (!currentUser || currentUser.role !== 'teacher') return;

  // 1. Teacher Dashboard Statistics
  const uploadedResEl = document.getElementById('teacher-stat-resources');
  const activeAsgEl = document.getElementById('teacher-stat-assignments');
  const pendingSubmEl = document.getElementById('teacher-stat-pending');
  const gradedSubmEl = document.getElementById('teacher-stat-graded');

  if (uploadedResEl) {
    const resources = EduBridgeData.getResources().filter(r => r.teacher === currentUser.name);
    const assignments = EduBridgeData.getAssignments().filter(a => a.teacher === currentUser.name);
    const allSubmissions = EduBridgeData.getSubmissions();

    const pendingSubmissions = allSubmissions.filter(s => s.status === 'Submitted');
    const gradedSubmissions = allSubmissions.filter(s => s.status === 'Graded');

    uploadedResEl.textContent = resources.length;
    activeAsgEl.textContent = assignments.length;
    pendingSubmEl.textContent = pendingSubmissions.length;
    gradedSubmEl.textContent = gradedSubmissions.length;

    // Pending Review Submissions List on Dashboard
    const pendingListContainer = document.getElementById('teacher-pending-reviews-list');
    if (pendingListContainer) {
      if (pendingSubmissions.length === 0) {
        pendingListContainer.innerHTML = `<p class="text-sm text-muted">No pending submissions to review.</p>`;
      } else {
        pendingListContainer.innerHTML = pendingSubmissions.map(s => `
          <div class="d-flex align-items-center justify-between p-3 mb-2" style="background:#fff; border:1px solid #e2e8f0; border-radius:8px;">
            <div>
              <h4 style="font-size:0.9375rem; margin-bottom:0.15rem;">${s.studentName}</h4>
              <span class="text-xs text-muted">${s.assignmentTitle} • ${s.submittedDate}</span>
            </div>
            <button class="btn btn-primary btn-sm" onclick="EduBridgeTeacher.reviewSubmission('${s.id}')">
              <i class="fas fa-edit"></i> Grade
            </button>
          </div>
        `).join('');
      }
    }
  }

  // 2. Drag & Drop Resource Upload Page
  const dropzone = document.getElementById('upload-dropzone');
  const fileInput = document.getElementById('resource-file-input');
  const uploadForm = document.getElementById('upload-resource-form');
  let selectedFile = null;

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        handleFileSelection(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        handleFileSelection(fileInput.files[0]);
      }
    });

    function handleFileSelection(file) {
      selectedFile = file;
      const fileBox = document.getElementById('selected-file-box');
      if (fileBox) {
        fileBox.style.display = 'flex';
        fileBox.innerHTML = `
          <div class="d-flex align-items-center gap-2">
            <i class="fas fa-file-alt text-primary" style="font-size:1.25rem;"></i>
            <div>
              <span style="font-weight:600; font-size:0.875rem;">${file.name}</span>
              <span class="text-xs text-muted">(${(file.size / (1024*1024)).toFixed(2)} MB)</span>
            </div>
          </div>
          <button type="button" class="btn btn-outline btn-sm text-danger" onclick="removeSelectedFile()"><i class="fas fa-trash"></i></button>
        `;
      }
    }

    window.removeSelectedFile = function() {
      selectedFile = null;
      if (fileInput) fileInput.value = '';
      const fileBox = document.getElementById('selected-file-box');
      if (fileBox) fileBox.style.display = 'none';
    };
  }

  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('res-title').value.trim();
      const dept = document.getElementById('res-dept').value;
      const sem = document.getElementById('res-sem').value;
      const subj = document.getElementById('res-subj').value;
      const type = document.getElementById('res-type').value;
      const desc = document.getElementById('res-desc').value;

      if (!title || !dept || !sem || !subj || !type) {
        EduBridge.toast('Please complete all required fields', 'danger');
        return;
      }

      const fileName = selectedFile ? selectedFile.name : `${title.replace(/\s+/g, '_')}.pdf`;
      const ext = fileName.split('.').pop().toLowerCase();
      const fileSize = selectedFile ? `${(selectedFile.size / (1024*1024)).toFixed(1)} MB` : '2.5 MB';

      const newResource = {
        title,
        description: desc,
        department: dept,
        semester: sem,
        subject: subj,
        type,
        fileType: ext,
        fileName,
        fileSize,
        teacher: currentUser.name,
        status: 'Pending'
      };

      EduBridgeData.addResource(newResource);
      EduBridge.toast('Resource uploaded successfully! Submitted for admin moderation.', 'success');
      setTimeout(() => {
        window.location.href = 'resources.html';
      }, 1000);
    });
  }

  // 3. Create Assignment Page Form
  const createAsgForm = document.getElementById('create-assignment-form');
  if (createAsgForm) {
    createAsgForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('asg-title').value.trim();
      const dept = document.getElementById('asg-dept').value;
      const sem = document.getElementById('asg-sem').value;
      const subj = document.getElementById('asg-subj').value;
      const deadline = document.getElementById('asg-deadline').value;
      const maxMarks = document.getElementById('asg-marks').value;
      const desc = document.getElementById('asg-desc').value;

      const today = new Date().toISOString().split('T')[0];
      if (deadline < today) {
        EduBridge.toast('Assignment deadline cannot be in the past!', 'danger');
        return;
      }

      const newAsg = {
        title,
        department: dept,
        semester: sem,
        subject: subj,
        teacher: currentUser.name,
        deadline,
        maxMarks: parseInt(maxMarks, 10),
        description: desc,
        attachment: 'Assignment_Guidelines.pdf'
      };

      EduBridgeData.addAssignment(newAsg);
      EduBridge.toast('Assignment created successfully!', 'success');
      setTimeout(() => {
        window.location.href = 'assignments.html';
      }, 1000);
    });
  }
});

window.EduBridgeTeacher = {
  reviewSubmission: function(id) {
    const list = EduBridgeData.getSubmissions();
    const subm = list.find(s => s.id === id);
    if (!subm) return;

    sessionStorage.setItem('edubridge_review_submission', JSON.stringify(subm));
    window.location.href = `review-submission.html?id=${id}`;
  },

  loadReviewPage: function() {
    const selected = sessionStorage.getItem('edubridge_review_submission');
    const subm = selected ? JSON.parse(selected) : EduBridgeData.getSubmissions()[0];
    if (!subm) return;

    const studentEl = document.getElementById('rev-student-name');
    const asgTitleEl = document.getElementById('rev-asg-title');
    const timeEl = document.getElementById('rev-timestamp');
    const fileEl = document.getElementById('rev-filename');
    const commentEl = document.getElementById('rev-student-comments');
    const marksInput = document.getElementById('rev-marks');
    const maxMarksEl = document.getElementById('rev-max-marks');
    const feedbackInput = document.getElementById('rev-feedback');

    if (studentEl) studentEl.textContent = subm.studentName;
    if (asgTitleEl) asgTitleEl.textContent = subm.assignmentTitle;
    if (timeEl) timeEl.textContent = subm.submittedDate;
    if (fileEl) fileEl.textContent = `${subm.fileName} (${subm.fileType.toUpperCase()})`;
    if (commentEl) commentEl.textContent = subm.comments || 'No comments provided by student.';
    if (maxMarksEl) maxMarksEl.textContent = `/ ${subm.maxMarks}`;
    if (marksInput && subm.gradeMarks !== null) marksInput.value = subm.gradeMarks;
    if (feedbackInput && subm.feedback) feedbackInput.value = subm.feedback;

    const reviewForm = document.getElementById('grading-form');
    if (reviewForm) {
      reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const marks = parseInt(marksInput.value, 10);
        const feedback = feedbackInput.value.trim();

        if (isNaN(marks) || marks < 0 || marks > subm.maxMarks) {
          EduBridge.toast(`Marks must be between 0 and ${subm.maxMarks}`, 'danger');
          return;
        }

        EduBridgeData.saveGrade(subm.id, marks, feedback);
        EduBridge.toast('Grade & Feedback saved successfully!', 'success');
        setTimeout(() => {
          window.location.href = 'submissions.html';
        }, 1000);
      });
    }
  }
};
