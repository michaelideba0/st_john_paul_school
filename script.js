/* ============================================================
   NEWS & EVENTS
============================================================ */

function loadNews() {
  let news = JSON.parse(localStorage.getItem("newsData")) || [];
  const newsList = document.getElementById("newsList");

  if (!newsList) return;

  newsList.innerHTML = "";

  news.forEach((item, index) => {
    newsList.innerHTML += `
      <div class="news-box">
        <h3>${item.title}</h3>
        <p>${item.content}</p>
        <button class="btn delete" onclick="deleteNews(${index})">Delete</button>
      </div>
    `;
  });
}

function postNews() {
  const title = document.getElementById("newsTitle").value.trim();
  const content = document.getElementById("newsContent").value.trim();

  if (title === "" || content === "") {
    alert("Please enter both title and content.");
    return;
  }

  let news = JSON.parse(localStorage.getItem("newsData")) || [];

  news.push({ title, content });

  localStorage.setItem("newsData", JSON.stringify(news));

  document.getElementById("newsTitle").value = "";
  document.getElementById("newsContent").value = "";

  loadNews();
}

function deleteNews(index) {
  let news = JSON.parse(localStorage.getItem("newsData")) || [];
  news.splice(index, 1);
  localStorage.setItem("newsData", JSON.stringify(news));
  loadNews();
}

/* ============================================================
   ENROLLMENTS
============================================================ */

function loadEnrollments() {
  let enrollments = JSON.parse(localStorage.getItem("enrollmentData")) || [];
  const list = document.getElementById("enrollmentList");

  if (!list) return;

  list.innerHTML = "";

  enrollments.forEach((app) => {
    list.innerHTML += `
      <div class="enroll-box">
        <h3>${app.fullname}</h3>
        <p><strong>Class:</strong> ${app.classLevel}</p>
        <p><strong>Parent:</strong> ${app.parentName}</p>
        <p><strong>Phone:</strong> ${app.phone}</p>
        <p><strong>Receipt:</strong></p>
        <img src="${app.receipt}" class="receipt-img" alt="Receipt">
      </div>
    `;
  });
}

/* ============================================================
   SAVE ACCOUNT DETAILS
============================================================ */

function updateAccountDetails() {
  const name = document.getElementById("accountName").value.trim();
  const number = document.getElementById("accountNumber").value.trim();
  const bank = document.getElementById("bankName").value.trim();

  if (name === "" || number === "" || bank === "") {
    alert("Please fill out all account fields.");
    return;
  }

  const details = { name, number, bank };
  localStorage.setItem("accountDetails", JSON.stringify(details));

  alert("Account details updated!");
}

/* ============================================================
   HOMEPAGE EDITS
============================================================ */

function saveHomepageEdits() {
  const motto = document.getElementById("editMotto").value.trim();
  const about = document.getElementById("editAbout").value.trim();
  const cta = document.getElementById("editCTA").value.trim();

  const homepageData = { motto, about, cta };

  localStorage.setItem("homepageContent", JSON.stringify(homepageData));

  alert("Homepage content updated!");
}

/* ============================================================
   LOAD DATA ON PAGE START
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  loadNews();
  loadEnrollments();
});