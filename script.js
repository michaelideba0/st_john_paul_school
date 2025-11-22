// Demo frontend script: stores enrollments, appointments, and news in localStorage.
// WARNING: Files are stored as base64 in localStorage — NOT secure for production.

document.addEventListener('DOMContentLoaded',function(){
  const y=new Date().getFullYear();
  document.getElementById('year')?.textContent=y;
  document.getElementById('year2')?.textContent=y;
  document.getElementById('year3')?.textContent=y;

  // Render news on homepage
  renderNewsPreview();

  // Enrollment form handling (file -> base64)
  const form = document.getElementById('enrollForm');
  if(form){
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());

      // read files
      const readAsDataUrl = file => new Promise((res,rej)=>{
        const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file);
      });
      const receipt = document.getElementById('payReceipt')?.files[0];
      const report = document.getElementById('lastReport')?.files[0];
      try{
        if(receipt) data.payReceipt = await readAsDataUrl(receipt);
        if(report) data.lastReport = await readAsDataUrl(report);
      }catch(e){ console.error(e); }

      data.id = Date.now();
      data.submittedAt = new Date().toISOString();
      const enrolls = JSON.parse(localStorage.getItem('stjp_enrollments')||'[]');
      enrolls.push(data);
      localStorage.setItem('stjp_enrollments', JSON.stringify(enrolls));
      form.reset();
      const msg=document.getElementById('msg'); if(msg){msg.style.display='block'; msg.textContent='Enrollment submitted — school will contact you.'}
    });
  }

  // Admin PIN: 2233
  document.getElementById('pinBtn')?.addEventListener('click', function(){
    const pin = document.getElementById('adminPin').value.trim();
    const wrong = document.getElementById('wrongPin');
    if(pin === '2233'){
      document.getElementById('adminArea').style.display='block';
      if(wrong) wrong.style.display='none';
      renderAdminLists();
    } else {
      if(wrong){ wrong.style.display='block'; wrong.textContent='Wrong PIN. Access denied.' }
    }
  });

  // Post news
  document.getElementById('postNews')?.addEventListener('click', function(){
    const title = document.getElementById('newsTitle').value.trim();
    const content = document.getElementById('newsContent').value.trim();
    if(!title || !content){ alert('Provide title and content'); return; }
    const news = JSON.parse(localStorage.getItem('stjp_news')||'[]');
    news.unshift({id:Date.now(), title, content, postedAt:new Date().toISOString()});
    localStorage.setItem('stjp_news', JSON.stringify(news));
    document.getElementById('newsTitle').value=''; document.getElementById('newsContent').value='';
    renderAdminLists(); renderNewsPreview();
  });

  function renderAdminLists(){
    const enrollList = document.getElementById('enrollList');
    if(enrollList){
      const enrolls = JSON.parse(localStorage.getItem('stjp_enrollments')||'[]');
      enrollList.innerHTML = enrolls.length ? enrolls.map(e=>{
        return `<div class="item"><strong>${escapeHtml(e.studentName||'—')}</strong> — ${escapeHtml(e.classApplying||'—')} — Parent: ${escapeHtml(e.parentName||'—')} — ${escapeHtml(e.phone||'—')}
          <div class="small">Appointment: ${escapeHtml(e.appointment||'Not set')}</div>
          <div class="small">Submitted: ${escapeHtml(e.submittedAt)}</div>
          <div class="small">Files: ${e.payReceipt?'<a href="'+e.payReceipt+'" target="_blank">Payment receipt</a>':''} ${e.lastReport?'<a href="'+e.lastReport+'" target="_blank"> | Last report</a>':''}</div>
        </div>`;
      }).join('') : '<div class="small">No enrollments yet.</div>';
    }

    // Appointments
    const apptList = document.getElementById('apptList');
    if(apptList){
      const enrolls = JSON.parse(localStorage.getItem('stjp_enrollments')||'[]');
      const appts = enrolls.filter(e=>e.appointment).sort((a,b)=> new Date(a.appointment)-new Date(b.appointment));
      apptList.innerHTML = appts.length ? appts.map(a=>`<div class="item"><strong>${escapeHtml(a.studentName)}</strong> — ${escapeHtml(a.appointment)} — Parent: ${escapeHtml(a.parentName)}</div>`).join('') : '<div class="small">No appointments scheduled.</div>';
    }

    const newsList = document.getElementById('newsList');
    if(newsList){
      const news = JSON.parse(localStorage.getItem('stjp_news')||'[]');
      newsList.innerHTML = news.length ? news.map(n=>`<div class="item"><strong>${escapeHtml(n.title)}</strong><div class="small">${escapeHtml(n.content)}</div></div>`).join('') : '<div class="small">No news posted yet.</div>';
    }
  }

  function renderNewsPreview(){
    const container = document.getElementById('newsCards');
    if(!container) return;
    const news = JSON.parse(localStorage.getItem('stjp_news')||'[]');
    container.innerHTML = news.length ? news.map(n=>`<article class="card"><h4>${escapeHtml(n.title)}</h4><p>${escapeHtml(n.content)}</p></article>`).join('') : '<div class="small">No news yet.</div>';
  }

  function escapeHtml(s){ if(!s) return ''; return (s+'').replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];}); }
});