/* ===========================================================
   BookSwap - main.js
   Common code used by every page:
   - LocalStorage helper functions
   - Sample books
   - Navigation bar
   - Small helper functions (book card, cover image, messages)
   =========================================================== */

/* ---------- 1. LocalStorage key names ---------- */
var USERS_KEY = "bookswap_users";
var CURRENT_USER_KEY = "bookswap_currentUser";
var BOOKS_KEY = "bookswap_books";

/* ---------- 2. Read / write helpers ---------- */

// Read a value from localStorage and convert the JSON text into a JS value.
function readStorage(key, fallbackValue) {
  try {
    var text = localStorage.getItem(key);
    if (!text) {
      return fallbackValue;
    }
    return JSON.parse(text);
  } catch (error) {
    // If the stored text is broken, just use the fallback value.
    return fallbackValue;
  }
}

// Save a JS value into localStorage as JSON text.
function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  return readStorage(USERS_KEY, []);
}

function saveUsers(users) {
  writeStorage(USERS_KEY, users);
}

function getBooks() {
  return readStorage(BOOKS_KEY, []);
}

function saveBooks(books) {
  writeStorage(BOOKS_KEY, books);
}

// The user who is logged in right now (or null when nobody is logged in).
function getCurrentUser() {
  return readStorage(CURRENT_USER_KEY, null);
}

function setCurrentUser(user) {
  writeStorage(CURRENT_USER_KEY, user);
}

function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

/* ---------- 3. Small helpers ---------- */

// Create a unique id for a new book, e.g. "b_1723456789_452"
function createId() {
  return "b_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}

// Convert dangerous characters so text is always shown safely inside HTML.
function escapeHtml(value) {
  return String(value === undefined || value === null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Read a value from the page address, e.g. book-details.html?id=b_123
function getQueryParam(name) {
  var params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Show the price nicely: Free books have no price.
function formatPrice(book) {
  if (book.type === "Free") {
    return "Free";
  }
  if (book.type === "Exchange" && Number(book.price) === 0) {
    return "Exchange only";
  }
  return "\u20B9 " + Number(book.price || 0);
}

// If a book has no image, we draw a simple colored cover with the title.
// This avoids broken images on the page.
function getCoverImage(book) {
  if (book.image && book.image.trim() !== "") {
    return book.image.trim();
  }
  var title = escapeHtml(book.title || "Book").substring(0, 34);
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
    '<rect width="400" height="300" fill="#1d4ed8"/>' +
    '<rect x="18" y="18" width="364" height="264" fill="#0d9488" opacity="0.35"/>' +
    '<text x="200" y="150" font-family="Arial" font-size="22" fill="#ffffff" ' +
    'text-anchor="middle">' +
    title +
    "</text></svg>";
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

// CSS class for the Sell / Exchange / Free label
function typeBadgeClass(type) {
  if (type === "Free") return "badge badge-free";
  if (type === "Exchange") return "badge badge-exchange";
  return "badge badge-sell";
}

// Show a message box (error / success / info) inside an element.
function showMessage(elementId, text, kind) {
  var box = document.getElementById(elementId);
  if (!box) return;
  box.className = "message " + (kind || "info");
  box.textContent = text;
}

function hideMessage(elementId) {
  var box = document.getElementById(elementId);
  if (!box) return;
  box.className = "message hidden";
  box.textContent = "";
}

/* ---------- 4. Sample books ---------- */
// These books are saved only the first time the site is opened,
// so the website never looks empty.
function getSampleBooks() {
  return [
    {
      id: "sample_1",
      title: "Python Programming",
      author: "Reema Thareja",
      category: "Computer Science",
      description:
        "Complete beginner friendly Python book with programs and exercises. Used for one semester only, no torn pages.",
      condition: "Like New",
      yearSem: "1st Year / Semester 2",
      price: 260,
      type: "Sell",
      sellerName: "Ananya Rao",
      sellerEmail: "ananya.rao@example.com",
      image: "",
      ownerEmail: "sample@bookswap.local",
    },
    {
      id: "sample_2",
      title: "Data Structures and Algorithms",
      author: "Narasimha Karumanchi",
      category: "Computer Science",
      description:
        "Very useful for placement preparation and lab exams. Contains solved problems for every chapter.",
      condition: "Good",
      yearSem: "2nd Year / Semester 3",
      price: 320,
      type: "Sell",
      sellerName: "Rahul Verma",
      sellerEmail: "rahul.verma@example.com",
      image: "",
      ownerEmail: "sample@bookswap.local",
    },
    {
      id: "sample_3",
      title: "Engineering Mathematics - I",
      author: "B. S. Grewal",
      category: "Mathematics",
      description:
        "Standard mathematics textbook covering calculus, matrices and differential equations. Willing to exchange for a Physics book.",
      condition: "Good",
      yearSem: "1st Year / Semester 1",
      price: 0,
      type: "Exchange",
      sellerName: "Sneha Patil",
      sellerEmail: "sneha.patil@example.com",
      image: "",
      ownerEmail: "sample@bookswap.local",
    },
    {
      id: "sample_4",
      title: "Digital Electronics",
      author: "R. P. Jain",
      category: "Electronics",
      description:
        "Covers logic gates, flip flops, counters and registers. Some pages have pencil notes which are easy to erase.",
      condition: "Used",
      yearSem: "2nd Year / Semester 4",
      price: 180,
      type: "Sell",
      sellerName: "Imran Shaikh",
      sellerEmail: "imran.shaikh@example.com",
      image: "",
      ownerEmail: "sample@bookswap.local",
    },
    {
      id: "sample_5",
      title: "Computer Fundamentals",
      author: "P. K. Sinha",
      category: "Computer Science",
      description:
        "Basic computer concepts book for first year students. Giving it away free to any junior who needs it.",
      condition: "Good",
      yearSem: "1st Year / Semester 1",
      price: 0,
      type: "Free",
      sellerName: "Karthik Menon",
      sellerEmail: "karthik.menon@example.com",
      image: "",
      ownerEmail: "sample@bookswap.local",
    },
    {
      id: "sample_6",
      title: "Engineering Physics",
      author: "H. K. Malik",
      category: "Physics",
      description:
        "Theory plus numerical problems on optics, lasers and semiconductors. Cover is slightly bent but inside is clean.",
      condition: "Good",
      yearSem: "1st Year / Semester 2",
      price: 210,
      type: "Sell",
      sellerName: "Divya Nair",
      sellerEmail: "divya.nair@example.com",
      image: "",
      ownerEmail: "sample@bookswap.local",
    },
    {
      id: "sample_7",
      title: "Engineering Chemistry",
      author: "Jain and Jain",
      category: "Chemistry",
      description:
        "First year chemistry textbook with water treatment, polymers and fuels chapters. Almost new condition.",
      condition: "New",
      yearSem: "1st Year / Semester 1",
      price: 240,
      type: "Sell",
      sellerName: "Aditya Kulkarni",
      sellerEmail: "aditya.kulkarni@example.com",
      image: "",
      ownerEmail: "sample@bookswap.local",
    },
    {
      id: "sample_8",
      title: "Java Programming",
      author: "E. Balagurusamy",
      category: "Computer Science",
      description:
        "Programming with Java, useful for OOP subject and lab record work. Free to exchange with a DBMS book.",
      condition: "Like New",
      yearSem: "2nd Year / Semester 3",
      price: 0,
      type: "Exchange",
      sellerName: "Meera Joshi",
      sellerEmail: "meera.joshi@example.com",
      image: "",
      ownerEmail: "sample@bookswap.local",
    },
  ];
}

// If LocalStorage has no books at all, load the sample books.
function loadSampleBooksIfEmpty() {
  var books = getBooks();
  if (!books || books.length === 0) {
    saveBooks(getSampleBooks());
  }
}

/* ---------- 5. Navigation bar ---------- */
// The same navigation bar is used on all pages, so we build it with JavaScript.
function buildNavbar() {
  var holder = document.getElementById("navbar");
  if (!holder) return;

  var user = getCurrentUser();
  var page = window.location.pathname.split("/").pop() || "index.html";

  function link(href, text) {
    var active = href === page ? ' class="active"' : "";
    return '<a href="' + href + '"' + active + ">" + text + "</a>";
  }

  var rightSide = "";
  if (user) {
    rightSide =
      '<span class="nav-user">Hi, ' +
      escapeHtml(user.fullName) +
      "</span>" +
      '<button class="btn btn-small btn-outline" id="logoutBtn">Logout</button>';
  } else {
    rightSide =
      link("login.html", "Login") +
      '<a class="btn btn-small" href="register.html">Register</a>';
  }

  holder.innerHTML =
    '<div class="nav-inner">' +
    '<a class="logo" href="index.html">Book<span>Swap</span></a>' +
    '<nav class="nav-links">' +
    link("index.html", "Home") +
    link("search.html", "Search Books") +
    link("add-book.html", "Add Book") +
    link("my-books.html", "My Books") +
    rightSide +
    "</nav>" +
    "</div>";

  var logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      logoutUser();
      alert("You have been logged out.");
      window.location.href = "index.html";
    });
  }
}

/* ---------- 6. Book card HTML ---------- */
// showOwnerButtons = true on the My Books page (Edit / Delete buttons)
function bookCardHtml(book, showOwnerButtons) {
  var ownerButtons = "";
  if (showOwnerButtons) {
    ownerButtons =
      '<a class="btn btn-small btn-outline" href="add-book.html?edit=' +
      encodeURIComponent(book.id) +
      '">Edit</a>' +
      '<button class="btn btn-small btn-danger" data-delete="' +
      escapeHtml(book.id) +
      '">Delete</button>';
  }

  return (
    '<article class="book-card">' +
    '<img src="' +
    escapeHtml(getCoverImage(book)) +
    '" alt="Cover of ' +
    escapeHtml(book.title) +
    '">' +
    '<div class="book-card-body">' +
    '<h3 class="book-title">' +
    escapeHtml(book.title) +
    "</h3>" +
    '<p class="book-meta">by ' +
    escapeHtml(book.author) +
    "</p>" +
    '<p class="book-meta">' +
    escapeHtml(book.category) +
    ' &middot; <span class="badge badge-grey">' +
    escapeHtml(book.condition) +
    "</span></p>" +
    '<p class="book-price">' +
    formatPrice(book) +
    ' <span class="' +
    typeBadgeClass(book.type) +
    '">' +
    escapeHtml(book.type) +
    "</span></p>" +
    '<div class="card-actions">' +
    '<a class="btn btn-small" href="book-details.html?id=' +
    encodeURIComponent(book.id) +
    '">View Details</a>' +
    ownerButtons +
    "</div>" +
    "</div>" +
    "</article>"
  );
}

/* ---------- 7. Run on every page ---------- */
document.addEventListener("DOMContentLoaded", function () {
  loadSampleBooksIfEmpty();
  buildNavbar();
});
