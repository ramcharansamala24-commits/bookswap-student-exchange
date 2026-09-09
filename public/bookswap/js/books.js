/* ===========================================================
   BookSwap - books.js
   Everything about books, now read from and written to the
   online database:
   - Home page "Recently Added Books"
   - Search page (search + filters)
   - Book details page
   - Add Book / Edit Book form
   - My Books page (edit + delete)
   =========================================================== */

/* ---------- 1. HOME PAGE: recently added books ---------- */
async function setupHomePage() {
  var grid = document.getElementById("recentBooks");
  if (!grid) return;

  // Hero search box -> go to the search page with the typed text
  var heroForm = document.getElementById("heroSearchForm");
  if (heroForm) {
    heroForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var text = document.getElementById("heroSearchInput").value.trim();
      window.location.href = "search.html?q=" + encodeURIComponent(text);
    });
  }

  grid.innerHTML = loadingHtml("Loading books...");

  var books = await getBooks(); // already newest first
  var recent = books.slice(0, 8);

  if (recent.length === 0) {
    grid.innerHTML = loadingHtml("No books added yet. Be the first to add one!");
    return;
  }

  var html = "";
  for (var i = 0; i < recent.length; i++) {
    html += bookCardHtml(recent[i], false);
  }
  grid.innerHTML = html;
}

/* ---------- 2. SEARCH PAGE ---------- */
async function setupSearchPage() {
  var grid = document.getElementById("searchResults");
  if (!grid) return;

  var searchInput = document.getElementById("searchInput");
  var categoryFilter = document.getElementById("categoryFilter");
  var conditionFilter = document.getElementById("conditionFilter");
  var typeFilter = document.getElementById("typeFilter");
  var priceFilter = document.getElementById("priceFilter");
  var countText = document.getElementById("resultCount");

  // The home page / category links can send text in the address bar
  var startText = getQueryParam("q");
  if (startText) {
    searchInput.value = startText;
  }
  var startCategory = getQueryParam("category");
  if (startCategory) {
    categoryFilter.value = startCategory;
  }

  grid.innerHTML = loadingHtml("Loading books...");

  // We download the books once, then filter them instantly while typing.
  var allBooks = await getBooks();

  function showResults() {
    var text = searchInput.value.trim().toLowerCase();
    var category = categoryFilter.value;
    var condition = conditionFilter.value;
    var type = typeFilter.value;
    var price = priceFilter.value;

    var results = [];
    for (var i = 0; i < allBooks.length; i++) {
      var book = allBooks[i];

      // Search by title, author, category or description (subject)
      var haystack = (
        book.title +
        " " +
        book.author +
        " " +
        book.category +
        " " +
        book.description
      ).toLowerCase();

      var matchesText = text === "" || haystack.indexOf(text) !== -1;
      var matchesCategory = category === "" || book.category === category;
      var matchesCondition = condition === "" || book.condition === condition;
      var matchesType = type === "" || book.type === type;

      // Price filter
      var bookPrice = Number(book.price || 0);
      var matchesPrice = true;
      if (price === "free") {
        matchesPrice = book.type === "Free" || bookPrice === 0;
      } else if (price === "low") {
        matchesPrice = bookPrice > 0 && bookPrice <= 200;
      } else if (price === "mid") {
        matchesPrice = bookPrice > 200 && bookPrice <= 400;
      } else if (price === "high") {
        matchesPrice = bookPrice > 400;
      }

      if (matchesText && matchesCategory && matchesCondition && matchesType && matchesPrice) {
        results.push(book);
      }
    }

    if (results.length === 0) {
      grid.innerHTML = "";
      countText.innerHTML =
        '<div class="empty-state"><p>No books found. Try a different search.</p></div>';
      return;
    }

    countText.textContent = results.length + " book(s) found";
    var html = "";
    for (var j = 0; j < results.length; j++) {
      html += bookCardHtml(results[j], false);
    }
    grid.innerHTML = html;
  }

  // Update the list whenever the user types or changes a filter
  searchInput.addEventListener("input", showResults);
  categoryFilter.addEventListener("change", showResults);
  conditionFilter.addEventListener("change", showResults);
  typeFilter.addEventListener("change", showResults);
  priceFilter.addEventListener("change", showResults);

  var resetBtn = document.getElementById("resetFilters");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      searchInput.value = "";
      categoryFilter.value = "";
      conditionFilter.value = "";
      typeFilter.value = "";
      priceFilter.value = "";
      showResults();
    });
  }

  showResults(); // show the books when the page opens
}

/* ---------- 3. BOOK DETAILS PAGE ---------- */
async function setupDetailsPage() {
  var holder = document.getElementById("bookDetails");
  if (!holder) return;

  holder.innerHTML = loadingHtml("Loading book details...");

  var id = getQueryParam("id");
  var book = await findBookById(id);

  if (!book) {
    holder.innerHTML =
      '<div class="empty-state"><p>Sorry, this book was not found.</p>' +
      '<a class="btn" href="search.html">Back to Books</a></div>';
    return;
  }

  var mailSubject = encodeURIComponent("BookSwap: I am interested in " + book.title);
  var mailBody = encodeURIComponent(
    "Hello " + book.sellerName + ",\n\nI saw your book \"" + book.title +
      "\" on BookSwap and I am interested.\n\nThank you."
  );

  holder.innerHTML =
    '<div class="card details-grid">' +
    '<div><img src="' +
    escapeHtml(getCoverImage(book)) +
    '" alt="Cover of ' +
    escapeHtml(book.title) +
    '"></div>' +
    "<div>" +
    '<h1 class="page-title">' +
    escapeHtml(book.title) +
    "</h1>" +
    '<p class="page-subtitle">by ' +
    escapeHtml(book.author) +
    "</p>" +
    '<p class="book-price">' +
    formatPrice(book) +
    ' <span class="' +
    typeBadgeClass(book.type) +
    '">' +
    escapeHtml(book.type) +
    "</span></p>" +
    '<ul class="details-list">' +
    "<li><b>Category</b> " + escapeHtml(book.category) + "</li>" +
    "<li><b>Condition</b> " + escapeHtml(book.condition) + "</li>" +
    "<li><b>Year / Semester</b> " + escapeHtml(book.yearSem) + "</li>" +
    "<li><b>Seller Name</b> " + escapeHtml(book.sellerName) + "</li>" +
    "<li><b>Seller Email</b> " + escapeHtml(book.sellerEmail) + "</li>" +
    "</ul>" +
    "<h3>Description</h3>" +
    "<p>" + escapeHtml(book.description) + "</p>" +
    '<div class="form-actions">' +
    '<a class="btn" href="mailto:' +
    escapeHtml(book.sellerEmail) +
    "?subject=" +
    mailSubject +
    "&body=" +
    mailBody +
    '">Contact Seller</a>' +
    '<a class="btn btn-outline" href="search.html">Back to Books</a>' +
    "</div>" +
    "</div>" +
    "</div>";
}

/* ---------- 4. ADD BOOK / EDIT BOOK PAGE ---------- */
async function setupAddBookPage() {
  var form = document.getElementById("bookForm");
  if (!form) return;

  // Only logged-in users can add books
  var user = await requireLogin("addBookContent", "loginNotice", "Add Book");
  if (!user) return;

  // If the address contains ?edit=<id> we are editing an old book
  var editId = getQueryParam("edit");
  var editingBook = editId ? await findBookById(editId) : null;

  // Fill the seller boxes with the logged-in user's details
  document.getElementById("sellerName").value = user.fullName;
  document.getElementById("sellerEmail").value = user.email;

  if (editingBook) {
    // Safety check: a user can edit only his/her own book
    // (the database rules also block anyone else)
    if (editingBook.userId !== user.id) {
      showMessage("formMessage", "You can only edit the books that you added.", "error");
      form.classList.add("hidden");
      return;
    }
    document.getElementById("pageHeading").textContent = "Edit Book";
    document.getElementById("submitBtn").textContent = "Save Changes";
    document.getElementById("bookTitle").value = editingBook.title;
    document.getElementById("bookAuthor").value = editingBook.author;
    document.getElementById("bookCategory").value = editingBook.category;
    document.getElementById("bookDescription").value = editingBook.description;
    document.getElementById("bookCondition").value = editingBook.condition;
    document.getElementById("bookYearSem").value = editingBook.yearSem;
    document.getElementById("bookPrice").value = editingBook.price;
    document.getElementById("bookType").value = editingBook.type;
    document.getElementById("sellerName").value = editingBook.sellerName;
    document.getElementById("sellerEmail").value = editingBook.sellerEmail;
    document.getElementById("bookImage").value = editingBook.image;
  }

  // Cancel button -> go back to My Books
  var cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", function () {
      window.location.href = "my-books.html";
    });
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    hideMessage("formMessage");

    // Read every value from the form
    var title = document.getElementById("bookTitle").value.trim();
    var author = document.getElementById("bookAuthor").value.trim();
    var category = document.getElementById("bookCategory").value;
    var description = document.getElementById("bookDescription").value.trim();
    var condition = document.getElementById("bookCondition").value;
    var yearSem = document.getElementById("bookYearSem").value.trim();
    var priceText = document.getElementById("bookPrice").value.trim();
    var type = document.getElementById("bookType").value;
    var sellerName = document.getElementById("sellerName").value.trim();
    var sellerEmail = document.getElementById("sellerEmail").value.trim();
    var image = document.getElementById("bookImage").value.trim();

    // ---- Validation ----
    if (title === "" || author === "" || category === "" || description === "" ||
        condition === "" || yearSem === "" || type === "" ||
        sellerName === "" || sellerEmail === "") {
      showMessage("formMessage", "Please fill in all the required fields.", "error");
      return;
    }
    if (description.length < 10) {
      showMessage("formMessage", "Please write a longer description (at least 10 characters).", "error");
      return;
    }
    if (!isValidEmail(sellerEmail)) {
      showMessage("formMessage", "Please enter a valid seller email address.", "error");
      return;
    }

    // Price is required only when the book is for sale
    var price = 0;
    if (type === "Sell") {
      if (priceText === "" || isNaN(Number(priceText)) || Number(priceText) <= 0) {
        showMessage("formMessage", "Please enter a valid price (a number greater than 0) for a book you want to sell.", "error");
        return;
      }
      price = Number(priceText);
    } else if (priceText !== "" && !isNaN(Number(priceText))) {
      price = Number(priceText);
    }

    var bookData = {
      title: title,
      author: author,
      category: category,
      description: description,
      condition: condition,
      yearSem: yearSem,
      price: price,
      type: type,
      sellerName: sellerName,
      sellerEmail: sellerEmail,
      image: image,
    };

    showMessage("formMessage", "Saving to the database...", "info");

    var result;
    if (editingBook) {
      result = await updateBook(editingBook.id, bookData);
    } else {
      result = await insertBook(bookData, user.id);
    }

    if (result.error) {
      showMessage("formMessage", "Could not save the book: " + result.error.message, "error");
      return;
    }

    if (editingBook) {
      showMessage("formMessage", "Book updated successfully! Going to My Books...", "success");
    } else {
      showMessage("formMessage", "Book added successfully! Going to My Books...", "success");
      form.reset();
    }

    setTimeout(function () {
      window.location.href = "my-books.html";
    }, 1200);
  });
}

/* ---------- 5. MY BOOKS PAGE ---------- */
async function setupMyBooksPage() {
  var grid = document.getElementById("myBooks");
  if (!grid) return;

  var user = await requireLogin("myBooksContent", "loginNotice", "My Books");
  if (!user) return;

  async function showMyBooks() {
    grid.innerHTML = loadingHtml("Loading your books...");
    var mine = await getBooksByUser(user.id);

    if (mine.length === 0) {
      grid.innerHTML = "";
      document.getElementById("myBooksEmpty").innerHTML =
        '<div class="empty-state">' +
        "<p>You haven't added any books yet.</p>" +
        '<a class="btn" href="add-book.html">Add Your First Book</a>' +
        "</div>";
      return;
    }

    document.getElementById("myBooksEmpty").innerHTML = "";
    var html = "";
    for (var j = 0; j < mine.length; j++) {
      html += bookCardHtml(mine[j], true); // true = show Edit and Delete
    }
    grid.innerHTML = html;

    // Attach the delete action to every Delete button
    var deleteButtons = grid.querySelectorAll("[data-delete]");
    for (var k = 0; k < deleteButtons.length; k++) {
      deleteButtons[k].addEventListener("click", async function () {
        var id = this.getAttribute("data-delete");
        var sure = confirm("Are you sure you want to delete this book?");
        if (!sure) return;

        var result = await deleteBook(id);
        if (result.error) {
          alert("Could not delete the book: " + result.error.message);
          return;
        }
        showMyBooks(); // refresh the list on the screen
      });
    }
  }

  showMyBooks();
}

/* ---------- 6. Start the correct page code ---------- */
document.addEventListener("DOMContentLoaded", function () {
  setupHomePage();
  setupSearchPage();
  setupDetailsPage();
  setupAddBookPage();
  setupMyBooksPage();
});
