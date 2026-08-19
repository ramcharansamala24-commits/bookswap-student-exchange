/* ===========================================================
   BookSwap - books.js
   Everything about books:
   - Home page "Recently Added Books"
   - Search page (search + filters)
   - Book details page
   - Add Book / Edit Book form
   - My Books page (edit + delete)
   =========================================================== */

/* ---------- 1. Find one book by its id ---------- */
function findBookById(id) {
  var books = getBooks();
  for (var i = 0; i < books.length; i++) {
    if (books[i].id === id) {
      return books[i];
    }
  }
  return null;
}

/* ---------- 2. HOME PAGE: recently added books ---------- */
function setupHomePage() {
  var grid = document.getElementById("recentBooks");
  if (!grid) return;

  var books = getBooks();
  // The newest books are added at the end, so we show the list reversed.
  var recent = books.slice().reverse().slice(0, 8);

  var html = "";
  for (var i = 0; i < recent.length; i++) {
    html += bookCardHtml(recent[i], false);
  }
  grid.innerHTML = html;

  // Hero search box -> go to the search page with the typed text
  var heroForm = document.getElementById("heroSearchForm");
  if (heroForm) {
    heroForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var text = document.getElementById("heroSearchInput").value.trim();
      window.location.href = "search.html?q=" + encodeURIComponent(text);
    });
  }
}

/* ---------- 3. SEARCH PAGE ---------- */
function setupSearchPage() {
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

  // This function shows the books that match the search and the filters.
  function showResults() {
    var books = getBooks();
    var text = searchInput.value.trim().toLowerCase();
    var category = categoryFilter.value;
    var condition = conditionFilter.value;
    var type = typeFilter.value;
    var price = priceFilter.value;

    var results = [];
    for (var i = 0; i < books.length; i++) {
      var book = books[i];

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

/* ---------- 4. BOOK DETAILS PAGE ---------- */
function setupDetailsPage() {
  var holder = document.getElementById("bookDetails");
  if (!holder) return;

  var id = getQueryParam("id");
  var book = findBookById(id);

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
    "<h1 class=\"page-title\">" +
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

/* ---------- 5. ADD BOOK / EDIT BOOK PAGE ---------- */
function setupAddBookPage() {
  var form = document.getElementById("bookForm");
  if (!form) return;

  // Only logged-in users can add books
  var user = requireLogin("addBookContent", "loginNotice", "Add Book");
  if (!user) return;

  // If the address contains ?edit=<id> we are editing an old book
  var editId = getQueryParam("edit");
  var editingBook = editId ? findBookById(editId) : null;

  // Fill the seller boxes with the logged-in user's details
  document.getElementById("sellerName").value = user.fullName;
  document.getElementById("sellerEmail").value = user.email;

  if (editingBook) {
    // Safety check: a user can edit only his/her own book
    if (editingBook.ownerEmail !== user.email) {
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

  form.addEventListener("submit", function (event) {
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

    var books = getBooks();

    if (editingBook) {
      // ---- EDIT: change the old book object ----
      for (var i = 0; i < books.length; i++) {
        if (books[i].id === editingBook.id) {
          books[i].title = title;
          books[i].author = author;
          books[i].category = category;
          books[i].description = description;
          books[i].condition = condition;
          books[i].yearSem = yearSem;
          books[i].price = price;
          books[i].type = type;
          books[i].sellerName = sellerName;
          books[i].sellerEmail = sellerEmail;
          books[i].image = image;
          break;
        }
      }
      saveBooks(books);
      showMessage("formMessage", "Book updated successfully! Going to My Books...", "success");
    } else {
      // ---- ADD: create a new book object ----
      var newBook = {
        id: createId(), // unique id
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
        ownerEmail: user.email, // the book belongs to the logged-in user
      };
      books.push(newBook);
      saveBooks(books);
      showMessage("formMessage", "Book added successfully! Going to My Books...", "success");
      form.reset();
    }

    setTimeout(function () {
      window.location.href = "my-books.html";
    }, 1300);
  });
}

/* ---------- 6. MY BOOKS PAGE ---------- */
function setupMyBooksPage() {
  var grid = document.getElementById("myBooks");
  if (!grid) return;

  var user = requireLogin("myBooksContent", "loginNotice", "My Books");
  if (!user) return;

  function showMyBooks() {
    var books = getBooks();
    var mine = [];
    for (var i = 0; i < books.length; i++) {
      if (books[i].ownerEmail === user.email) {
        mine.push(books[i]);
      }
    }

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
      deleteButtons[k].addEventListener("click", function () {
        var id = this.getAttribute("data-delete");
        var sure = confirm("Are you sure you want to delete this book?");
        if (!sure) return;

        var allBooks = getBooks();
        var kept = [];
        for (var m = 0; m < allBooks.length; m++) {
          if (allBooks[m].id !== id) {
            kept.push(allBooks[m]);
          }
        }
        saveBooks(kept);
        showMyBooks(); // refresh the list on the screen
      });
    }
  }

  showMyBooks();
}

/* ---------- 7. Start the correct page code ---------- */
document.addEventListener("DOMContentLoaded", function () {
  setupHomePage();
  setupSearchPage();
  setupDetailsPage();
  setupAddBookPage();
  setupMyBooksPage();
});
