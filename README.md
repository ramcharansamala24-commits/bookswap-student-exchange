# Book Nook Exchange

Build a Beginner-Friendly Online Book Exchange Platform

I am a first-year B.Tech student and I know basic HTML and CSS. I want to build a simple but professional Online Book Exchange Platform as my college mini-project.

Please create the complete working website for me using only:

- HTML5

- CSS3

- Vanilla JavaScript

- Browser LocalStorage for storing data

Important restrictions

- Do NOT use React.

- Do NOT use Node.js.

- Do NOT use Express.

- Do NOT use MongoDB or MySQL.

- Do NOT use Firebase.

- Do NOT use any external backend.

- Do NOT use TypeScript.

- Do NOT use complicated libraries or frameworks.

- Keep the code simple and beginner-friendly so I can understand it and explain it during my college viva.

- The application must work by opening the HTML file in a browser.

- Do not leave unfinished buttons, broken links, placeholder functionality, or console errors.

- Make sure all pages and features are connected and working correctly.

Project Name

BookSwap — Online Book Exchange Platform

Main Objective

The platform should allow college students to:

1. Register and log in.

2. Add books they want to sell, exchange, or give away.

3. Search for available books.

4. View complete book details.

5. Manage the books they have added.

The design should be clean, modern, simple, student-friendly, and suitable for a B.Tech college project.

Required Features

1. Homepage

Create an attractive homepage containing:

- Website logo/name: BookSwap

- Navigation bar

- Home

- Search Books

- Add Book

- My Books

- Login/Register

- Hero section with a short description such as:

  "Buy, Sell and Exchange Books with Students"

- Search bar

- Categories section

- Recently Added Books section

- Simple footer

The homepage should display sample books when there is no user-added data.

The navigation bar should work correctly and take the user to the appropriate sections/pages.

---

2. User Registration and Login

Create a simple registration and login system using LocalStorage.

Registration fields:

- Full Name

- Email

- Password

- College Name

- Department

- Year of Study

Add basic validation:

- All required fields must be filled.

- Email should have a valid format.

- Password should have a minimum length.

- Show clear error messages.

- Show a success message after registration.

Login:

Allow users to log in using:

- Email

- Password

After successful login:

- Store the logged-in user's information in LocalStorage.

- Show the user's name in the navigation bar.

- Allow access to Add Book and My Books.

If the user is not logged in and tries to add a book or access My Books, show a message asking them to log in.

Add a Logout button.

This is only a beginner-level demo authentication system using LocalStorage. Do not claim it is production-level secure authentication.

---

3. Add Book

Create an Add Book page/form.

Fields:

- Book Title

- Author Name

- Subject/Category

- Book Description

- Book Condition

  - New

  - Like New

  - Good

  - Used

- Year/Semester

- Price

- Exchange Option

  - Sell

  - Exchange

  - Free

- Seller Name

- Seller Email

- Optional Book Image URL

Add proper form validation.

When the user submits the form:

- Validate all required fields.

- Create a unique ID for the book.

- Save the book information in LocalStorage.

- Associate the book with the currently logged-in user.

- Show a success message.

- Redirect the user to My Books or Book Details.

The user should be able to cancel the form.

---

4. Search Books

Create a dedicated Search Books section/page.

Display all available books as attractive cards.

Each book card should show:

- Book image

- Book title

- Author

- Category

- Condition

- Price

- Sell/Exchange/Free status

- View Details button

Add a search bar that allows users to search by:

- Book title

- Author

- Category

- Subject

Add filters for:

- Category

- Condition

- Sell/Exchange/Free

- Price

The search should update the displayed books using JavaScript without refreshing the page.

If no books are found, display:

"No books found. Try a different search."

---

5. Book Details

When the user clicks View Details, open a Book Details page/section.

Display:

- Large book image

- Book title

- Author

- Category

- Description

- Condition

- Year/Semester

- Price

- Exchange/Sell/Free status

- Seller name

- Seller email

Add a Contact Seller button.

For this beginner version, the Contact Seller button can open the user's default email application using a "mailto:" link.

Add a Back to Books button.

Make sure the correct book information is displayed based on the selected book ID.

---

6. My Books

Create a My Books page/section.

Only display books added by the currently logged-in user.

Each book should have:

- Book image

- Title

- Author

- Price

- Condition

- Status

- View Details

- Edit

- Delete

Edit

Allow the user to edit their own book information.

Delete

Allow the user to delete their own book.

Before deleting, show a confirmation message such as:

"Are you sure you want to delete this book?"

After deletion, update LocalStorage and refresh the displayed list.

If the user has not added any books, show:

"You haven't added any books yet."

And provide an Add Your First Book button.

---

Data Storage

Use browser LocalStorage.

Create separate storage for:

- Registered users

- Logged-in user

- Books

For example:

- "bookswap_users"

- "bookswap_currentUser"

- "bookswap_books"

Use JSON with LocalStorage.

Make sure the application handles empty LocalStorage correctly.

If LocalStorage contains no books, automatically show a few sample books so that the website does not look empty.

---

UI/UX Requirements

Make the website look professional but simple enough for a first-year college project.

Use:

- Clean navigation bar

- Cards

- Buttons

- Forms

- Search bar

- Simple icons if needed

- Consistent spacing

- Rounded corners

- Responsive layout

- Mobile-friendly design

Use a simple academic/student-friendly color scheme.

Do not make the design unnecessarily complicated.

Make sure:

- Text is easy to read.

- Buttons are clearly visible.

- Forms are properly aligned.

- Book cards have equal spacing.

- The website works on laptop and mobile screen sizes.

---

Project Structure

Keep the project structure simple:

BookSwap/

│

├── index.html

├── login.html

├── register.html

├── add-book.html

├── search.html

├── book-details.html

├── my-books.html

│

├── css/

│   └── style.css

│

├── js/

│   ├── auth.js

│   ├── books.js

│   └── main.js

│

└── images/

If a simpler structure is better, you may use fewer files, but keep the code organized and easy for a beginner to understand.

JavaScript Requirements

Write clean and simple Vanilla JavaScript.

Use:

- "addEventListener"

- Functions

- Arrays

- Objects

- "localStorage"

- JSON

- Basic DOM manipulation

- Form validation

- Search/filter functions

Add comments explaining important sections of the code.

Do not use unnecessarily advanced JavaScript concepts.

Error Handling

Before finishing, check the entire application carefully.

Make sure:

- Every navigation link works.

- Registration works.

- Login works.

- Logout works.

- Add Book works.

- Search works.

- Filters work.

- Book Details works.

- Edit works.

- Delete works.

- LocalStorage works.

- Login restrictions work.

- Forms validate correctly.

- Empty states are handled.

- No JavaScript errors appear in the browser console.

- No broken images or broken links are present.

- The website does not crash if LocalStorage is empty.

Sample Data

Add 5–8 sample books automatically if the user has no books stored.

Example books can include:

- Python Programming

- Data Structures and Algorithms

- Engineering Mathematics

- Digital Electronics

- Computer Fundamentals

- Engineering Physics

- Engineering Chemistry

- Java Programming

Use realistic sample information.

Important Beginner Requirement

I am a first-year B.Tech student.

Therefore, after creating the application, provide a short explanation of:

1. What each HTML file does.

2. What the CSS file does.

3. What each JavaScript file does.

4. How LocalStorage works in this project.

5. How user registration works.

6. How login works.

7. How books are stored.

8. How searching works.

9. How Edit and Delete work.

10. How the pages communicate with each other.

Also provide simple instructions for:

"How to run this project on my laptop."

Final Requirement

First create the complete working application.

Then test all major features logically and fix any errors you find.

Do not add advanced technologies.

Keep everything beginner-friendly, clean, functional, and suitable for a first-year B.Tech mini-project.

The final result should be a complete Online Book Exchange Platform called BookSwap with:

1. Homepage

2. User Registration/Login

3. Add Book

4. Search Books

5. Book Details

6. My Books

All six features must work together using HTML, CSS, Vanilla JavaScript, and LocalStorage.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bookswap-student-exchange.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6cb0386b-073d-486d-b12d-192058ca79e9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
