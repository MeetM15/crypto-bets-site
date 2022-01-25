const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const mysql = require("mysql");

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});
//web3
const Web3 = require("web3");
let web3 = new Web3(
  "https://eth-rinkeby.alchemyapi.io/v2/sk88g0PfYAHxltvWlVpWWbvrXMnv22TN"
);
let web3_bsc = new Web3(
  "https://speedy-nodes-nyc.moralis.io/487960593a8857bde8a74862/bsc/testnet"
);

require("dotenv").config();
app.use(cors());
app.use(express.json());
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

//connect socket
io.on("connection", (socket) => {
  console.log("A user is connected");

  socket.on("message", (message) => {
    console.log(`message from ${socket.id} : ${message}`);
  });

  socket.on("disconnect", () => {
    console.log(`socket ${socket.id} disconnected`);
  });
  //on bet
  socket.on("placeBet", (socket) => {
    console.log("A User Placed Bet!");
    io.emit("getLiveBetData");
  });
});

//middleware to read req.body.<params>
//CREATE USER
app.post("/createUser", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const wallet = await web3.eth.accounts.create();
  const bscwallet = await web3_bsc.eth.accounts.create();
  const address = wallet.address;
  const privateKey = wallet.privateKey;
  const bscAddress = bscwallet.address;
  const bscPrivateKey = bscwallet.privateKey;
  const referredById =
    req.body.referredById != undefined ? req.body.referredById : 0;
  const points = req.body.points != undefined ? req.body.points : 0;
  const usedReferralBonus = 0;
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "SELECT * FROM userinfotable WHERE email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    const sqlInsert =
      "INSERT INTO userinfotable VALUES (0,?,?,?,?,?,?,?,?,?,?)";
    const insert_query = mysql.format(sqlInsert, [
      username,
      email,
      hashedPassword,
      address,
      bscAddress,
      privateKey,
      bscPrivateKey,
      referredById,
      points,
      usedReferralBonus,
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
        await connection.query(insert_query, async (err, insertResult) => {
          if (err) throw err;
          console.log("--------> Created new User");
          await connection.query(search_query, async (err, result) => {
            if (err) throw err;
            console.log("------> Search Results");
            console.log(result.length);
            if (result.length != 0) {
              connection.release();
              console.log("---------> Generating accessToken");
              const token = generateAccessToken({
                userId: result[0].userId,
                email: email,
                username: result[0].username,
                address: result[0].address,
                bscAddress: result[0].bscAddress,
                referredById: result[0].referredById,
                points: result[0].points,
                usedReferralBonus: result[0].usedReferralBonus,
                totalBetAmt: result[0].totalBetAmt,
              });
              console.log(token);
              res.json({ accessToken: token });
              console.log(insertResult.insertId);
              res.sendStatus(201);
            }
          });
        });
      }
    }); //end of connection.query()
  }); //end of db.getConnection()
}); //end of app.post()

//generateAccessToken function
function generateAccessToken(email) {
  return jwt.sign(email, "secret", {});
}

//LOGIN (AUTHENTICATE USER, and return accessToken)
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from userinfotable where email = ?";
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
            userId: result[0].userId,
            email: email,
            username: result[0].username,
            address: result[0].address,
            bscAddress: result[0].bscAddress,
            referredById: result[0].referredById,
            points: result[0].points,
            usedReferralBonus: result[0].usedReferralBonus,
            totalBetAmt: result[0].totalBetAmt,
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
  const username = req.body.username;
  const betAmtInNative = req.body.betAmt;
  const multiplier = req.body.multiplier;
  const betTime = req.body.betTime;
  const result = req.body.result;
  const payout = req.body.payout;
  const email = req.body.email;
  const chain = req.body.chain;
  const betResult = req.body.betResult; // true:win false:lose
  const betAmt = await web3.utils.toWei(String(req.body.betAmt));
  const profitAmt = await web3.utils.toWei(String(req.body.profitAmt));
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from userinfotable where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    const sqlInsert = "INSERT INTO betstable VALUES (0,?,?,?,?,?,?,?,?,?)";
    const insert_query = mysql.format(sqlInsert, [
      username,
      betTime,
      betAmtInNative,
      multiplier,
      result,
      payout,
      betResult,
      chain,
      email,
    ]);
    await connection.query(search_query, async (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        console.log("--------> User does not exist");
        res.sendStatus(404);
      } else {
        if (chain == "eth") {
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
                    gas: 30000,
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
                    gas: 30000,
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
        } else {
          if (betResult == true) {
            //on win
            const privateKey =
              "bffb9004264cb1be3387106a327170d875b0601598d8ca80ad95da811b90fe36";
            const sender = "0x14d260dcb7c543d289527B8855fb9850390565d2";
            const receiver = result[0].bscAddress;
            web3_bsc.eth
              .getBalance(sender)
              .then((currBal) => {
                if (parseInt(currBal) < parseInt(profitAmt)) {
                  //If insufficient balance
                  res.send("Insufficient balance!");
                } else {
                  //send ether
                  return web3_bsc.eth.getTransactionCount(sender, "pending");
                }
              })
              .then((nonce) => {
                return web3_bsc.eth.accounts.signTransaction(
                  {
                    nonce: nonce,
                    to: receiver,
                    value: parseInt(profitAmt),
                    gas: 30000,
                  },
                  privateKey
                );
              })
              .then((signedTx) => {
                console.log(signedTx);
                return web3_bsc.eth.sendSignedTransaction(
                  signedTx.rawTransaction
                );
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
            const privateKey = result[0].bscPrivateKey;
            const sender = result[0].bscAddress;
            const receiver = "0x14d260dcb7c543d289527B8855fb9850390565d2";
            web3_bsc.eth
              .getBalance(sender)
              .then((currBal) => {
                if (parseInt(currBal) < parseInt(betAmt)) {
                  //If insufficient balance
                  res.send("Insufficient balance!");
                } else {
                  //send ether
                  return web3_bsc.eth.getTransactionCount(sender, "pending");
                }
              })
              .then((nonce) => {
                return web3_bsc.eth.accounts.signTransaction(
                  {
                    nonce: nonce,
                    to: receiver,
                    value: betAmt,
                    gas: 30000,
                  },
                  privateKey
                );
              })
              .then((signedTx) => {
                console.log(signedTx);
                return web3_bsc.eth.sendSignedTransaction(
                  signedTx.rawTransaction
                );
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
        }
      } //end of User exists
    }); //end of bet connection.query()

    //Store bet details
    await connection.query(insert_query, async (err, result) => {
      connection.release();
      if (err) throw err;
      console.log("--------> added bet data");
      console.log(result.insertId);
      res.sendStatus(201);
    }); //end of bet details connection.query()
  }); //end of db.connection()
}); //end of app.post()
//Reward on win bet

//Withdraw winnings
app.post("/withdraw", async (req, res) => {
  const email = req.body.email;
  const chain = req.body.chain;
  const receiver = req.body.receiver;
  const amt = await web3.utils.toWei(String(req.body.amt));
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from userinfotable where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    await connection.query(search_query, async (err, result) => {
      connection.release();

      if (err) throw err;
      if (result.length == 0) {
        console.log("--------> User does not exist");
        res.sendStatus(404);
      } else {
        if (chain == "eth") {
          //on Lose
          const privateKey = result[0].privateKey;
          const sender = result[0].address;
          web3.eth
            .getBalance(sender)
            .then((currBal) => {
              if (parseInt(currBal) < parseInt(amt)) {
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
                  value: amt,
                  gas: 30000,
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
          const privateKey = result[0].bscPrivateKey;
          const sender = result[0].bscAddress;
          web3_bsc.eth
            .getBalance(sender)
            .then((currBal) => {
              if (parseInt(currBal) < parseInt(amt)) {
                //If insufficient balance
                res.send("Insufficient balance!");
              } else {
                return web3_bsc.eth.getTransactionCount(sender, "pending");
              }
            })
            .then((nonce) => {
              return web3_bsc.eth.accounts.signTransaction(
                {
                  nonce: nonce,
                  to: receiver,
                  value: amt,
                  gas: 30000,
                },
                privateKey
              );
            })
            .then((signedTx) => {
              console.log(signedTx);
              return web3_bsc.eth.sendSignedTransaction(
                signedTx.rawTransaction
              );
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
//withdraw winnings
//Store bet details

//live bets
app.get("/liveBets", (req, res) => {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const search_query = "SELECT * FROM betstable ORDER BY betId DESC LIMIT 10";
    await connection.query(search_query, async (err, result) => {
      connection.release();
      if (err) throw err;
      else res.json(result);
    }); //end of connection.query()
  }); //end of db.connection()
}); //end of app.post()

//my bets
app.post("/myBets", (req, res) => {
  const email = req.body.email;
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch =
      "Select * from betstable where email = ? ORDER BY betId DESC LIMIT 10";
    const search_query = mysql.format(sqlSearch, [email]);
    await connection.query(search_query, async (err, result) => {
      connection.release();
      if (err) throw err;
      else res.json(result);
    }); //end of connection.query()
  }); //end of db.connection()
}); //end of app.post()

//set total bet
app.post("/totalBet", async (req, res) => {
  const email = req.body.email;
  const amt = req.body.amt;
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from userinfotable where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    const updateTotalBet =
      "UPDATE userinfotable SET totalBetAmt = ? WHERE email = ?";
    const update_query = mysql.format(updateTotalBet, [amt, email]);
    await connection.query(search_query, async (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        console.log("--------> User does not exist");
        res.sendStatus(404);
      } else {
        await connection.query(update_query, async (err, result) => {
          connection.release();
          if (err) throw err;
          res.json(result);
        });
      } //end of User exists
    }); //end of connection.query()
  }); //end of db.connection()
}); //end of app.post()

app.post("/getTotalBet", (req, res) => {
  const email = req.body.email;
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from userinfotable where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    await connection.query(search_query, async (err, result) => {
      connection.release();
      if (err) throw err;
      else res.json(result);
    }); //end of connection.query()
  }); //end of db.connection()
}); //end of app.post()

//use referral bonus winnings
app.post("/referralBonus", async (req, res) => {
  const email = req.body.email;
  const amt = await web3.utils.toWei(String(req.body.amt));
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from userinfotable where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    const updateTotalBet =
      "UPDATE userinfotable SET usedReferralBonus = 1 WHERE email = ?";
    const update_query = mysql.format(updateTotalBet, [email]);
    await connection.query(search_query, async (err, searchResult) => {
      if (err) throw err;
      if (searchResult.length == 0) {
        console.log("--------> User does not exist");
        res.sendStatus(404);
      } else {
        if (
          !searchResult[0].usedReferralBonus &&
          searchResult.referredById != 0
        ) {
          const sqlSearchRefer = "Select * from userinfotable where userId = ?";
          const search_query_refer = mysql.format(sqlSearchRefer, [
            searchResult.referredById,
          ]);
          await connection.query(
            search_query_refer,
            async (err, referResult) => {
              if (err) throw err;
              if (referResult.length == 0) {
                connection.release();
                console.log("Not Referred by anyone!");
                res.json({
                  message: "noReferral",
                });
              } else {
                const privateKey =
                  "bffb9004264cb1be3387106a327170d875b0601598d8ca80ad95da811b90fe36";
                const sender = "0x14d260dcb7c543d289527B8855fb9850390565d2";
                const receiver = referResult[0].address;
                web3.eth
                  .getBalance(sender)
                  .then((currBal) => {
                    if (parseInt(currBal) < parseInt(amt)) {
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
                        value: amt,
                        gas: 30000,
                      },
                      privateKey
                    );
                  })
                  .then((signedTx) => {
                    console.log(signedTx);
                    return web3.eth.sendSignedTransaction(
                      signedTx.rawTransaction
                    );
                  })
                  .then((hash) => {
                    console.log(hash);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                await connection.query(update_query, async (err, result) => {
                  connection.release();
                  if (err) throw err;

                  const privateKey =
                    "bffb9004264cb1be3387106a327170d875b0601598d8ca80ad95da811b90fe36";
                  const sender = "0x14d260dcb7c543d289527B8855fb9850390565d2";
                  const receiver = searchResult[0].address;
                  web3.eth
                    .getBalance(sender)
                    .then((currBal) => {
                      if (parseInt(currBal) < parseInt(amt)) {
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
                          value: amt,
                          gas: 30000,
                        },
                        privateKey
                      );
                    })
                    .then((signedTx) => {
                      console.log(signedTx);
                      return web3.eth.sendSignedTransaction(
                        signedTx.rawTransaction
                      );
                    })
                    .then((hash) => {
                      console.log(hash);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                });
              }
            }
          );
        }
        res.sendStatus(400);
      } //end of User exists
    }); //end of connection.query()
  }); //end of db.connection()
}); //end of app.post()
//use referral bonus winnings
//use referral bonus winnings
app.post("/vipLevelUp", async (req, res) => {
  const email = req.body.email;
  const amt = await web3.utils.toWei(String(req.body.amt));
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from userinfotable where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    await connection.query(search_query, async (err, searchResult) => {
      if (err) throw err;
      if (searchResult.length == 0) {
        console.log("--------> User does not exist");
        res.sendStatus(404);
      } else {
        const privateKey =
          "bffb9004264cb1be3387106a327170d875b0601598d8ca80ad95da811b90fe36";
        const sender = "0x14d260dcb7c543d289527B8855fb9850390565d2";
        const receiver = searchResult[0].address;
        web3.eth
          .getBalance(sender)
          .then((currBal) => {
            if (parseInt(currBal) < parseInt(amt)) {
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
                value: amt,
                gas: 30000,
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
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }); //end of connection.query()
  }); //end of db.connection()
}); //end of app.post()
//use referral bonus winnings

server.listen(port, () => console.log(`Server Started on port ${port}...`));
