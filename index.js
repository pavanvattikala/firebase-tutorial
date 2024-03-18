// import app
import { app } from "./firebase-config.js";

// import firebase database
import {
  getDatabase,
  ref,
  set,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

// get database instance
const db = getDatabase();

// get form elements
var id = document.getElementById("id");
var name = document.getElementById("name");
var mobile = document.getElementById("mobile");

var insertBtn = document.getElementById("insert");

// insert data
function InsertData() {
  // insert data to database
  set(ref(db, "User/" + id.value), {
    Name: name.value,
    Mobile: mobile.value,
  })
    .then(() => {
      alert("Data inserted successfully");
      // clear form
      id.value = "";
      name.value = "";
      mobile.value = "";
    })
    .catch((error) => {
      alert(error);
    });
}

insertBtn.addEventListener("click", InsertData);
