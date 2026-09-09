/* ===========================================================
   BookSwap - main.js
   Common code used by every page:
   - Database helper functions (books table)
   - Current user / session helpers
   - Navigation bar
   - Small helper functions (book card, cover image, messages)

   All book data now lives in the online database, not in the browser.
   =========================================================== */

/* ---------- 1. Current user (real login session) ---------- */

// The user who is logged in right now, or null when nobody is logged in.
// Returns a simple object: { id, fullName, email }
async function getCurrentUser() {
  var result = await db.auth.getUser();
  var user = result && result.data ? result.data.user : null;
  if (!user) return null;

  var meta = user.user_metadata || {};
  return {
    id: user.id,
    email: user.email || "",
    fullName: meta.full_name || (user.email || "").split("@")[0],
    college: meta.college || "",
    department: meta.department || "",
    year: meta.year || "",
  };
}

async function logoutUser() {
  await db.auth.signOut();
}

/* ---------- 2. Books in the database ---------- */

// The database uses names like year_sem, the pages use yearSem.
// These two small functions translate between the two styles.
function rowToBook(row) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    author: row.author,
    category: row.category,
    description: row.description,
    condition: row.condition,
    yearSem: row.year_sem,
    price: Number(row.price || 0),
    type: row.type,
    sellerName: row.seller_name,
    sellerEmail: row.seller_email,
    image: row.image || "",
    createdAt: row.created_at,
  };
}

function bookToRow(book) {
  return {
    title: book.title,
    author: book.author,
    category: book.category,
    description: book.description,
    condition: book.condition,
    year_sem: book.yearSem,
    price: book.price,
    type: book.type,
    seller_name: book.sellerName,
    seller_email: book.sellerEmail,
    image: book.image || "",
  };
}

// Get every book (newest first).
async function getBooks() {
  var result = await db
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (result.error) {
    console.error("Could not load books:", result.error.message);
    return [];
  }
  return (result.data || []).map(rowToBook);
}

// Get only the books added by one user.
async function getBooksByUser(userId) {
  var result = await db
    .from("books")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (result.error) {
    console.error("Could not load your books:", result.error.message);
    return [];
  }
  return (result.data || []).map(rowToBook);
}

// Get one book using its id.
async function findBookById(id) {
  if (!id) return null;
  var result = await db.from("books").select("*").eq("id", id).maybeSingle();
  if (result.error || !result.data) return null;
  return rowToBook(result.data);
}

// Add a new book for the logged-in user.
async function insertBook(book, userId) {
  var row = bookToRow(book);
  row.user_id = userId;
  return await db.from("books").insert(row);
}

// Change an existing book (the database only allows the owner).
async function updateBook(id, book) {
  return await db.from("books").update(bookToRow(book)).eq("id", id);
}

// Delete a book (the database only allows the owner).
async function deleteBook(id) {
  return await db.from("books").delete().eq("id", id);
}

/* ---------- 3. Small helpers ---------- */

// Convert dangerous characters so text is always shown safely inside HTML.
function escapeHtml(value) {
  return String(value === undefined || value === null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Read a value from the page address, e.g. book-details.html?id=123
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

// Simple "Loading..." block used while the database answers.
function loadingHtml(text) {
  return '<div class="empty-state"><p>' + escapeHtml(text || "Loading...") + "</p></div>";
}

/* ---------- 4. Navigation bar ---------- */
async function buildNavbar() {
  var holder = document.getElementById("navbar");
  if (!holder) return;

  var user = await getCurrentUser();
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
    logoutBtn.addEventListener("click", async function () {
      await logoutUser();
      alert("You have been logged out.");
      window.location.href = "index.html";
    });
  }
}

/* ---------- 5. Book card HTML ---------- */
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

/* ---------- 6. Run on every page ---------- */
document.addEventListener("DOMContentLoaded", function () {
  buildNavbar();
});
