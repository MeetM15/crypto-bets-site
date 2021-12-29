const express = require("express");
var cors = require("cors");
const app = express();
const mysql = require("mysql");

app.use(cors());
require("dotenv").config();

// sconnection details
const db = mysql.createPool({
  host: "l6glqt8gsx37y4hs.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "ae3jxjses5uz4pvo",
  password: "jvdktwz5f5knvaal",
  database: "s8lxs5ne2m2pta3x",
});

db.getConnection((err, connection) => {
  if (err) throw err;
  console.log("DB connected successfully: " + connection.threadId);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server Started on port ${port}...`));

const bcrypt = require("bcrypt");
app.use(express.json());
//middleware to read req.body.<params>
//CREATE USER
app.post("/createUser", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "SELECT * FROM user_table WHERE email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    const sqlInsert = "INSERT INTO user_table VALUES (0,?,?,?)";
    const insert_query = mysql.format(sqlInsert, [
      username,
      email,
      hashedPassword,
    ]);
    // ? will be replaced by values
    // ?? will be replaced by string
    await connection.query(search_query, async (err, result) => {
      if (err) throw err;
      console.log("------> Search Results");
      console.log(result.length);
      if (result.length != 0) {
        connection.release();
        console.log("------> User already exists");
        res.sendStatus(409);
      } else {
        await connection.query(insert_query, (err, result) => {
          connection.release();
          if (err) throw err;
          console.log("--------> Created new User");
          console.log(result.insertId);
          res.sendStatus(201);
        });
      }
    }); //end of connection.query()
  }); //end of db.getConnection()
}); //end of app.post()

//generateAccessToken function
const jwt = require("jsonwebtoken");
function generateAccessToken(email) {
  return jwt.sign(email, "secret", { expiresIn: "15m" });
}

//LOGIN (AUTHENTICATE USER, and return accessToken)
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from user_table where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    await connection.query(search_query, async (err, result) => {
      connection.release();

      if (err) throw err;
      if (result.length == 0) {
        console.log("--------> User does not exist");
        res.sendStatus(404);
      } else {
        const hashedPassword = result[0].password;
        //get the hashedPassword from result
        if (await bcrypt.compare(password, hashedPassword)) {
          console.log("---------> Login Successful");
          console.log("---------> Generating accessToken");
          const token = generateAccessToken({ email: email });
          console.log(token);
          res.json({ accessToken: token });
        } else {
          res.send("Password incorrect!");
        } //end of Password incorrect
      } //end of User exists
    }); //end of connection.query()
  }); //end of db.connection()
}); //end of app.post()

//Check to make sure header is not undefined, if so, return Forbidden (403)
const checkToken = (req, res, next) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    req.token = token;
    next();
  } else {
    //If header is undefined return Forbidden (403)
    res.sendStatus(403);
  }
};
//This is a protected route
app.get("/user", checkToken, (req, res) => {
  //verify the JWT token generated for the user
  jwt.verify(req.token, "secret", (err, authorizedData) => {
    if (err) {
      //If error send Forbidden (403)
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
    } else {
      //If token is successfully verified, we can send the autorized data
      res.json({
        message: "Successful log in",
        authorizedData,
      });
      console.log("SUCCESS: Connected to protected route");
    }
  });
});
