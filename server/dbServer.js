const express = require("express");
var cors = require("cors");
const app = express();
const mysql = require("mysql");

app.use(cors());

//web3
const Web3 = require("web3");
let web3 = new Web3(
  "wss://rinkeby.infura.io/ws/v3/f3ad0d479bf94c1791f813da1a914632"
);

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
  const wallet = web3.eth.accounts.create(web3.utils.randomHex(32));
  const address = wallet.address;
  const privateKey = wallet.privateKey;

  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "SELECT * FROM usertable WHERE email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    const sqlInsert = "INSERT INTO usertable VALUES (0,?,?,?,?,?)";
    const insert_query = mysql.format(sqlInsert, [
      username,
      email,
      hashedPassword,
      address,
      privateKey,
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
          console.log("---------> Generating accessToken");
          const token = generateAccessToken({
            email: email,
            username: username,
            address: address,
          });
          console.log(token);
          res.json({ accessToken: token });
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
    const sqlSearch = "Select * from usertable where email = ?";
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
          const token = generateAccessToken({
            email: email,
            username: result[0].username,
            address: result[0].address,
          });
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

//Place bet
app.post("/bet", async (req, res) => {
  const email = req.body.email;
  const betResult = req.body.betResult; // true:win false:lose
  const betAmt = await web3.utils.toWei(String(req.body.betAmt));
  const profitAmt = await web3.utils.toWei(String(req.body.profitAmt));
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from usertable where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    await connection.query(search_query, async (err, result) => {
      connection.release();

      if (err) throw err;
      if (result.length == 0) {
        console.log("--------> User does not exist");
        res.sendStatus(404);
      } else {
        if (betResult == true) {
          //on win
          const privateKey =
            "bffb9004264cb1be3387106a327170d875b0601598d8ca80ad95da811b90fe36";
          const sender = "0x14d260dcb7c543d289527B8855fb9850390565d2";
          const receiver = result[0].address;
          web3.eth
            .getBalance(sender)
            .then((currBal) => {
              if (parseInt(currBal) < parseInt(profitAmt)) {
                //If insufficient balance
                res.send("Insufficient balance!");
              } else {
                //send ether
                return web3.eth.getTransactionCount(sender, "pending");
              }
            })
            .then((nonce) => {
              return web3.eth.accounts.signTransaction(
                {
                  nonce: nonce,
                  to: receiver,
                  value: parseInt(profitAmt),
                  gas: 2000000,
                },
                privateKey
              );
            })
            .then((signedTx) => {
              console.log(signedTx);
              return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            })
            .then((hash) => {
              console.log(hash);
              res.json({
                hash: hash,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          //on Lose
          const privateKey = result[0].privateKey;
          const sender = result[0].address;
          const receiver = "0x14d260dcb7c543d289527B8855fb9850390565d2";
          web3.eth
            .getBalance(sender)
            .then((currBal) => {
              if (parseInt(currBal) < parseInt(betAmt)) {
                //If insufficient balance
                res.send("Insufficient balance!");
              } else {
                //send ether
                return web3.eth.getTransactionCount(sender, "pending");
              }
            })
            .then((nonce) => {
              return web3.eth.accounts.signTransaction(
                {
                  nonce: nonce,
                  to: receiver,
                  value: betAmt,
                  gas: 2000000,
                },
                privateKey
              );
            })
            .then((signedTx) => {
              console.log(signedTx);
              return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            })
            .then((hash) => {
              console.log(hash);
              res.json({
                hash: hash,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } //end of User exists
    }); //end of connection.query()
  }); //end of db.connection()
}); //end of app.post()
//Reward on win bet
