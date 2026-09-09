/* ===========================================================
   BookSwap - auth.js
   Real registration and login using the online database
   (Lovable Cloud authentication).

   Passwords are never stored by our code. They are sent securely
   to the authentication server, which stores them in an encrypted
   (hashed) form.
   =========================================================== */

/* ---------- 1. Small validation helpers ---------- */

// Very simple email check: something@something.something
function isValidEmail(email) {
  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/* ---------- 2. Registration ---------- */
function setupRegisterForm() {
  var form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // stop the page from reloading
    hideMessage("formMessage");

    var fullName = document.getElementById("fullName").value.trim();
    var email = document.getElementById("email").value.trim().toLowerCase();
    var password = document.getElementById("password").value;
    var college = document.getElementById("college").value.trim();
    var department = document.getElementById("department").value.trim();
    var year = document.getElementById("year").value;

    // ---- Validation ----
    if (fullName === "" || email === "" || password === "" || college === "" || department === "" || year === "") {
      showMessage("formMessage", "Please fill in all the fields.", "error");
      return;
    }
    if (fullName.length < 3) {
      showMessage("formMessage", "Full name must be at least 3 characters long.", "error");
      return;
    }
    if (!isValidEmail(email)) {
      showMessage("formMessage", "Please enter a valid email address (example: rahul@college.edu).", "error");
      return;
    }
    if (password.length < 6) {
      showMessage("formMessage", "Password must be at least 6 characters long.", "error");
      return;
    }

    showMessage("formMessage", "Creating your account, please wait...", "info");

    // ---- Create the account in the database ----
    var result = await db.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: window.location.origin + "/bookswap/login.html",
        data: {
          full_name: fullName,
          college: college,
          department: department,
          year: year,
        },
      },
    });

    if (result.error) {
      var text = result.error.message || "Registration failed. Please try again.";
      if (text.toLowerCase().indexOf("already") !== -1) {
        text = "This email is already registered. Please login instead.";
      }
      showMessage("formMessage", text, "error");
      return;
    }

    showMessage("formMessage", "Registration successful! Taking you to the login page...", "success");
    form.reset();

    setTimeout(function () {
      window.location.href = "login.html";
    }, 1500);
  });
}

/* ---------- 3. Login ---------- */
function setupLoginForm() {
  var form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    hideMessage("formMessage");

    var email = document.getElementById("loginEmail").value.trim().toLowerCase();
    var password = document.getElementById("loginPassword").value;

    if (email === "" || password === "") {
      showMessage("formMessage", "Please enter both email and password.", "error");
      return;
    }
    if (!isValidEmail(email)) {
      showMessage("formMessage", "Please enter a valid email address.", "error");
      return;
    }

    showMessage("formMessage", "Checking your details...", "info");

    var result = await db.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (result.error) {
      showMessage("formMessage", "Wrong email or password. Please try again or register first.", "error");
      return;
    }

    var user = await getCurrentUser();
    showMessage("formMessage", "Login successful! Welcome back, " + (user ? user.fullName : "") + ".", "success");

    // If the user was sent here from another page, go back to that page
    var nextPage = getQueryParam("next") || "index.html";
    setTimeout(function () {
      window.location.href = nextPage;
    }, 1000);
  });
}

/* ---------- 4. Login protection ---------- */
// Used by Add Book and My Books pages.
// If nobody is logged in, we hide the page content and show a message.
async function requireLogin(contentElementId, noticeElementId, pageName) {
  var user = await getCurrentUser();
  var content = document.getElementById(contentElementId);
  var notice = document.getElementById(noticeElementId);

  if (user) {
    if (notice) notice.classList.add("hidden");
    if (content) content.classList.remove("hidden");
    return user;
  }

  if (content) content.classList.add("hidden");
  if (notice) {
    notice.classList.remove("hidden");
    notice.innerHTML =
      '<div class="empty-state">' +
      "<p>Please login to use the <b>" +
      escapeHtml(pageName) +
      "</b> page.</p>" +
      '<a class="btn" href="login.html?next=' +
      encodeURIComponent(window.location.pathname.split("/").pop()) +
      '">Login</a> ' +
      '<a class="btn btn-outline" href="register.html">Register</a>' +
      "</div>";
  }
  return null;
}

/* ---------- 5. Start the forms when the page is ready ---------- */
document.addEventListener("DOMContentLoaded", function () {
  setupRegisterForm();
  setupLoginForm();
});
