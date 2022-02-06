const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const mysql = require("mysql");
const fetch = require("node-fetch");

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});
//web3
// ether api key : XTZCENR92PIG64NUGCDGPDCBJSNTIPQ9W6
// bsc api key : DCKX4BYY4Z15NRWM4ABD5556CYM7PBP7NY
// polygon api key : C3VF6A6Q93Z3PXM27YB7KJZKBYVXCEI9MI

const Web3 = require("web3");
let web3 = new Web3(
  "https://speedy-nodes-nyc.moralis.io/44bc1ff84c8edc2499fd1db9/eth/rinkeby"
);
let web3_bsc = new Web3(
  "https://speedy-nodes-nyc.moralis.io/44bc1ff84c8edc2499fd1db9/bsc/testnet"
);
let web3_poly = new Web3(
  "https://speedy-nodes-nyc.moralis.io/44bc1ff84c8edc2499fd1db9/polygon/mumbai"
);
const mainWallet = "0x14d260dcb7c543d289527B8855fb9850390565d2";
const mainPrivateKey =
  "bffb9004264cb1be3387106a327170d875b0601598d8ca80ad95da811b90fe36";

require("dotenv").config();
app.use(cors());
app.use(express.json());
// connection details
const db = mysql.createPool({
  connectionLimit: 8,
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

function update_query_eth(depositAmt, availableBalance, address) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlUpdate =
      "UPDATE user_table SET depositAmtEth = ? , availableBalanceEth = ? WHERE ethAddress = ?";
    const update_query = mysql.format(sqlUpdate, [
      depositAmt,
      availableBalance,
      address,
    ]);
    await connection.query(update_query, async (err, update_result) => {
      connection.release();
      if (err) throw err;
      console.log("updates eth : ", update_result);
    });
  });
}
function update_query_bsc(depositAmt, availableBalance, address, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlUpdate =
      "UPDATE user_table SET depositAmtBsc = ? , availableBalanceBsc = ? WHERE bscAddress = ?";
    const update_query = mysql.format(sqlUpdate, [
      depositAmt,
      availableBalance,
      address,
    ]);
    await connection.query(update_query, async (err, update_result) => {
      connection.release();
      if (err) throw err;
      console.log("updates bsc : ", update_result);
    });
  });
}
function update_query_poly(depositAmt, availableBalance, address, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlUpdate =
      "UPDATE user_table SET depositAmtPoly = ? , availableBalancePoly = ? WHERE polyAddress = ?";
    const update_query = mysql.format(sqlUpdate, [
      depositAmt,
      availableBalance,
      address,
    ]);
    await connection.query(update_query, async (err, update_result) => {
      connection.release();
      if (err) throw err;
      console.log("updates poly : ", update_result);
    });
  });
}
function search_query_address_eth(balances, currAddBal, k) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "SELECT * FROM user_table WHERE ethAddress = ?";
    const search_query_address = mysql.format(sqlSearch, [
      balances.result[k].account,
    ]);

    await connection.query(
      search_query_address,
      async (err, search_add_result) => {
        connection.release();
        if (err) throw err;
        console.log("eth search data : ", search_add_result);
        update_query_eth(
          parseFloat(currAddBal),
          parseFloat(currAddBal) +
            search_add_result[0].winAmtEth -
            search_add_result[0].lossAmtEth,
          balances.result[k].account
        );
      }
    );
  });
}
function search_query_address_bsc(balancesBsc, currAddBal, k, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "SELECT * FROM user_table WHERE bscAddress = ?";
    const search_query_address = mysql.format(sqlSearch, [
      balancesBsc.result[k].account,
    ]);

    await connection.query(
      search_query_address,
      async (err, search_add_result) => {
        connection.release();
        if (err) throw err;
        console.log("bsc search data : ", search_add_result);
        update_query_bsc(
          parseFloat(currAddBal),
          parseFloat(currAddBal) +
            search_add_result[0].winAmtBsc -
            search_add_result[0].lossAmtBsc,
          balancesBsc.result[k].account,
          res
        );
      }
    );
  });
}
function search_query_address_poly(balancesPoly, currAddBal, k, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "SELECT * FROM user_table WHERE polyAddress = ?";
    const search_query_address = mysql.format(sqlSearch, [
      balancesPoly.result[k].account,
    ]);

    await connection.query(
      search_query_address,
      async (err, search_add_result) => {
        connection.release();
        if (err) throw err;
        console.log("poly search data : ", search_add_result);
        update_query_poly(
          parseFloat(currAddBal),
          parseFloat(currAddBal) +
            search_add_result[0].winAmtPoly -
            search_add_result[0].lossAmtPoly,
          balancesPoly.result[k].account,
          res
        );
      }
    );
  });
}
//middleware to read req.body.<params>
//update balance ***
app.post("/updateBalance", async (req, res) => {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const search_query = "SELECT * FROM user_table";
    await connection.query(search_query, async (err, result) => {
      connection.release();
      if (err) throw err;
      console.log("user search data : ", result);
      if (result.length != 0) {
        const calls = parseInt((result.length - 1) / 20);
        for (let i = 0; i < calls + 1; i++) {
          console.log("i : ", i);
          console.log("calls : ", calls);
          //mainnet
          // var urlEth = `https://api.etherscan.io/api?module=account&action=balancemulti&address=`;
          // var urlEthTag = `&tag=latest&apikey=XTZCENR92PIG64NUGCDGPDCBJSNTIPQ9W6`;
          // var urlBsc = `https://api.bscscan.com/api?module=account&action=balancemulti&address=`;
          // var urlBscTag = `&tag=latest&apikey=DCKX4BYY4Z15NRWM4ABD5556CYM7PBP7NY`;
          // var urlPoly = `https://api.polygonscan.com/api?module=account&action=balancemulti&address=`;
          // var urlPolyTag = `&tag=latest&apikey=C3VF6A6Q93Z3PXM27YB7KJZKBYVXCEI9MI`;

          //testnet
          var urlEth = `https://api-rinkeby.etherscan.io/api?module=account&action=balancemulti&address=`;
          var urlEthTag = `&tag=latest&apikey=XTZCENR92PIG64NUGCDGPDCBJSNTIPQ9W6`;
          var urlBscTag = `&tag=latest&apikey=DCKX4BYY4Z15NRWM4ABD5556CYM7PBP7NY`;
          var urlBsc = `https://api-testnet.bscscan.com/api?module=account&action=balancemulti&address=`;
          var urlPoly = `https://api-testnet.polygonscan.com/api?module=account&action=balancemulti&address=`;
          var urlPolyTag = `&tag=latest&apikey=C3VF6A6Q93Z3PXM27YB7KJZKBYVXCEI9MI`;

          var currArrEth = [];
          var currArrBsc = [];
          var currArrPoly = [];
          //last call
          if (calls == i) {
            currArrEth = result.map((user, index) => {
              if (index >= 20 * i) return user.ethAddress;
            });
            currArrBsc = result.map((user, index) => {
              if (index >= 20 * i) return user.bscAddress;
            });
            currArrPoly = result.map((user, index) => {
              if (index >= 20 * i) return user.polyAddress;
            });
          } else {
            currArrEth = result.map((user, index) => {
              if (index >= 20 * i && index < 20 * (i + 1))
                return user.ethAddress;
            });
            currArrBsc = result.map((user, index) => {
              if (index >= 20 * i && index < 20 * (i + 1))
                return user.bscAddress;
            });
            currArrPoly = result.map((user, index) => {
              if (index >= 20 * i && index < 20 * (i + 1))
                return user.polyAddress;
            });
          }
          urlEth = urlEth + currArrEth[0];
          urlBsc = urlBsc + currArrBsc[0];
          urlPoly = urlPoly + currArrPoly[0];
          for (let j = 1; j < currArrEth.length; j++) {
            urlEth = urlEth + "," + currArrEth[j];
          }
          for (let j = 1; j < currArrBsc.length; j++) {
            urlBsc = urlBsc + "," + currArrBsc[j];
          }
          for (let j = 1; j < currArrPoly.length; j++) {
            urlPoly = urlPoly + "," + currArrPoly[j];
          }
          console.log("eth fetch url : ", urlEth + urlEthTag);
          console.log("bsc fetch url : ", urlBsc + urlBscTag);
          console.log("poly fetch url : ", urlPoly + urlPolyTag);
          fetch(urlEth + urlEthTag)
            .then((res) => {
              //eth
              return res.json();
            })
            .then(async (balances) => {
              //eth
              console.log("eth data : ", balances);
              if (balances["status"] == "1") {
                for (let k = 0; k < balances.result.length; k++) {
                  const currAddBal = await web3.utils.fromWei(
                    balances.result[k].balance
                  );
                  search_query_address_eth(balances, currAddBal, k);
                }
              }
            })
            .then(() => {
              return fetch(urlBsc + urlBscTag);
            })
            .then((res) => {
              //eth
              return res.json();
            })
            .then(async (balancesBsc) => {
              //bsc
              console.log("bsc data : ", balancesBsc);
              if (balancesBsc["status"] == "1") {
                for (let k = 0; k < balancesBsc.result.length; k++) {
                  const currAddBal = await web3_bsc.utils.fromWei(
                    balancesBsc.result[k].balance
                  );
                  search_query_address_bsc(balancesBsc, currAddBal, k, res);
                }
              }
            })
            .then(() => {
              return fetch(urlPoly + urlPolyTag);
            })
            .then((res) => {
              //eth
              return res.json();
            })
            .then(async (balancesPoly) => {
              //bsc
              console.log("poly data : ", balancesPoly);
              if (balancesPoly["status"] == "1") {
                for (let k = 0; k < balancesPoly.result.length; k++) {
                  const currAddBal = await web3_poly.utils.fromWei(
                    balancesPoly.result[k].balance
                  );
                  search_query_address_poly(balancesPoly, currAddBal, k, res);
                }
              }
            })
            .catch((err) => console.log(err));
        }
      }
    }); //end of connection.query()
  }); //end of db.getConnection()
}); //end of app.post()

//middleware to read req.body.<params>
//CREATE USER ***

function search_user(email, res) {
  db.getConnection(async (err, connection) => {
    const sqlSearch = "SELECT * FROM user_table WHERE email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    if (err) throw err;
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
        res.sendStatus(201);
      }
    });
  }); //end of db.getConnection()
}
function insert_user(values, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlInsert =
      "INSERT INTO user_table VALUES (0,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const insert_query = mysql.format(sqlInsert, [
      values[0],
      values[1],
      values[2],
      values[3],
      values[4],
      values[5],
      values[6],
      values[7],
      values[8],
      values[9],
      values[10],
      values[11],
      values[12],
      values[13],
      values[14],
      values[15],
      values[16],
      values[17],
      values[18],
      values[19],
      values[20],
      values[21],
      values[22],
    ]);
    const email = values[1];
    // ? will be replaced by values
    // ?? will be replaced by string
    await connection.query(insert_query, async (err, insertResult) => {
      connection.release();
      if (err) throw err;
      console.log("--------> Created new User");
      console.log(insertResult.insertId);
      search_user(email, res);
    });
  }); //end of db.getConnection()
}
function insert_address(
  email,
  ethAddress,
  ethPrivatekey,
  bscAddress,
  bscPrivatekey,
  polyAddress,
  polyPrivateKey,
  res
) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlInsert = "INSERT INTO address_table VALUES (?,?,?,?,?)";
    const insert_query = mysql.format(sqlInsert, [
      email,
      ethAddress,
      ethPrivatekey,
      bscAddress,
      bscPrivatekey,
      polyAddress,
      polyPrivateKey,
    ]);
    // ? will be replaced by values
    // ?? will be replaced by string
    await connection.query(insert_query, async (err, insertResult) => {
      connection.release();
      if (err) throw err;
      console.log("--------> Inserted new User address");
      console.log(insertResult.insertId);
    });
  }); //end of db.getConnection()
}

app.post("/createUser", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const wallet = await web3.eth.accounts.create();
  const bscwallet = await web3_bsc.eth.accounts.create();
  const polywallet = await web3_poly.eth.accounts.create();
  const ethAddress = wallet.address;
  const ethPrivateKey = wallet.privateKey;
  const bscAddress = bscwallet.address;
  const bscPrivateKey = bscwallet.privateKey;
  const polyAddress = polywallet.address;
  const polyPrivateKey = polywallet.privateKey;
  const referredById =
    req.body.referredById != undefined ? req.body.referredById : 0;
  const points = req.body.points != undefined ? req.body.points : 0;
  const usedReferralBonus =
    req.body.referredById != undefined && req.body.referredById != 0 ? 0 : 1;
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
  const depositAmtPoly = 0.0;
  const winAmtPoly = 0.0;
  const lossAmtPoly = 0.0;
  const availableBalancePoly = 0.0;
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "SELECT * FROM user_table WHERE email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    // ? will be replaced by values
    // ?? will be replaced by string
    await connection.query(search_query, async (err, result) => {
      connection.release();
      if (err) throw err;
      console.log("------> Search Results");
      console.log(result.length);
      if (result.length != 0) {
        console.log("------> User already exists");
        res.sendStatus(409);
      } else {
        insert_user(
          [
            username,
            email,
            hashedPassword,
            ethAddress,
            bscAddress,
            polyAddress,
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
            depositAmtPoly,
            winAmtPoly,
            lossAmtPoly,
            availableBalancePoly,
          ],
          res
        );
        insert_address(
          email,
          ethAddress,
          ethPrivateKey,
          bscAddress,
          bscPrivateKey,
          polyAddress,
          polyPrivateKey,
          res
        );
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
  }); //end of db.getConnection()
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
  }); //end of db.getConnection()
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

function update_user_bet(
  chain,
  totalBetAmt,
  result,
  email,
  betResult,
  betAmt,
  profitAmt,
  res
) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    if (chain == "eth") {
      const sqlUpdateUserWin =
        "UPDATE user_table SET totalBetAmt = ? , winAmtEth = ? , availableBalanceEth = ? WHERE email = ?";
      const update_query_win = mysql.format(sqlUpdateUserWin, [
        totalBetAmt,
        result[0].winAmtEth + profitAmt,
        result[0].availableBalanceEth + profitAmt,
        email,
      ]);
      const sqlUpdateUserLoss =
        "UPDATE user_table SET totalBetAmt = ? , lossAmtEth = ? , availableBalanceEth = ? WHERE email = ?";
      const update_query_loss = mysql.format(sqlUpdateUserLoss, [
        totalBetAmt,
        result[0].lossAmtEth + betAmt,
        result[0].availableBalanceEth - betAmt,
        email,
      ]);
      if (betResult === true) {
        //Store bet details
        await connection.query(update_query_win, async (err, result) => {
          connection.release();
          if (err) throw err;
          console.log("--------> added bet data eth win");
          console.log(result.insertId);
        }); //end of bet details connection.query()
      } else {
        //Store bet details
        await connection.query(update_query_loss, async (err, result) => {
          connection.release();
          if (err) throw err;
          console.log("--------> added bet data eth loss");
          console.log(result.insertId);
        }); //end of bet details connection.query()
      }
    } else if (chain == "poly") {
      const sqlUpdateUserWin =
        "UPDATE user_table SET totalBetAmt = ? , winAmtPoly = ? , availableBalancePoly = ? WHERE email = ?";
      const update_query_win = mysql.format(sqlUpdateUserWin, [
        totalBetAmt,
        result[0].winAmtPoly + profitAmt,
        result[0].availableBalancePoly + profitAmt,
        email,
      ]);
      const sqlUpdateUserLoss =
        "UPDATE user_table SET totalBetAmt = ? , lossAmtPoly = ? , availableBalancePoly = ? WHERE email = ?";
      const update_query_loss = mysql.format(sqlUpdateUserLoss, [
        totalBetAmt,
        result[0].lossAmtPoly + betAmt,
        result[0].availableBalancePoly - betAmt,
        email,
      ]);
      if (betResult === true) {
        //Store bet details
        await connection.query(update_query_win, async (err, result) => {
          connection.release();
          if (err) throw err;
          console.log("--------> added bet data Polygon win");
          console.log(result.insertId);
        }); //end of bet details connection.query()
      } else {
        //Store bet details
        await connection.query(update_query_loss, async (err, result) => {
          connection.release();
          if (err) throw err;
          console.log("--------> added bet data Polygon loss");
          console.log(result.insertId);
        }); //end of bet details connection.query()
      }
    } else {
      const sqlUpdateUserWin =
        "UPDATE user_table SET totalBetAmt = ? , winAmtBsc = ? , availableBalanceBsc = ? WHERE email = ?";
      const update_query_win = mysql.format(sqlUpdateUserWin, [
        totalBetAmt,
        result[0].winAmtBsc + profitAmt,
        result[0].availableBalanceBsc + profitAmt,
        email,
      ]);
      const sqlUpdateUserLoss =
        "UPDATE user_table SET totalBetAmt = ? , lossAmtBsc = ? , availableBalanceBsc = ? WHERE email = ?";
      const update_query_loss = mysql.format(sqlUpdateUserLoss, [
        totalBetAmt,
        result[0].lossAmtBsc + betAmt,
        result[0].availableBalanceBsc - betAmt,
        email,
      ]);
      if (betResult === true) {
        //Store bet details
        await connection.query(update_query_win, async (err, result) => {
          connection.release();
          if (err) throw err;
          console.log("--------> added bet data bsc win");
          console.log(result.insertId);
        }); //end of bet details connection.query()
      } else {
        //Store bet details
        await connection.query(update_query_loss, async (err, result) => {
          connection.release();
          if (err) throw err;
          console.log("--------> added bet data bsc loss");
          console.log(result.insertId);
        }); //end of bet details connection.query()
      }
    }
  }); //end of db.getConnection()
}
function insert_user_bet(
  username,
  betTime,
  betAmt,
  multiplier,
  result,
  payout,
  betResult,
  chain,
  email,
  res
) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
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
    //Store bet details
    await connection.query(insert_query, async (err, result) => {
      connection.release();
      if (err) throw err;
      console.log("--------> added bet data");
      console.log(result.insertId);
      res.sendStatus(201);
    }); //end of bet details connection.query()
  }); //end of db.getConnection()
}

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
    await connection.query(search_query, async (err, result) => {
      connection.release();
      if (err) throw err;
      if (result.length == 0) {
        console.log("--------> User does not exist");
        res.sendStatus(404);
      } else {
        update_user_bet(
          chain,
          totalBetAmt,
          result,
          email,
          betResult,
          betAmt,
          profitAmt,
          res
        );
      } //end of User exists
    }); //end of bet connection.query()
    insert_user_bet(
      username,
      betTime,
      betAmt,
      multiplier,
      result,
      payout,
      betResult,
      chain,
      email,
      res
    );
  }); //end of db.getConnection()
}); //end of app.post()
//Reward on win bet

//Withdraw winnings ***

function withdraw_b_less_d_eth(remainingAmt, withdrawAmt, email, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlWithdrawEth =
      "UPDATE user_table SET winAmtEth = ? , lossAmtEth = ? , depositAmtEth = ? , availableBalanceEth = ? WHERE email = ?";
    const withdraw_query_eth = mysql.format(sqlWithdrawEth, [
      0,
      0,
      remainingAmt - withdrawAmt,
      remainingAmt - withdrawAmt,
      email,
    ]);
    await connection.query(withdraw_query_eth, async (err, result) => {
      connection.release();
      if (err) throw err;
      res.json(result);
    });
  });
}
function withdraw_w_more_d_eth(result, fromMainAccAmt, email, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlUpdateEth =
      "UPDATE user_table SET winAmtEth = ? , depositAmtEth = ? , availableBalanceEth = ? WHERE email = ?";
    const update_query_eth = mysql.format(sqlUpdateEth, [
      result[0].winAmtEth - fromMainAccAmt,
      0,
      result[0].winAmtEth - fromMainAccAmt - result[0].lossAmtEth,
      email,
    ]);
    await connection.query(update_query_eth, async (err, result) => {
      connection.release();
      if (err) throw err;
      console.log("--------> updated after withdraw > deposit eth");
      console.log(result.insertId);
      res.sendStatus(201);
    });
  });
}
function withdraw_w_less_d_eth(result, withdrawAmt, email, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
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
    await connection.query(update_query_eth, async (err, result) => {
      connection.release();
      if (err) throw err;
      console.log("--------> updated after withdraw < deposit eth");
      console.log(result.insertId);
      res.sendStatus(201);
    });
  });
}
function withdraw_b_less_d_poly(remainingAmt, withdrawAmt, email, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlWithdrawPoly =
      "UPDATE user_table SET winAmtPoly = ? , lossAmtPoly = ? , depositAmtPoly = ? , availableBalancePoly = ? WHERE email = ?";
    const withdraw_query_poly = mysql.format(sqlWithdrawPoly, [
      0,
      0,
      remainingAmt - withdrawAmt,
      remainingAmt - withdrawAmt,
      email,
    ]);
    await connection.query(withdraw_query_poly, async (err, result) => {
      connection.release();
      if (err) throw err;
      res.json(result);
    });
  });
}
function withdraw_w_more_d_poly(result, fromMainAccAmt, email, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlUpdatePoly =
      "UPDATE user_table SET winAmtPoly = ? , depositAmtPoly = ? , availableBalancePoly = ? WHERE email = ?";
    const update_query_poly = mysql.format(sqlUpdatePoly, [
      result[0].winAmtPoly - fromMainAccAmt,
      0,
      result[0].winAmtPoly - fromMainAccAmt - result[0].lossAmtPoly,
      email,
    ]);
    await connection.query(update_query_poly, async (err, result) => {
      connection.release();
      if (err) throw err;
      console.log("--------> updated after withdraw > deposit poly");
      console.log(result.insertId);
      res.sendStatus(201);
    });
  });
}
function withdraw_w_less_d_poly(result, withdrawAmt, email, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlUpdatePoly =
      "UPDATE user_table SET depositAmtPoly = ? , availableBalancePoly = ? WHERE email = ?";
    const update_query_poly = mysql.format(sqlUpdatePoly, [
      result[0].depositAmtPoly - withdrawAmt,
      result[0].depositAmtPoly -
        withdrawAmt +
        result[0].winAmtPoly -
        result[0].lossAmtPoly,
      email,
    ]);
    await connection.query(update_query_poly, async (err, result) => {
      connection.release();
      if (err) throw err;
      console.log("--------> updated after withdraw < deposit poly");
      console.log(result.insertId);
      res.sendStatus(201);
    });
  });
}
function withdraw_b_less_d_bsc(remainingAmt, withdrawAmt, email, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlWithdrawBsc =
      "UPDATE user_table SET winAmtBsc = ? , lossAmtBsc = ? , depositAmtBsc = ? , availableBalanceBsc = ? WHERE email = ?";
    const withdraw_query_bsc = mysql.format(sqlWithdrawBsc, [
      0,
      0,
      remainingAmt - withdrawAmt,
      remainingAmt - withdrawAmt,
      email,
    ]);
    await connection.query(withdraw_query_bsc, async (err, result) => {
      connection.release();
      if (err) throw err;
      res.json(result);
    });
  });
}
function withdraw_w_more_d_bsc(result, fromMainAccAmt, email, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlUpdateBsc =
      "UPDATE user_table SET winAmtBsc = ? , depositAmtBsc = ? , availableBalanceBsc = ? WHERE email = ?";
    const update_query_bsc = mysql.format(sqlUpdateBsc, [
      result[0].winAmtBsc - fromMainAccAmt,
      0,
      result[0].winAmtBsc - fromMainAccAmt - result[0].lossAmtBsc,
      email,
    ]);
    await connection.query(update_query_bsc, async (err, result) => {
      connection.release();
      if (err) throw err;
      console.log("--------> updated after withdraw > deposit bsc");
      console.log(result.insertId);
      res.sendStatus(201);
    });
  });
}
function withdraw_w_less_d_bsc(result, withdrawAmt, email, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
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
    await connection.query(update_query_bsc, async (err, result) => {
      connection.release();
      if (err) throw err;
      console.log("--------> updated after withdraw < deposit bsc");
      console.log(result.insertId);
      res.sendStatus(201);
    });
  });
}
function get_address_key(
  result,
  withdrawAmt,
  withdrawAmtWei,
  email,
  res,
  txFeeEth,
  txFeeBsc,
  txFeePoly,
  receiver,
  chain
) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from address_table where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    await connection.query(search_query, async (err, addressResult) => {
      connection.release();
      if (err) throw err;
      if (addressResult.length == 0) {
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
            const privateKey = addressResult[0].ethPrivateKey;
            const sender = addressResult[0].ethAddress;

            //1.) transfer (depositAmt - availableBalance) to main acc.
            //2.) transfer withdraw amt to receiver acc.
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
              .then((hash) => {
                return web3.eth.getBalance(sender);
              })
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
                return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
              })
              .then((hash) => {
                console.log(hash);
              })
              .catch((err) => {
                console.log(err);
                res.json(err);
              });
            // 3.) set win = 0 , loss = 0 , depositAmt=remainingBal-withdrawAmt , availableBalance=remainingBal-withdrawAmt
            withdraw_b_less_d_eth(remainingAmt, withdrawAmt, email, res);
          } //available balance greater than deposit
          else {
            //withdraw amt. greater than deposit
            if (withdrawAmt > result[0].depositAmtEth) {
              const fromMainAccAmt =
                parseFloat(withdrawAmt) - result[0].depositAmtEth;
              const fromMainAccAmtWei = await web3.utils.toWei(
                String(parseFloat(withdrawAmt) - result[0].depositAmtEth)
              );
              const privateKey = addressResult[0].ethPrivateKey;
              const sender = addressResult[0].ethAddress;
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
              withdraw_w_more_d_eth(result, fromMainAccAmt, email, res);
            } //withdraw amt. less than deposit
            else {
              const privateKey = addressResult[0].ethPrivateKey;
              const sender = addressResult[0].ethAddress;

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
              withdraw_w_less_d_eth(result, withdrawAmt, email, res);
            }
          }
        } else if (chain == "poly") {
          //available balance less than deposit
          if (result[0].availableBalancePoly < result[0].depositAmtPoly) {
            const toMainAccAmt =
              result[0].depositAmtPoly - result[0].availableBalancePoly;
            const toMainAccAmtWei = await web3_poly.utils.toWei(
              String(result[0].depositAmtPoly - result[0].availableBalancePoly)
            );
            const remainingAmt = result[0].depositAmtPoly - toMainAccAmt;
            const privateKey = addressResult[0].polyPrivateKey;
            const sender = addressResult[0].polyAddress;
            //1.) transfer (depositAmt - availableBalance) to main acc.
            //2.) transfer withdraw amt to receiver acc.
            web3_poly.eth.accounts
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
                return web3_poly.eth.sendSignedTransaction(
                  signedTx.rawTransaction
                );
              })
              .then((hash) => {
                console.log(hash);
              })
              .then((hash) => {
                return web3_poly.eth.getBalance(sender);
              })
              .then((currBal) => {
                if (currBal < withdrawAmtWei + txFeePoly) {
                  //withdrawing max amt.
                  return web3_poly.eth.accounts.signTransaction(
                    {
                      to: receiver,
                      value: withdrawAmtWei - txFeePoly,
                      gas: 21000,
                    },
                    privateKey
                  );
                } else {
                  //send matic
                  return web3_poly.eth.accounts.signTransaction(
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
                return web3_poly.eth.sendSignedTransaction(
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
            // 3.) set win = 0 , loss = 0 , depositAmt=remainingBal-withdrawAmt , availableBalance=remainingBal-withdrawAmt
            withdraw_b_less_d_poly(remainingAmt, withdrawAmt, email, res);
          } //available balance greater than deposit
          else {
            //withdraw amt. greater than deposit
            if (withdrawAmt > result[0].depositAmtPoly) {
              const fromMainAccAmt =
                parseFloat(withdrawAmt) - result[0].depositAmtPoly;
              const fromMainAccAmtWei = await web3_poly.utils.toWei(
                String(parseFloat(withdrawAmt) - result[0].depositAmtPoly)
              );
              const privateKey = addressResult[0].polyPrivateKey;
              const sender = addressResult[0].polyAddress;
              //1.) transfer depositAmt to receiver acc.
              web3_poly.eth
                .getBalance(sender)
                .then((currBal) => {
                  //withdrawing max amt.
                  return web3_poly.eth.accounts.signTransaction(
                    {
                      to: receiver,
                      value: currBal - txFeePoly,
                      gas: 21000,
                    },
                    privateKey
                  );
                })
                .then((signedTx) => {
                  console.log(signedTx);
                  return web3_poly.eth.sendSignedTransaction(
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
              web3_poly.eth.accounts
                .signTransaction(
                  {
                    to: receiver,
                    value: fromMainAccAmtWei - txFeePoly,
                    gas: 21000,
                  },
                  mainPrivateKey
                )
                .then((signedTx) => {
                  console.log(signedTx);
                  return web3_poly.eth.sendSignedTransaction(
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
              withdraw_w_more_d_poly(result, fromMainAccAmt, email, res);
            } //withdraw amt. less than deposit
            else {
              const privateKey = addressResult[0].polyPrivateKey;
              const sender = addressResult[0].polyAddress;

              //1.) transfer depositAmt to receiver acc.
              web3_poly.eth
                .getBalance(sender)
                .then((currBal) => {
                  if (currBal < withdrawAmtWei + txFeePoly) {
                    //withdrawing max amt.
                    return web3_poly.eth.accounts.signTransaction(
                      {
                        to: receiver,
                        value: withdrawAmtWei - txFeePoly,
                        gas: 21000,
                      },
                      privateKey
                    );
                  } else {
                    return web3_poly.eth.accounts.signTransaction(
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
                  return web3_poly.eth.sendSignedTransaction(
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
              withdraw_w_less_d_poly(result, withdrawAmt, email, res);
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
            const privateKey = addressResult[0].bscPrivateKey;
            const sender = addressResult[0].bscAddress;
            //1.) transfer (depositAmt - availableBalance) to main acc.
            //2.) transfer withdraw amt to receiver acc.
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
                return hash;
              })
              .then((hash) => {
                return web3_bsc.eth.getBalance(sender);
              })
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

            // 3.) update depositAmt=remainingBal-withdrawAmt , availableBalance=remainingBal-withdrawAmt
            withdraw_b_less_d_bsc(remainingAmt, withdrawAmt, email, res);
          } else {
            //withdraw amt. greater than deposit
            if (withdrawAmt > result[0].depositAmtBsc) {
              const fromMainAccAmt =
                parseFloat(withdrawAmt) - result[0].depositAmtBsc;
              const fromMainAccAmtWei = await web3_bsc.utils.toWei(
                String(parseFloat(withdrawAmt) - result[0].depositAmtBsc)
              );
              const privateKey = addressResult[0].bscPrivateKey;
              const sender = addressResult[0].bscAddress;
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
              withdraw_w_more_d_bsc(result, fromMainAccAmt, email, res);
            } //withdraw amt. less than deposit
            else {
              const privateKey = addressResult[0].bscPrivateKey;
              const sender = addressResult[0].bscAddress;

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
              withdraw_w_less_d_bsc(result, withdrawAmt, email, res);
            }
          }
        }
      } //end of User exists
    }); //end of connection.query()
  }); //end of db.getConnection()
}

app.post("/withdraw", async (req, res) => {
  const email = req.body.email;
  const chain = req.body.chain;
  const receiver = req.body.receiver;
  const withdrawAmt = req.body.amt;
  const withdrawAmtWei = await web3.utils.toWei(String(req.body.amt));
  const txFeeEth = (await web3.eth.getGasPrice()) * 21000;
  const txFeeBsc = (await web3_bsc.eth.getGasPrice()) * 21000;
  const txFeePoly = (await web3_poly.eth.getGasPrice()) * 21000;
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
        get_address_key(
          result,
          withdrawAmt,
          withdrawAmtWei,
          email,
          res,
          txFeeEth,
          txFeeBsc,
          txFeePoly,
          receiver,
          chain
        );
      } //end of User exists
    }); //end of connection.query()
  }); //end of db.getConnection()
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
  }); //end of db.getConnection()
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
  }); //end of db.getConnection()
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
  }); //end of db.getConnection()
}); //end of app.post()

//use referral bonus winnings ***
//reffered by user
function ref_user_update(referResult, amt, email, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
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
    await connection.query(update_query_ref, async (err, result) => {
      connection.release();
      if (err) throw err;
      console.log("--------> updated after adding referral bonus to referrer");
      console.log(result.insertId);
      res.sendStatus(201);
    });
  });
}
//reffered by user
function ref_user_search(searchResult, amt, email, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearchRefer = "Select * from user_table where id = ?";
    const search_query_refer = mysql.format(sqlSearchRefer, [
      searchResult[0].referredById,
    ]);
    await connection.query(search_query_refer, async (err, referResult) => {
      connection.release();
      if (err) throw err;
      if (referResult.length == 0) {
        console.log("Referred person doesn't exist!");
        res.json({
          message: "noReferral",
        });
      } else {
        ref_user_update(referResult, amt, email, res);
      }
    });
  });
}
//reffered user
function reffered_user_win(searchResult, amt, email, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
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
      connection.release();
      if (err) throw err;
      console.log("--------> updated after adding referral bonus eth");
      console.log(result.insertId);
      res.sendStatus(201);
    });
  });
}

app.post("/referralBonus", async (req, res) => {
  const email = req.body.email;
  const amt = parseFloat(req.body.amt);
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from user_table where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    await connection.query(search_query, async (err, searchResult) => {
      connection.release();
      if (err) throw err;
      if (searchResult.length == 0) {
        console.log("--------> User does not exist");
        res.sendStatus(404);
      } else {
        reffered_user_win(searchResult, amt, email, res);
        ref_user_search(searchResult, amt, email, res);
      } //end of User exists
    }); //end of connection.query()
  }); //end of db.getConnection()
}); //end of app.post()
//use referral bonus winnings

//use vip bonus winnings ***

function vip_update(searchResult, amt, email, res) {
  db.getConnection(async (err, connection) => {
    if (err) throw err;
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
      connection.release();
      if (err) throw err;
      console.log(
        `--------> updated after adding vip lvl ${
          parseInt(searchResult[0].usedVipBonus) + 1
        } bonus eth`
      );
      console.log(result.insertId);
      res.sendStatus(201);
    });
  });
}

app.post("/vipLevelUp", async (req, res) => {
  const email = req.body.email;
  const amt = parseFloat(req.body.amt);
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const sqlSearch = "Select * from user_table where email = ?";
    const search_query = mysql.format(sqlSearch, [email]);
    await connection.query(search_query, async (err, searchResult) => {
      connection.release();
      if (err) throw err;
      if (searchResult.length == 0) {
        console.log("--------> User does not exist");
        res.sendStatus(404);
      } else {
        vip_update(searchResult, amt, email, res);
      }
    }); //end of connection.query()
  }); //end of db.getConnection()
}); //end of app.post()
//use vip bonus winnings

server.listen(port, () => console.log(`Server Started on port ${port}...`));
