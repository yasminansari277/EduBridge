/* ==========================================
   EduBridge - Resources Catalog Engine & Renderer
   ========================================== */

window.EduBridgeResources = {
  renderResourceCard: function(res) {
    let fileIconClass = 'icon-pdf';
    let iconName = 'fa-file-pdf';
    
    if (res.fileType === 'docx') { fileIconClass = 'icon-docx'; iconName = 'fa-file-word'; }
    else if (res.fileType === 'png' || res.fileType === 'jpg') { fileIconClass = 'icon-img'; iconName = 'fa-file-image'; }
    else if (res.fileType === 'zip') { fileIconClass = 'icon-zip'; iconName = 'fa-file-archive'; }

    const isPending = res.status === 'Pending';
    const badgeHtml = isPending 
      ? `<span class="badge badge-pending"><i class="fas fa-clock"></i> Pending Moderation</span>`
      : `<span class="badge badge-approved"><i class="fas fa-check-circle"></i> Approved</span>`;

    return `
      <div class="resource-card" id="res-card-${res.id}">
        <div>
          <div class="resource-card-header">
            <div class="file-type-icon ${fileIconClass}">
              <i class="fas ${iconName}"></i>
            </div>
            <div class="resource-meta">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.25rem;">
                <span class="badge badge-info">${res.type}</span>
                ${badgeHtml}
              </div>
              <h3 class="resource-title">${res.title}</h3>
            </div>
          </div>

          <p class="text-sm text-muted mb-3">${res.description || 'No description provided.'}</p>

          <div class="resource-info-list">
            <div class="resource-info-item">
              <i class="fas fa-book text-muted"></i>
              <span><strong>Subject:</strong> ${res.subject}</span>
            </div>
            <div class="resource-info-item">
              <i class="fas fa-graduation-cap text-muted"></i>
              <span><strong>Dept:</strong> ${res.department} (${res.semester || 'All Sem'})</span>
            </div>
            <div class="resource-info-item">
              <i class="fas fa-user-tie text-muted"></i>
              <span><strong>Faculty:</strong> ${res.teacher}</span>
            </div>
            <div class="resource-info-item">
              <i class="fas fa-calendar-alt text-muted"></i>
              <span><strong>Uploaded:</strong> ${res.uploadDate}</span>
            </div>
          </div>
        </div>

        <div class="resource-card-actions">
          <button class="btn btn-outline btn-sm" onclick="EduBridgeResources.viewResource('${res.id}')">
            <i class="fas fa-eye"></i> View
          </button>
          <button class="btn btn-primary btn-sm" onclick="EduBridgeResources.downloadResource('${res.id}')">
            <i class="fas fa-download"></i> Download
          </button>
        </div>
      </div>
    `;
  },

  viewResource: function(id) {
    const list = EduBridgeData.getResources();
    const res = list.find(r => r.id === id);
    if (!res) return;

    // Save selected resource for details page or open modal
    sessionStorage.setItem('edubridge_selected_resource', JSON.stringify(res));

    // Check if on catalog page or details page
    if (window.location.pathname.includes('resource-details.html')) {
      EduBridgeResources.loadDetailsPage(res);
    } else {
      window.location.href = `resource-details.html?id=${res.id}`;
    }
  },

  downloadResource: function(id) {
    const list = EduBridgeData.getResources();
    const res = list.find(r => r.id === id);
    if (!res) return;

    EduBridge.toast(`Downloading: ${res.fileName} (${res.fileSize})`, 'success');
  },

  loadDetailsPage: function(res) {
    if (!res) {
      const selected = sessionStorage.getItem('edubridge_selected_resource');
      if (selected) res = JSON.parse(selected);
    }
    if (!res) return;

    const titleEl = document.getElementById('details-title');
    const deptEl = document.getElementById('details-dept');
    const subjEl = document.getElementById('details-subj');
    const semEl = document.getElementById('details-sem');
    const teacherEl = document.getElementById('details-teacher');
    const dateEl = document.getElementById('details-date');
    const typeEl = document.getElementById('details-type');
    const fileEl = document.getElementById('details-file');
    const descEl = document.getElementById('details-desc');

    if (titleEl) titleEl.textContent = res.title;
    if (deptEl) deptEl.textContent = res.department;
    if (subjEl) subjEl.textContent = res.subject;
    if (semEl) semEl.textContent = res.semester || 'All Semesters';
    if (teacherEl) teacherEl.textContent = res.teacher;
    if (dateEl) dateEl.textContent = res.uploadDate;
    if (typeEl) typeEl.textContent = res.type;
    if (fileEl) fileEl.textContent = `${res.fileName} (${res.fileSize})`;
    if (descEl) descEl.textContent = res.description;

    const previewContainer = document.getElementById('preview-container');
    if (previewContainer) {
      if (res.fileType === 'pdf') {
        previewContainer.innerHTML = `
          <div class="card" style="padding:1.5rem; text-align:center;">
            <i class="fas fa-file-pdf text-danger" style="font-size:3rem; margin-bottom:1rem;"></i>
            <h4>PDF Preview Ready</h4>
            <p class="text-muted text-sm mb-3">Document: ${res.fileName}</p>
            <div style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:8px; padding:2rem; margin:1rem 0;">
              <p style="font-family:serif; color:#334155; line-height:1.8;">
                <strong>SAMPLE DOCUMENT PREVIEW</strong><br><br>
                <strong>Title:</strong> ${res.title}<br>
                <strong>Author:</strong> ${res.teacher}<br>
                <strong>Department:</strong> ${res.department}<br><br>
                <em>Section 1: Overview & Core Principles</em><br>
                This document serves as the official BCA III study material for ${res.subject}. It covers structural concepts, algorithmic steps, standard solutions, and sample examination questions.
              </p>
            </div>
            <button class="btn btn-primary" onclick="EduBridgeResources.downloadResource('${res.id}')">
              <i class="fas fa-download"></i> Download Full Document (${res.fileSize})
            </button>
          </div>
        `;
      } else {
        previewContainer.innerHTML = `
          <div class="document-preview-container">
            <i class="fas fa-file-alt" style="font-size:3rem; color:var(--text-muted); margin-bottom:1rem;"></i>
            <h4>Inline Preview Not Available for .${res.fileType}</h4>
            <p class="text-muted text-sm mb-3">Please download the file to view its full contents locally.</p>
            <button class="btn btn-primary" onclick="EduBridgeResources.downloadResource('${res.id}')">
              <i class="fas fa-download"></i> Download ${res.fileName} (${res.fileSize})
            </button>
          </div>
        `;
      }
    }
  }
};
