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
const mainWallet = "0x14d260dcb7c543d289527B8855fb9850390565d2";
const mainPrivateKey =
  "bffb9004264cb1be3387106a327170d875b0601598d8ca80ad95da811b90fe36";
require("dotenv").config();
app.use(cors());
app.use(express.json());
// connection details
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

//connect socket ***
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
//CREATE USER ***
app.post("/createUser", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const wallet = await web3.eth.accounts.create();
  const bscwallet = await web3_bsc.eth.accounts.create();
  const ethAddress = wallet.address;
  const ethPrivateKey = wallet.privateKey;
  const bscAddress = bscwallet.address;
  const bscPrivateKey = bscwallet.privateKey;
  const referredById =
    req.body.referredById != undefined ? req.body.referredById : 0;
  const points = req.body.points != undefined ? req.body.points : 0;
  const usedReferralBonus = 0;
  const usedVipBonus = 0;
  const totalBetAmt = 0.0;
  const depositAmtEth = 0.0;
  const winAmtEth = 0.0;
  const lossAmtEth = 0.0;
  const availableBalanceEth = 0.0;
  const depositAmtBsc = 0.0;
  const winAmtBsc = 0.0;
  const lossAmtBsc = 0.0;
  const availableBalanceBsc = 0.0;
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "SELECT * FROM user_table WHERE email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    const sqlInsert =
      "INSERT INTO user_table VALUES (0,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const insert_query = mysql.format(sqlInsert, [
      username,
      email,
      hashedPassword,
      ethAddress,
      bscAddress,
      ethPrivateKey,
      bscPrivateKey,
      referredById,
      points,
      usedReferralBonus,
      usedVipBonus,
      totalBetAmt,
      depositAmtEth,
      winAmtEth,
      lossAmtEth,
      availableBalanceEth,
      depositAmtBsc,
      winAmtBsc,
      lossAmtBsc,
      availableBalanceBsc,
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
            connection.release();
            if (err) throw err;
            console.log("------> Search Results");
            console.log(result.length);
            if (result.length != 0) {
              console.log("---------> Generating accessToken");
              const token = generateAccessToken({
                email: email,
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

//generateAccessToken function ***
function generateAccessToken(email) {
  return jwt.sign(email, "secret", {});
}

//LOGIN (AUTHENTICATE USER, and return accessToken) ***
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
          const token = generateAccessToken({
            email: email,
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

app.post("/getUserData", (req, res) => {
  const email = req.body.email;
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
        res.json(result[0]);
      } //end of User exists
    }); //end of connection.query()
  }); //end of db.connection()
}); //end of app.post()

//Check to make sure header is not undefined, if so, return Forbidden (403)***
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
//This is a protected route***
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

//Place bet ***
app.post("/bet", async (req, res) => {
  const username = req.body.username;
  const betTime = req.body.betTime;
  const betAmt = parseFloat(req.body.betAmt);
  const multiplier = req.body.multiplier;
  const result = req.body.result;
  const payout = req.body.payout;
  const betResult = req.body.betResult; // true:win false:lose
  const chain = req.body.chain;
  const email = req.body.email;
  const profitAmt = parseFloat(req.body.profitAmt);
  const totalBetAmt = parseFloat(req.body.totalBetAmt);
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from user_table where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    const sqlInsert = "INSERT INTO betstable VALUES (0,?,?,?,?,?,?,?,?,?)";
    const insert_query = mysql.format(sqlInsert, [
      username,
      betTime,
      betAmt,
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
          const sqlUpdateUserWin =
            "UPDATE user_table SET totalBetAmt = ? , winAmtEth = ? , availableBalanceEth = ? WHERE email = ?";
          const update_query_win = mysql.format(sqlUpdateUserWin, [
            totalBetAmt,
            profitAmt,
            result[0].depositAmtEth + profitAmt - result[0].lossAmtEth,
          ]);
          const sqlUpdateUserLoss =
            "UPDATE user_table SET totalBetAmt = ? , lossAmtEth = ? , availableBalanceEth = ? WHERE email = ?";
          const update_query_loss = mysql.format(sqlUpdateUserLoss, [
            totalBetAmt,
            betAmt,
            result[0].depositAmtEth + result[0].winAmtEth - betAmt,
          ]);
          if (betResult == true) {
            //Store bet details
            await connection.query(update_query_win, async (err, result) => {
              if (err) throw err;
              console.log("--------> added bet data eth win");
              console.log(result.insertId);
              res.sendStatus(201);
            }); //end of bet details connection.query()
          } else {
            //Store bet details
            await connection.query(update_query_loss, async (err, result) => {
              if (err) throw err;
              console.log("--------> added bet data eth loss");
              console.log(result.insertId);
              res.sendStatus(201);
            }); //end of bet details connection.query()
          }
        } else {
          const sqlUpdateUserWin =
            "UPDATE user_table SET totalBetAmt = ? , winAmtBsc = ? , availableBalanceBsc = ? WHERE email = ?";
          const update_query_win = mysql.format(sqlUpdateUserWin, [
            totalBetAmt,
            profitAmt,
            result[0].depositAmtBsc + profitAmt - result[0].lossAmtBsc,
          ]);
          const sqlUpdateUserLoss =
            "UPDATE user_table SET totalBetAmt = ? , lossAmtBsc = ? , availableBalanceBsc = ? WHERE email = ?";
          const update_query_loss = mysql.format(sqlUpdateUserLoss, [
            totalBetAmt,
            betAmt,
            result[0].depositAmtBsc + result[0].winAmtBsc - betAmt,
          ]);
          if (betResult == true) {
            //Store bet details
            await connection.query(update_query_win, async (err, result) => {
              if (err) throw err;
              console.log("--------> added bet data bsc win");
              console.log(result.insertId);
              res.sendStatus(201);
            }); //end of bet details connection.query()
          } else {
            //Store bet details
            await connection.query(update_query_loss, async (err, result) => {
              if (err) throw err;
              console.log("--------> added bet data bsc loss");
              console.log(result.insertId);
              res.sendStatus(201);
            }); //end of bet details connection.query()
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

//Withdraw winnings ***
app.post("/withdraw", async (req, res) => {
  const email = req.body.email;
  const chain = req.body.chain;
  const receiver = req.body.receiver;
  const withdrawAmt = req.body.amt;
  const withdrawAmtWei = await web3.utils.toWei(String(req.body.amt));
  const txFeeEth = (await web3.eth.getGasPrice()) * 21000;
  const txFeeBsc = (await web3_bsc.eth.getGasPrice()) * 21000;
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from user_table where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    await connection.query(search_query, async (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        console.log("--------> User does not exist");
        res.sendStatus(404);
      } else {
        if (chain == "eth") {
          //available balance less than deposit
          if (result[0].availableBalanceEth < result[0].depositAmtEth) {
            const toMainAccAmt =
              result[0].depositAmtEth - result[0].availableBalanceEth;
            const toMainAccAmtWei = await web3.utils.toWei(
              String(result[0].depositAmtEth - result[0].availableBalanceEth)
            );
            const remainingAmt = result[0].depositAmtEth - toMainAccAmt;
            const privateKey = result[0].ethPrivateKey;
            const sender = result[0].ethAddress;
            const sqlUpdateEth =
              "UPDATE user_table SET winAmtEth = ? , lossAmtEth = ? , depositAmtEth = ? , availableBalanceEth = ? WHERE email = ?";
            const update_query_eth = mysql.format(sqlUpdateEth, [
              0,
              0,
              remainingAmt,
              remainingAmt,
              email,
            ]);
            //1.) transfer (depositAmt - availableBalance) to main acc.
            web3.eth.accounts
              .signTransaction(
                {
                  to: mainWallet,
                  value: toMainAccAmtWei,
                  gas: 21000,
                },
                privateKey
              )
              .then((signedTx) => {
                console.log(signedTx);
                return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
              })
              .then((hash) => {
                console.log(hash);
              })
              .catch((err) => {
                console.log(err);
                res.json(err);
              });
            //2.) set win = 0 , loss = 0 , deposit = remainingAmt , availableBalance = remainingAmt
            await connection.query(update_query_eth, async (err, result) => {
              if (err) throw err;
              //3.) transfer withdraw amt to receiver acc.
              web3.eth
                .getBalance(sender)
                .then((currBal) => {
                  if (currBal < withdrawAmtWei + txFeeEth) {
                    //withdrawing max amt.
                    return web3.eth.accounts.signTransaction(
                      {
                        to: receiver,
                        value: withdrawAmtWei - txFeeEth,
                        gas: 21000,
                      },
                      privateKey
                    );
                  } else {
                    //send ether
                    return web3.eth.accounts.signTransaction(
                      {
                        to: receiver,
                        value: withdrawAmtWei,
                        gas: 21000,
                      },
                      privateKey
                    );
                  }
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
                  res.json(err);
                });
              // 4.) update depositAmt=remainingBal-withdrawAmt , availableBalance=remainingBal-withdrawAmt
              const sqlWithdrawEth =
                "UPDATE user_table SET depositAmtEth = ? , availableBalanceEth = ? WHERE email = ?";
              const withdraw_query_eth = mysql.format(sqlWithdrawEth, [
                remainingAmt - withdrawAmt,
                remainingAmt - withdrawAmt,
                email,
              ]);
              await connection.query(
                withdraw_query_eth,
                async (err, result) => {
                  connection.release();
                  if (err) throw err;
                  res.json(result);
                }
              );
            });
          } //available balance greater than deposit
          else {
            //withdraw amt. greater than deposit
            if (withdrawAmt > result[0].depositAmtEth) {
              const fromMainAccAmt =
                parseFloat(withdrawAmt) - result[0].depositAmtEth;
              const fromMainAccAmtWei = await web3.utils.toWei(
                String(parseFloat(withdrawAmt) - result[0].depositAmtEth)
              );
              const privateKey = result[0].ethPrivateKey;
              const sender = result[0].ethAddress;
              const sqlUpdateEth =
                "UPDATE user_table SET winAmtEth = ? , depositAmtEth = ? , availableBalanceEth = ? WHERE email = ?";
              const update_query_eth = mysql.format(sqlUpdateEth, [
                result[0].winAmtEth - fromMainAccAmt,
                0,
                result[0].winAmtEth - fromMainAccAmt - result[0].lossAmtEth,
                email,
              ]);
              //1.) transfer depositAmt to receiver acc.
              web3.eth
                .getBalance(sender)
                .then((currBal) => {
                  //withdrawing max amt.
                  return web3.eth.accounts.signTransaction(
                    {
                      to: receiver,
                      value: currBal - txFeeEth,
                      gas: 21000,
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
                  res.json(err);
                });

              //2.) transfer (withdraw Amt. - depositAmt) from main to receiver acc.
              web3.eth.accounts
                .signTransaction(
                  {
                    to: receiver,
                    value: fromMainAccAmtWei - txFeeEth,
                    gas: 21000,
                  },
                  mainPrivateKey
                )
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
                  res.json(err);
                });
              //3.) update deposit=0 , win = dep + win - withdrawAmt and availableBalance
              await connection.query(update_query_eth, async (err, result) => {
                connection.release();
                if (err) throw err;
                console.log("--------> updated after withdraw > deposit eth");
                console.log(result.insertId);
                res.sendStatus(201);
              });
            } //withdraw amt. less than deposit
            else {
              const privateKey = result[0].ethPrivateKey;
              const sender = result[0].ethAddress;
              const sqlUpdateEth =
                "UPDATE user_table SET depositAmtEth = ? , availableBalanceEth = ? WHERE email = ?";
              const update_query_eth = mysql.format(sqlUpdateEth, [
                result[0].depositAmtEth - withdrawAmt,
                result[0].depositAmtEth -
                  withdrawAmt +
                  result[0].winAmtEth -
                  result[0].lossAmtEth,
                email,
              ]);
              //1.) transfer depositAmt to receiver acc.
              web3.eth
                .getBalance(sender)
                .then((currBal) => {
                  if (currBal < withdrawAmtWei + txFeeEth) {
                    //withdrawing max amt.
                    return web3.eth.accounts.signTransaction(
                      {
                        to: receiver,
                        value: withdrawAmtWei - txFeeEth,
                        gas: 21000,
                      },
                      privateKey
                    );
                  } else {
                    return web3.eth.accounts.signTransaction(
                      {
                        to: receiver,
                        value: withdrawAmtWei,
                        gas: 21000,
                      },
                      privateKey
                    );
                  }
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
                  res.json(err);
                });
              //2.) update deposit= deposit - withdrawAmt and availableBalance
              await connection.query(update_query_eth, async (err, result) => {
                connection.release();
                if (err) throw err;
                console.log("--------> updated after withdraw < deposit eth");
                console.log(result.insertId);
                res.sendStatus(201);
              });
            }
          }
        } else {
          //BSC
          if (result[0].availableBalanceBsc < result[0].depositAmtBsc) {
            const toMainAccAmt =
              result[0].depositBsc - result[0].availableBalanceBsc;
            const toMainAccAmtWei = await web3_bsc.utils.toWei(
              result[0].depositBsc - result[0].availableBalanceBsc
            );
            const remainingAmt = result[0].depositBsc - toMainAccAmt;
            const privateKey = result[0].bscPrivateKey;
            const sender = result[0].bscAddress;
            const sqlUpdateBsc =
              "UPDATE user_table SET winAmtBsc = ? , lossAmtBsc = ? , depositAmtBsc = ? , availableBalanceBsc = ? WHERE email = ?";
            const update_query_bsc = mysql.format(sqlUpdateBsc, [
              0,
              0,
              remainingAmt,
              remainingAmt,
              email,
            ]);
            //1.) transfer (depositAmt - availableBalance) to main acc.
            web3_bsc.eth.accounts
              .signTransaction(
                {
                  to: mainWallet,
                  value: toMainAccAmtWei,
                  gas: 21000,
                },
                privateKey
              )
              .then((signedTx) => {
                console.log(signedTx);
                return web3_bsc.eth.sendSignedTransaction(
                  signedTx.rawTransaction
                );
              })
              .then((hash) => {
                console.log(hash);
              })
              .catch((err) => {
                console.log(err);
                res.json(err);
              });
            //2.) set win = 0 , loss = 0 , deposit = remainingAmt , availableBalance = remainingAmt
            await connection.query(update_query_bsc, async (err, result) => {
              if (err) throw err;
              //3.) transfer withdraw amt to receiver acc.
              web3_bsc.eth
                .getBalance(sender)
                .then((currBal) => {
                  if (currBal < withdrawAmtWei + txFeeBsc) {
                    //withdrawing max amt.
                    return web3_bsc.eth.accounts.signTransaction(
                      {
                        to: receiver,
                        value: withdrawAmtWei - txFeeBsc,
                        gas: 21000,
                      },
                      privateKey
                    );
                  } else {
                    //send ether
                    return web3_bsc.eth.accounts.signTransaction(
                      {
                        to: receiver,
                        value: withdrawAmtWei,
                        gas: 21000,
                      },
                      privateKey
                    );
                  }
                })
                .then((signedTx) => {
                  console.log(signedTx);
                  return web3_bsc.eth.sendSignedTransaction(
                    signedTx.rawTransaction
                  );
                })
                .then((hash) => {
                  console.log(hash);
                })
                .catch((err) => {
                  console.log(err);
                  res.json(err);
                });
              // 4.) update depositAmt=remainingBal-withdrawAmt , availableBalance=remainingBal-withdrawAmt
              const sqlWithdrawBsc =
                "UPDATE user_table SET depositAmtBsc = ? , availableBalanceBsc = ? WHERE email = ?";
              const withdraw_query_bsc = mysql.format(sqlWithdrawBsc, [
                remainingAmt - withdrawAmt,
                remainingAmt - withdrawAmt,
                email,
              ]);
              await connection.query(
                withdraw_query_bsc,
                async (err, result) => {
                  connection.release();
                  if (err) throw err;
                  res.json(result);
                }
              );
            });
          } else {
            //withdraw amt. greater than deposit
            if (withdrawAmt > result[0].depositAmtBsc) {
              const fromMainAccAmt =
                parseFloat(withdrawAmt) - result[0].depositAmtBsc;
              const fromMainAccAmtWei = await web3_bsc.utils.toWei(
                String(parseFloat(withdrawAmt) - result[0].depositAmtBsc)
              );
              const privateKey = result[0].bscPrivateKey;
              const sender = result[0].bscAddress;
              const sqlUpdateBsc =
                "UPDATE user_table SET winAmtBsc = ? , depositAmtBsc = ? , availableBalanceBsc = ? WHERE email = ?";
              const update_query_bsc = mysql.format(sqlUpdateBsc, [
                result[0].winAmtBsc - fromMainAccAmt,
                0,
                result[0].winAmtBsc - fromMainAccAmt - result[0].lossAmtBsc,
                email,
              ]);
              //1.) transfer depositAmt to receiver acc.
              web3_bsc.eth
                .getBalance(sender)
                .then((currBal) => {
                  //withdrawing max amt.
                  return web3_bsc.eth.accounts.signTransaction(
                    {
                      to: receiver,
                      value: currBal - txFeeBsc,
                      gas: 21000,
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
                })
                .catch((err) => {
                  console.log(err);
                  res.json(err);
                });

              //2.) transfer (withdraw Amt. - depositAmt) from main to receiver acc.
              web3_bsc.eth.accounts
                .signTransaction(
                  {
                    to: receiver,
                    value: fromMainAccAmtWei - txFeeBsc,
                    gas: 21000,
                  },
                  privateKey
                )
                .then((signedTx) => {
                  console.log(signedTx);
                  return web3_bsc.eth.sendSignedTransaction(
                    signedTx.rawTransaction
                  );
                })
                .then((hash) => {
                  console.log(hash);
                })
                .catch((err) => {
                  console.log(err);
                  res.json(err);
                });
              //3.) update deposit=0 , win = dep + win - withdrawAmt and availableBalance
              await connection.query(update_query_bsc, async (err, result) => {
                connection.release();
                if (err) throw err;
                console.log("--------> updated after withdraw > deposit bsc");
                console.log(result.insertId);
                res.sendStatus(201);
              });
            } //withdraw amt. less than deposit
            else {
              const privateKey = result[0].bscPrivateKey;
              const sender = result[0].bscAddress;
              const sqlUpdateBsc =
                "UPDATE user_table SET depositAmtBsc = ? , availableBalanceBsc = ? WHERE email = ?";
              const update_query_bsc = mysql.format(sqlUpdateBsc, [
                result[0].depositAmtBsc - withdrawAmt,
                result[0].depositAmtBsc -
                  withdrawAmt +
                  result[0].winAmtBsc -
                  result[0].lossAmtBsc,
                email,
              ]);
              //1.) transfer depositAmt to receiver acc.
              web3_bsc.eth
                .getBalance(sender)
                .then((currBal) => {
                  if (currBal < withdrawAmtWei + txFeeBsc) {
                    //withdrawing max amt.
                    return web3_bsc.eth.accounts.signTransaction(
                      {
                        to: receiver,
                        value: withdrawAmtWei - txFeeBsc,
                        gas: 21000,
                      },
                      privateKey
                    );
                  } else {
                    return web3_bsc.eth.accounts.signTransaction(
                      {
                        to: receiver,
                        value: withdrawAmtWei,
                        gas: 21000,
                      },
                      privateKey
                    );
                  }
                })
                .then((signedTx) => {
                  console.log(signedTx);
                  return web3_bsc.eth.sendSignedTransaction(
                    signedTx.rawTransaction
                  );
                })
                .then((hash) => {
                  console.log(hash);
                })
                .catch((err) => {
                  console.log(err);
                  res.json(err);
                });
              //2.) update deposit= deposit - withdrawAmt and availableBalance
              await connection.query(update_query_bsc, async (err, result) => {
                connection.release();
                if (err) throw err;
                console.log("--------> updated after withdraw < deposit bsc");
                console.log(result.insertId);
                res.sendStatus(201);
              });
            }
          }
        }
      } //end of User exists
    }); //end of connection.query()
  }); //end of db.connection()
}); //end of app.post()
//withdraw winnings
//Store bet details

//live bets ***
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

//my bets ***
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

//get total bet ***
app.post("/getTotalBet", (req, res) => {
  const email = req.body.email;
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from user_table where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    await connection.query(search_query, async (err, result) => {
      connection.release();
      if (err) throw err;
      else res.json(result);
    }); //end of connection.query()
  }); //end of db.connection()
}); //end of app.post()

//use referral bonus winnings ***
app.post("/referralBonus", async (req, res) => {
  const email = req.body.email;
  const amt = req.body.amt;
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from user_table where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    await connection.query(search_query, async (err, searchResult) => {
      if (err) throw err;
      if (searchResult.length == 0) {
        connection.release();
        console.log("--------> User does not exist");
        res.sendStatus(404);
      } else {
        if (
          !searchResult[0].usedReferralBonus &&
          searchResult.referredById &&
          searchResult.referredById != 0
        ) {
          const sqlSearchRefer = "Select * from user_table where id = ?";
          const search_query_refer = mysql.format(sqlSearchRefer, [
            searchResult.referredById,
          ]);
          const updateWinAmtEth =
            "UPDATE user_table SET usedReferralBonus = ? , winAmtEth = ? , availableBalanceEth = ? WHERE email = ?";
          const update_query = mysql.format(updateWinAmtEth, [
            1,
            searchResult[0].winAmtEth + amt,
            searchResult[0].depositAmtEth +
              searchResult[0].winAmtEth +
              amt -
              searchResult[0].lossAmtEth,
            email,
          ]);
          await connection.query(update_query, async (err, result) => {
            if (err) throw err;
            console.log("--------> updated after adding referral bonus eth");
            console.log(result.insertId);
            res.sendStatus(201);
          });
          await connection.query(
            search_query_refer,
            async (err, referResult) => {
              if (err) throw err;
              if (referResult.length == 0) {
                connection.release();
                console.log("Referred person doesn't exist!");
                res.json({
                  message: "noReferral",
                });
              } else {
                const updateWinAmtEthRef =
                  "UPDATE user_table SET winAmtEth = ? , availableBalanceEth = ? WHERE email = ?";
                const update_query_ref = mysql.format(updateWinAmtEthRef, [
                  referResult[0].winAmtEth + amt,
                  referResult[0].depositAmtEth +
                    referResult[0].winAmtEth +
                    amt -
                    referResult[0].lossAmtEth,
                  email,
                ]);
                await connection.query(
                  update_query_ref,
                  async (err, result) => {
                    connection.release();
                    if (err) throw err;
                    console.log(
                      "--------> updated after adding referral bonus to referrer"
                    );
                    console.log(result.insertId);
                    res.sendStatus(201);
                  }
                );
              }
            }
          );
        } else {
          res.sendStatus(404);
        }
      } //end of User exists
    }); //end of connection.query()
  }); //end of db.connection()
}); //end of app.post()
//use referral bonus winnings

//use vip bonus winnings ***
app.post("/vipLevelUp", async (req, res) => {
  const email = req.body.email;
  const amt = await web3.utils.toWei(String(req.body.amt));
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from user_table where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    await connection.query(search_query, async (err, searchResult) => {
      if (err) throw err;
      if (searchResult.length == 0) {
        connection.release();
        console.log("--------> User does not exist");
        res.sendStatus(404);
      } else {
        const updateWinAmtEth =
          "UPDATE user_table SET usedVipBonus = ? , winAmtEth = ? , availableBalanceEth = ? WHERE email = ?";
        const update_query = mysql.format(updateWinAmtEth, [
          parseInt(searchResult[0].usedVipBonus) + 1,
          searchResult[0].winAmtEth + amt,
          searchResult[0].depositAmtEth +
            searchResult[0].winAmtEth +
            amt -
            searchResult[0].lossAmtEth,
          email,
        ]);
        await connection.query(update_query, async (err, result) => {
          if (err) throw err;
          console.log(
            `--------> updated after adding vip lvl ${
              parseInt(searchResult[0].usedVipBonus) + 1
            } bonus eth`
          );
          console.log(result.insertId);
          res.sendStatus(201);
        });
      }
    }); //end of connection.query()
  }); //end of db.connection()
}); //end of app.post()
//use vip bonus winnings

server.listen(port, () => console.log(`Server Started on port ${port}...`));
