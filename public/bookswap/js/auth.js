/* ===========================================================
   BookSwap - auth.js
   Registration, Login and Login-protection.

   NOTE: This is a simple beginner demo login using LocalStorage.
   It is NOT real, secure, production-level authentication.
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

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading
    hideMessage("formMessage");

    // Read the values typed by the user
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

    // ---- Check if the email is already registered ----
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].email === email) {
        showMessage("formMessage", "This email is already registered. Please login instead.", "error");
        return;
      }
    }

    // ---- Save the new user ----
    var newUser = {
      fullName: fullName,
      email: email,
      password: password,
      college: college,
      department: department,
      year: year,
    };
    users.push(newUser);
    saveUsers(users);

    showMessage("formMessage", "Registration successful! Taking you to the login page...", "success");
    form.reset();

    // Go to the login page after 1.5 seconds
    setTimeout(function () {
      window.location.href = "login.html";
    }, 1500);
  });
}

/* ---------- 3. Login ---------- */
function setupLoginForm() {
  var form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", function (event) {
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

    // Look for a user with the same email and password
    var users = getUsers();
    var foundUser = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].email === email && users[i].password === password) {
        foundUser = users[i];
        break;
      }
    }

    if (foundUser === null) {
      showMessage("formMessage", "Wrong email or password. Please try again or register first.", "error");
      return;
    }

    // Save the logged-in user (we do not store the password here)
    setCurrentUser({
      fullName: foundUser.fullName,
      email: foundUser.email,
      college: foundUser.college,
      department: foundUser.department,
      year: foundUser.year,
    });

    showMessage("formMessage", "Login successful! Welcome back, " + foundUser.fullName + ".", "success");

    // If the user was sent here from another page, go back to that page
    var nextPage = getQueryParam("next") || "index.html";
    setTimeout(function () {
      window.location.href = nextPage;
    }, 1200);
  });
}

/* ---------- 4. Login protection ---------- */
// Used by Add Book and My Books pages.
// If nobody is logged in, we hide the page content and show a message.
function requireLogin(contentElementId, noticeElementId, pageName) {
  var user = getCurrentUser();
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
