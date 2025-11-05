const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "dharm@002", // <-- change this
  database: "maggishop_db"
});

db.connect((err) => {
  if (err) {
    console.log(" Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

//  LOGIN API
app.post("/login", (req, res) => {
  const { user_id, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE user_id = ? AND password = ?",
    [user_id, password],
    (err, result) => {
      if (err) return res.json({ error: err });

      if (result.length > 0) {
        res.json({ success: true, user: result[0] });
      } else {
        res.json({ success: false, message: "Invalid Hostel ID or Password" });
      }
    }
  );
});

//  GET ITEMS API
app.get("/items", (req, res) => {
  db.query("SELECT * FROM items", (err, result) => {
    if (err) return res.json({ error: err });
    res.json(result);
  });
});

//  PLACE ORDER API (Calls Stored Procedure)
// ✅ PLACE ORDER API (Multiple Items Support)
app.post("/order", (req, res) => {
  const { user_id, cart } = req.body;

  cart.forEach((c) => {
    db.query("CALL PlaceOrder(?, ?, ?)", [user_id, c.item.item_id, c.quantity]);
  });

  res.json({ success: true, message: "Order Placed Successfully ✅" });
});


//  Start Backend Server
app.listen(5000, () => {
  console.log(" Backend Server Running at: http://localhost:5000");
});
