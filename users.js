// Import Firebase app configuration
import { app } from "./firebase-config.js";

// Import database methods from Firebase SDK
import {
  getDatabase,
  ref,
  get,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

// Get a reference to the Firebase Realtime Database
const db = getDatabase();

// Get the HTML element representing the users table
const usersTable = document.getElementById("users-table");

// Retrieve data from the database on page load
document.addEventListener("DOMContentLoaded", function () {
  // Retrieve data from the "User" node in the database
  get(ref(db, "User/"), {})
    // Handle the returned snapshot asynchronously
    .then((snapshot) => {
      if (snapshot.exists()) {
        // Loop through each child snapshot
        snapshot.forEach((childSnapshot) => {
          // Extract user data and ID from the child snapshot
          const userData = childSnapshot.val();
          const userId = childSnapshot.key;

          // Create a new table row for each user
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${userId}</td>
            <td class="name">${userData.Name}</td>
            <td class="mobile">${userData.Mobile}</td>
            <td>
              <button class="btn delete">Delete</button>
              <button class="btn edit">Edit</button>
              <button class="btn save" style="display:none">Save</button>
            </td>
          `;
          // Append the row to the users table
          usersTable.appendChild(row);
        });
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

// Add event listener to the users table for handling user interactions
usersTable.addEventListener("click", function (e) {
  // Get the target element that was clicked
  const target = e.target;
  // Find the parent row (tr) of the clicked element
  const parentRow = target.closest("tr");
  // Extract the user ID from the first cell of the row
  const id = parentRow.querySelector("td:first-child").textContent;
  // Find the elements representing name and mobile number in the row
  const name = parentRow.querySelector(".name");
  const mobile = parentRow.querySelector(".mobile");

  // Handle delete button click
  if (target.classList.contains("delete")) {
    // Remove the user data from the database based on the ID
    remove(ref(db, `User/${id}`))
      .then(() => {
        alert("Data deleted successfully");
        location.reload(); // Reload the page to reflect changes
      })
      .catch((error) => {
        alert(error);
      });
    // Handle edit button click
  } else if (target.classList.contains("edit")) {
    // Allow the user to edit the name and mobile number
    name.contentEditable = true;
    mobile.contentEditable = true;

    // Add a class to indicate editable content
    name.classList.add("editable");
    mobile.classList.add("editable");

    // Hide the edit button and show the save button
    target.style.display = "none";
    parentRow.querySelector(".save").style.display = "inline-block";
    // Notify the user that content is editable
    alert("You can now edit the content.");
    // Handle save button click
  } else if (target.classList.contains("save")) {
    // Retrieve the updated name and mobile number from the table cells
    const newName = name.textContent;
    const newMobile = mobile.textContent;
    // Update the user data in the database
    update(ref(db, `User/${id}`), { Name: newName, Mobile: newMobile })
      .then(() => {
        alert("Data updated successfully");
        location.reload(); // Reload the page to reflect changes
      })
      .catch((error) => {
        alert(error);
      });
  }
});
