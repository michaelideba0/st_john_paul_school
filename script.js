/* --------------------- ADMIN PIN LOGIN --------------------- */
const ADMIN_PIN = "2233";

function verifyPin() {
    const input = document.getElementById("adminPinInput").value;
    const error = document.getElementById("pinError");

    if (input === ADMIN_PIN) {
        document.getElementById("adminLogin").classList.add("hidden");
        document.getElementById("adminDashboard").classList.remove("hidden");
        loadNews();
        loadEnrollments();
    } else {
        error.textContent = "Incorrect PIN!";
    }
}

function logoutAdmin() {
    document.getElementById("adminDashboard").classList.add("hidden");
    document.getElementById("adminLogin").classList.remove("hidden");
}


/* --------------------- NEWS SYSTEM --------------------- */
function postNews() {
    let title = document.getElementById("newsTitle").value;
    let content = document.getElementById("newsContent").value;

    if (!title || !content) return alert("Fill all fields!");

    let newsList = JSON.parse(localStorage.getItem("newsList") || "[]");

    newsList.push({
        id: Date.now(),
        title,
        content,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("newsList", JSON.stringify(newsList));

    document.getElementById("newsTitle").value = "";
    document.getElementById("newsContent").value = "";

    loadNews();
}

function loadNews() {
    let container = document.getElementById("newsList");
    let newsList = JSON.parse(localStorage.getItem("newsList") || "[]");

    container.innerHTML = "";

    newsList.forEach(item => {
        container.innerHTML += `
            <div class="news-card">
                <h3>${item.title}</h3>
                <p>${item.content}</p>
                <small>${item.date}</small>
                <button class="btn delete" onclick="deleteNews(${item.id})">Delete</button>
            </div>
        `;
    });
}

function deleteNews(id) {
    let newsList = JSON.parse(localStorage.getItem("newsList") || "[]");
    newsList = newsList.filter(item => item.id !== id);
    localStorage.setItem("newsList", JSON.stringify(newsList));
    loadNews();
}


/* --------------------- ENROLLMENT LIST --------------------- */
function loadEnrollments() {
    let list = document.getElementById("enrollmentList");
    let enrollments = JSON.parse(localStorage.getItem("enrollments") || "[]");

    list.innerHTML = "";

    enrollments.forEach(entry => {
        list.innerHTML += `
            <div class="enroll-card">
                <h3>${entry.name}</h3>
                <p><strong>Class:</strong> ${entry.studentClass}</p>
                <p><strong>Parent:</strong> ${entry.parent}</p>
                <p><strong>Phone:</strong> ${entry.phone}</p>
                <p><strong>Date:</strong> ${entry.date}</p>
                <p><strong>Receipt:</strong></p>
                <img src="${entry.receipt}" class="receipt-img">
            </div>
        `;
    });
}


/* --------------------- ACCOUNT DETAILS --------------------- */
function updateAccountDetails() {
    let name = document.getElementById("accountName").value;
    let number = document.getElementById("accountNumber").value;
    let bank = document.getElementById("bankName").value;

    localStorage.setItem("accountDetails", JSON.stringify({ name, number, bank }));

    alert("Account details saved!");
}


/* --------------------- HOMEPAGE TEXT EDITS --------------------- */
function saveHomepageEdits() {
    let motto = document.getElementById("editMotto").value;
    let about = document.getElementById("editAbout").value;
    let cta = document.getElementById("editCTA").value;

    localStorage.setItem("homepageEdits", JSON.stringify({ motto, about, cta }));
    
    alert("Homepage content saved!");
}