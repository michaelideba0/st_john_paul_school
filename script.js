// script.js — Full clean system for St John Paul II School Website
// Handles enrollment, admin actions, news CRUD, homepage edits, account details, and PIN login.

document.addEventListener("DOMContentLoaded", function () {
    loadHomepageContent();
    renderNewsOnIndex();
    loadAccountDetailsToHomepage();
    renderAdminLists();

    /* ENROLLMENT FORM */
    const enrollForm = document.getElementById("enrollForm");
    if (enrollForm) {
        enrollForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = new FormData(enrollForm);
            const entry = Object.fromEntries(formData.entries());

            // Read file uploads as base64
            try {
                const receipt = document.getElementById("payReceipt");
                const report = document.getElementById("lastReport");

                if (receipt?.files[0]) entry.payReceipt = await fileToDataUrl(receipt.files[0]);
                if (report?.files[0]) entry.lastReport = await fileToDataUrl(report.files[0]);
            } catch (err) {}

            entry.id = Date.now();
            entry.submittedAt = new Date().toISOString();

            const enrolls = JSON.parse(localStorage.getItem("stjp_enrollments") || "[]");
            enrolls.push(entry);
            localStorage.setItem("stjp_enrollments", JSON.stringify(enrolls));

            const msg = document.getElementById("msg");
            if (msg) {
                msg.style.display = "block";
                msg.textContent = "Enrollment submitted successfully!";
            } else {
                alert("Enrollment submitted!");
            }

            enrollForm.reset();
            renderAdminLists();
        });
    }

    /* CONTACT FORM */
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const data = {};
            const inputs = contactForm.querySelectorAll("input, textarea");
            inputs.forEach((i) => (data[i.name] = i.value));

            data.submittedAt = new Date().toISOString();

            const contacts = JSON.parse(localStorage.getItem("stjp_contacts") || "[]");
            contacts.push(data);
            localStorage.setItem("stjp_contacts", JSON.stringify(contacts));

            alert("Message sent. The school will contact you.");
            contactForm.reset();
        });
    }
});

/* ------------------ PIN LOGIN (NO STORAGE) ------------------ */
window.verifyPin = function () {
    const input = document.getElementById("adminPin") || document.getElementById("adminPinInput");
    const pinErr = document.getElementById("pinError") || document.getElementById("wrongPin");

    const val = input.value.trim();

    if (val === "2233") {
        const dash = document.getElementById("adminDashboard");
        const login = document.getElementById("adminLogin");

        login.classList.add("hidden");
        dash.classList.remove("hidden");

        renderAdminLists();
        loadHomepageFieldsToAdmin();
        loadAccountDetailsToAdmin();

        if (pinErr) pinErr.style.display = "none";
    } else {
        pinErr.textContent = "Wrong PIN. Access denied.";
        pinErr.style.display = "block";
    }
};

/* ------------------ LOGOUT ------------------ */
window.logoutAdmin = function () {
    const dash = document.getElementById("adminDashboard");
    const login = document.getElementById("adminLogin");

    dash.classList.add("hidden");
    login.classList.remove("hidden");
};

/* ------------------ POST NEWS ------------------ */
window.postNews = function () {
    const title = document.getElementById("newsTitle").value.trim();
    const content = document.getElementById("newsContent").value.trim();

    if (!title || !content) return alert("Enter title and content.");

    const news = JSON.parse(localStorage.getItem("stjp_news") || "[]");

    news.unshift({
        id: Date.now(),
        title,
        content,
        postedAt: new Date().toISOString()
    });

    localStorage.setItem("stjp_news", JSON.stringify(news));

    document.getElementById("newsTitle").value = "";
    document.getElementById("newsContent").value = "";

    renderAdminLists();
    renderNewsOnIndex();

    alert("News posted successfully.");
};

/* ------------------ DELETE NEWS ------------------ */
window.deleteNews = function (id) {
    let news = JSON.parse(localStorage.getItem("stjp_news") || "[]");
    news = news.filter((n) => n.id !== id);
    localStorage.setItem("stjp_news", JSON.stringify(news));

    renderAdminLists();
    renderNewsOnIndex();
};

/* ------------------ ACCOUNT DETAILS ------------------ */
window.updateAccountDetails = function () {
    const acc = {
        name: document.getElementById("accountName").value,
        number: document.getElementById("accountNumber").value,
        bank: document.getElementById("bankName").value
    };

    localStorage.setItem("stjp_account", JSON.stringify(acc));

    alert("Account details saved.");
};

/* Display account details on homepage */
function loadAccountDetailsToHomepage() {
    const acc = JSON.parse(localStorage.getItem("stjp_account") || "{}");

    if (document.getElementById("accName"))
        document.getElementById("accName").textContent = acc.name || "Not set";

    if (document.getElementById("accNumber"))
        document.getElementById("accNumber").textContent = acc.number || "Not set";

    if (document.getElementById("accBank"))
        document.getElementById("accBank").textContent = acc.bank || "Not set";
}

/* Load account details into admin inputs */
function loadAccountDetailsToAdmin() {
    const acc = JSON.parse(localStorage.getItem("stjp_account") || "{}");

    if (document.getElementById("accountName"))
        document.getElementById("accountName").value = acc.name || "";

    if (document.getElementById("accountNumber"))
        document.getElementById("accountNumber").value = acc.number || "";

    if (document.getElementById("bankName"))
        document.getElementById("bankName").value = acc.bank || "";
}

/* ------------------ HOMEPAGE TEXT EDITS ------------------ */
window.saveHomepageEdits = function () {
    const homepage = {
        motto: document.getElementById("editMotto").value,
        about: document.getElementById("editAbout").value,
        cta: document.getElementById("editCTA").value
    };

    localStorage.setItem("stjp_homepage", JSON.stringify(homepage));

    loadHomepageContent();
    alert("Homepage content updated.");
};

/* Apply homepage text to real homepage */
function loadHomepageContent() {
    const home = JSON.parse(localStorage.getItem("stjp_homepage") || "{}");

    if (home.motto && document.querySelector(".motto"))
        document.querySelector(".motto").textContent = home.motto;

    if (home.about && document.querySelector(".about-section p"))
        document.querySelector(".about-section p").textContent = home.about;

    if (home.cta && document.querySelector(".cta-section p"))
        document.querySelector(".cta-section p").textContent = home.cta;
}

/* Load admin input fields */
function loadHomepageFieldsToAdmin() {
    const home = JSON.parse(localStorage.getItem("stjp_homepage") || "{}");

    if (document.getElementById("editMotto"))
        document.getElementById("editMotto").value = home.motto || "";

    if (document.getElementById("editAbout"))
        document.getElementById("editAbout").value = home.about || "";

    if (document.getElementById("editCTA"))
        document.getElementById("editCTA").value = home.cta || "";
}

/* ------------------ RENDER NEWS ON HOMEPAGE ------------------ */
window.renderNewsOnIndex = function () {
    const container = document.getElementById("news-container");
    if (!container) return;

    const news = JSON.parse(localStorage.getItem("stjp_news") || "[]");

    if (news.length === 0) {
        container.innerHTML = "<p>No news posted yet.</p>";
        return;
    }

    container.innerHTML = news
        .map(
            (n) => `
        <article class="news-item">
            <h3>${escapeHtml(n.title)}</h3>
            <p>${escapeHtml(n.content)}</p>
            <small>${new Date(n.postedAt).toLocaleString()}</small>
        </article>
    `
        )
        .join("");
};

/* ------------------ ADMIN LISTS ------------------ */
window.renderAdminLists = function () {
    const enrolls = JSON.parse(localStorage.getItem("stjp_enrollments") || "[]");
    const news = JSON.parse(localStorage.getItem("stjp_news") || "[]");

    /* ENROLLMENTS */
    const enrollEl = document.getElementById("enrollmentList");
    if (enrollEl) {
        enrollEl.innerHTML = enrolls.length
            ? enrolls
                  .map(
                      (e) => `
        <div class="item">
            <strong>${escapeHtml(e.studentName || "")}</strong>
            <br>Class: ${escapeHtml(e.classApplying || "")}
            <br>Parent: ${escapeHtml(e.parentName || "")}
            <br>Phone: ${escapeHtml(e.phone || "")}
            <br><small>Submitted: ${e.submittedAt}</small>
            <br>Files: 
            ${
                e.payReceipt
                    ? `<a href="${e.payReceipt}" target="_blank">Receipt</a>`
                    : ""
            }
            ${
                e.lastReport
                    ? ` | <a href="${e.lastReport}" target="_blank">Report</a>`
                    : ""
            }
        </div>
    `
                  )
                  .join("")
            : "<p>No enrollments yet.</p>";
    }

    /* NEWS LIST */
    const newsEl = document.getElementById("newsList");
    if (newsEl) {
        newsEl.innerHTML = news.length
            ? news
                  .map(
                      (n) => `
        <div class="item">
            <strong>${escapeHtml(n.title)}</strong>
            <p>${escapeHtml(n.content)}</p>
            <small>${new Date(n.postedAt).toLocaleString()}</small>
            <button class="btn delete" onclick="deleteNews(${n.id})">Delete</button>
        </div>
    `
                  )
                  .join("")
            : "<p>No news posted yet.</p>";
    }
};

/* ------------------ HELPERS ------------------ */
function escapeHtml(s) {
    if (!s) return "";
    return s.replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
}

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}