// script.js — Handles enrollment, admin actions, news, homepage edits, and contact form for St John Paul II

document.addEventListener('DOMContentLoaded', function () { // Set year placeholders if they exist const y = new Date().getFullYear(); ['year','year2','year3'].forEach(id => { const el = document.getElementById(id); if(el) el.textContent = y; });

// Load dynamic homepage content (motto, about, CTA, news) loadHomepageContent(); renderNewsOnIndex();

// ENROLLMENT FORM const enrollForm = document.getElementById('enrollForm'); if (enrollForm) { enrollForm.addEventListener('submit', async function (e) { e.preventDefault(); const formData = new FormData(enrollForm); const entry = Object.fromEntries(formData.entries());

// Read files to base64 (if provided) — demo only
  try {
    const receipt = document.getElementById('payReceipt') || document.getElementById('receiptUpload');
    const report = document.getElementById('lastReport') || document.getElementById('reportUpload');
    if (receipt && receipt.files && receipt.files[0]) entry.payReceipt = await fileToDataUrl(receipt.files[0]);
    if (report && report.files && report.files[0]) entry.lastReport = await fileToDataUrl(report.files[0]);
  } catch (err) { console.warn('File read failed', err); }

  entry.id = Date.now();
  entry.submittedAt = new Date().toISOString();

  const enrolls = JSON.parse(localStorage.getItem('stjp_enrollments') || '[]');
  enrolls.push(entry);
  localStorage.setItem('stjp_enrollments', JSON.stringify(enrolls));

  // show message if page has #msg
  const msg = document.getElementById('msg');
  if (msg) {
    msg.style.display = 'block';
    msg.textContent = 'Enrollment submitted — thank you! The school will contact you.';
  } else {
    alert('Enrollment submitted — thank you!');
  }

  enrollForm.reset();
  // notify admin lists (if admin open in same browser session)
  renderAdminLists();
});

}

// CONTACT FORM (homepage) const contactForm = document.querySelector('.contact-form'); if (contactForm) { contactForm.addEventListener('submit', function (e) { e.preventDefault(); const data = {}; const inputs = contactForm.querySelectorAll('input, textarea'); inputs.forEach(i => { if(i.name) data[i.name] = i.value; else data[i.id || i.placeholder] = i.value; }); data.submittedAt = new Date().toISOString(); const contacts = JSON.parse(localStorage.getItem('stjp_contacts') || '[]'); contacts.push(data); localStorage.setItem('stjp_contacts', JSON.stringify(contacts)); alert('Message sent — thank you. We will contact you shortly.'); contactForm.reset(); }); }

// ADMIN PIN handling const pinBtn = document.getElementById('pinBtn'); if (pinBtn) pinBtn.addEventListener('click', verifyPin);

// If admin login on the smaller admin doc const loginBtn = document.querySelector('#adminLogin button'); if (loginBtn) loginBtn.addEventListener('click', verifyPin);

// Post news button (admin page) const postNewsBtn = document.getElementById('postNews'); if (postNewsBtn) postNewsBtn.addEventListener('click', postNews);

// Save account & homepage edits const accBtn = document.querySelector('button[onclick="updateAccountDetails()"]'); if (accBtn) accBtn.addEventListener('click', updateAccountDetails); const saveHomepageBtn = document.querySelector('button[onclick="saveHomepageEdits()"]'); if (saveHomepageBtn) saveHomepageBtn.addEventListener('click', saveHomepageEdits);

// When admin logs out const logout = window.logoutAdmin = function(){ const dash = document.getElementById('adminDashboard'); const login = document.getElementById('adminLogin'); if(dash) dash.classList.add('hidden'); if(login) login.classList.remove('hidden'); };

// Helpers for demo pages window.verifyPin = function(){ const input = document.getElementById('adminPin') || document.getElementById('adminPinInput'); const pinErr = document.getElementById('wrongPin') || document.getElementById('pinError'); const val = input ? input.value.trim() : ''; if (val === '2233') { // show admin area const adminArea = document.getElementById('adminArea') || document.getElementById('adminDashboard'); const adminLogin = document.getElementById('adminLogin'); if (adminArea) adminArea.style.display = 'block'; if (adminLogin) adminLogin.classList.add('hidden'); if (pinErr) pinErr.style.display = 'none'; renderAdminLists(); loadAccountDetailsToAdmin(); loadHomepageFieldsToAdmin(); } else { if (pinErr) { pinErr.style.display = 'block'; pinErr.textContent = 'Wrong PIN. Access denied.'; } else alert('Wrong PIN.'); } };

// Post news (admin) window.postNews = function(){ const titleInput = document.getElementById('newsTitle'); const contentInput = document.getElementById('newsContent'); const title = titleInput ? titleInput.value.trim() : ''; const content = contentInput ? contentInput.value.trim() : ''; if(!title || !content){ alert('Provide title and content'); return; } const news = JSON.parse(localStorage.getItem('stjp_news') || '[]'); news.unshift({ id: Date.now(), title, content, postedAt: new Date().toISOString() }); localStorage.setItem('stjp_news', JSON.stringify(news)); if(titleInput) titleInput.value = ''; if(contentInput) contentInput.value = ''; renderAdminLists(); renderNewsOnIndex(); alert('News posted successfully'); };

// Update account details window.updateAccountDetails = function(){ const acc = { name: document.getElementById('accountName')?.value || '', number: document.getElementById('accountNumber')?.value || '', bank: document.getElementById('bankName')?.value || '' }; localStorage.setItem('stjp_account', JSON.stringify(acc)); alert('Account details saved'); };

// Save homepage edits window.saveHomepageEdits = function(){ const homepage = { motto: document.getElementById('editMotto')?.value || '', about: document.getElementById('editAbout')?.value || '', cta: document.getElementById('editCTA')?.value || '' }; localStorage.setItem('stjp_homepage', JSON.stringify(homepage)); loadHomepageContent(); alert('Homepage changes saved (local demo)'); };

// Load homepage content to DOM function loadHomepageContent(){ const home = JSON.parse(localStorage.getItem('stjp_homepage') || '{}'); if(home.motto){ const el = document.querySelector('.motto'); if(el) el.textContent = home.motto; } if(home.about){ const el = document.querySelector('.about-section p'); if(el) el.textContent = home.about; } if(home.cta){ const el = document.querySelector('.cta-section p'); if(el) el.textContent = home.cta; } }

// Load homepage fields to admin inputs (if present) function loadHomepageFieldsToAdmin(){ const home = JSON.parse(localStorage.getItem('stjp_homepage') || '{}'); if(document.getElementById('editMotto')) document.getElementById('editMotto').value = home.motto || ''; if(document.getElementById('editAbout')) document.getElementById('editAbout').value = home.about || ''; if(document.getElementById('editCTA')) document.getElementById('editCTA').value = home.cta || ''; }

// Load account details to admin inputs function loadAccountDetailsToAdmin(){ const acc = JSON.parse(localStorage.getItem('stjp_account') || '{}'); if(document.getElementById('accountName')) document.getElementById('accountName').value = acc.name || ''; if(document.getElementById('accountNumber')) document.getElementById('accountNumber').value = acc.number || ''; if(document.getElementById('bankName')) document.getElementById('bankName').value = acc.bank || ''; }

// Render news into homepage #news-container window.renderNewsOnIndex = function(){ const container = document.getElementById('news-container'); if(!container) return; const news = JSON.parse(localStorage.getItem('stjp_news') || '[]'); container.innerHTML = news.length ? news.map(n=><article class="news-item"><h3>${escapeHtml(n.title)}</h3><p>${escapeHtml(n.content)}</p><div class="small">${new Date(n.postedAt).toLocaleString()}</div></article>).join('') : '<p class="small">No news posted yet.</p>'; };

// Render admin lists: enrollments, appointments, news window.renderAdminLists = function(){ const enrolls = JSON.parse(localStorage.getItem('stjp_enrollments') || '[]'); const news = JSON.parse(localStorage.getItem('stjp_news') || '[]'); const enrollEl = document.getElementById('enrollList'); const apptEl = document.getElementById('apptList'); const newsEl = document.getElementById('newsList');

if(enrollEl){
  enrollEl.innerHTML = enrolls.length ? enrolls.map(e=>`<div class="item"><strong>${escapeHtml(e.studentName||e.studentName)}</strong> — Class: ${escapeHtml(e.classApplying||e.studentClass||'')} — Parent: ${escapeHtml(e.parentName||e.parentName)} — ${escapeHtml(e.phone||e.parentPhone||'')}<div class="small">Appointment: ${escapeHtml(e.appointment||e.appointmentDate||'Not set')}</div><div class="small">Submitted: ${escapeHtml(e.submittedAt)}</div><div class="small">Files: ${e.payReceipt?'<a href="'+e.payReceipt+'" target="_blank">Receipt</a>':''} ${e.lastReport?'<a href="'+e.lastReport+'" target="_blank"> | Report</a>':''}</div></div>`).join('') : '<div class="small">No enrollments yet.</div>';
}

if(apptEl){
  const appts = enrolls.filter(e => (e.appointment || e.appointmentDate)).sort((a,b)=> new Date(a.appointment||a.appointmentDate) - new Date(b.appointment||b.appointmentDate));
  apptEl.innerHTML = appts.length ? appts.map(a=>`<div class="item"><strong>${escapeHtml(a.studentName)}</strong> — ${escapeHtml(a.appointment||a.appointmentDate)} — Parent: ${escapeHtml(a.parentName||a.parentName)}</div>`).join('') : '<div class="small">No appointments scheduled.</div>';
}

if(newsEl){
  newsEl.innerHTML = news.length ? news.map(n=>`<div class="item"><strong>${escapeHtml(n.title)}</strong><div class="small">${escapeHtml(n.content)}</div></div>`).join('') : '<div class="small">No news posted yet.</div>';
}

};

});

// Utility: Read file to data URL (base64) function fileToDataUrl(file){ return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); }); }

// Utility: escape html function escapeHtml(s){ if(!s) return ''; return (s+'').replace(/[&<>",']/g, function(m){ return {'&':'&','<':'<','>':'>','"':'"',"'":'''}[m]; }); }