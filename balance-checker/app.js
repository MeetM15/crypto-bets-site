const express = require("express");
var cors = require("cors");
const app = express();
const mysql = require("mysql");
const cron = require("node-cron");

const port = process.env.PORT || 3000;

// connection details
const db = mysql.createPool({
  host: "l6glqt8gsx37y4hs.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "ae3jxjses5uz4pvo",
  password: "jvdktwz5f5knvaal",
  database: "s8lxs5ne2m2pta3x",
});

app.use(cors());

//web3
const Web3 = require("web3");
const res = require("express/lib/response");
let web3 = new Web3(
  "https://eth-rinkeby.alchemyapi.io/v2/sk88g0PfYAHxltvWlVpWWbvrXMnv22TN"
);
let web3_bsc = new Web3(
  "https://speedy-nodes-nyc.moralis.io/487960593a8857bde8a74862/bsc/testnet"
);
app.use(express.json());

db.getConnection(async (err, connection) => {
  if (err) throw err;
  console.log("DB connected successfully: " + connection.threadId);
}); //end of db.getConnection()

// ether api key : XTZCENR92PIG64NUGCDGPDCBJSNTIPQ9W6
// bsc api key : DCKX4BYY4Z15NRWM4ABD5556CYM7PBP7NY

cron.schedule("* * * * *", () => {
  console.log("updating balance every minute");
  db.getConnection(async (err, connection) => {
    if (err) throw err;
    const search_query = "SELECT * FROM user_table";
    await connection.query(search_query, async (err, result) => {
      if (err) throw err;
      console.log("user search data : ", result);
      if (result.length != 0) {
        const calls = (result.length - 1) / 20;
        for (let i = 0; i < calls + 1; i++) {
          const urlEth = `https://api.etherscan.io/api?module=account&action=balancemulti&address=`;
          const urlEthTag = `&tag=latest&apikey=XTZCENR92PIG64NUGCDGPDCBJSNTIPQ9W6`;
          const urlBscTag = `&tag=latest&apikey=DCKX4BYY4Z15NRWM4ABD5556CYM7PBP7NY`;
          const urlBsc = `https://api.bscscan.com/api?module=account&action=balancemulti&address=`;
          const currArrEth = [];
          const currArrBsc = [];
          //last call
          if (calls == i) {
            currArrEth = result.map((user, index) => {
              if (index >= 20 * i) return user.ethAddress;
            });
            currArrBsc = result.map((user, index) => {
              if (index >= 20 * i) return user.bscAddress;
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
          }
          for (let j = 0; j < currArrEth.length; j++) {
            urlEth = urlEth + "," + currArrEth[j];
          }
          for (let j = 0; j < currArrBsc.length; j++) {
            urlBsc = urlBsc + "," + currArrBsc[j];
          }
          console.log("eth fetch url : ", urlEth + urlEthTag);
          console.log("bsc fetch url : ", urlBsc + urlBscTag);
          fetch(urlEth + urlEthTag).then(async (balances) => {
            //eth
            console.log("eth data : ", balances);
            if (balances["status"] == "1") {
              for (let k = 0; k < balances.result.length; k++) {
                const currAddBal = await web3.utils.fromWei(
                  balances.result[k].balance
                );
                const sqlSearch =
                  "SELECT * FROM user_table WHERE ethAddress = ?";
                const search_query_address = mysql.format(sqlSearch, [
                  balances.result[k].account,
                ]);
                //last update
                if (i == calls && k == balances.result.length - 1) {
                  await connection.query(
                    search_query_address,
                    async (err, search_add_result) => {
                      if (err) throw err;
                      console.log("eth search data : ", search_add_result);
                      const sqlUpdate =
                        "UPDATE user_table SET depositAmtEth = ? , availableBalanceEth = ? WHERE ethAddress = ?";
                      const update_query = mysql.format(sqlUpdate, [
                        parseFloat(currAddBal),
                        parseFloat(currAddBal) +
                          search_add_result[0].winAmtEth -
                          search_add_result[0].lossAmtEth,
                        balances.result[k].account,
                      ]);
                      await connection.query(
                        update_query,
                        async (err, update_result) => {
                          connection.release();
                          if (err) throw err;
                          res.json(update_result);
                        }
                      );
                    }
                  );
                } else {
                  await connection.query(
                    search_query_address,
                    async (err, search_add_result) => {
                      if (err) throw err;
                      console.log("eth search data : ", search_add_result);
                      const sqlUpdate =
                        "UPDATE user_table SET depositAmtEth = ? , availableBalanceEth = ? WHERE ethAddress = ?";
                      const update_query = mysql.format(sqlUpdate, [
                        parseFloat(currAddBal),
                        parseFloat(currAddBal) +
                          search_add_result[0].winAmtEth -
                          search_add_result[0].lossAmtEth,
                        balances.result[k].account,
                      ]);
                      await connection.query(
                        update_query,
                        async (err, update_result) => {
                          if (err) throw err;
                          res.json(update_result);
                        }
                      );
                    }
                  );
                }
              }
            }
          });
          fetch(urlBsc + urlBscTag).then(async (balancesBsc) => {
            //bsc
            console.log("bsc data : ", balancesBsc);
            if (balancesBsc["status"] == "1") {
              for (let k = 0; k < balancesBsc.result.length; k++) {
                const currAddBal = await web3_bsc.utils.fromWei(
                  balancesBsc.result[k].balance
                );
                const sqlSearch =
                  "SELECT * FROM user_table WHERE bscAddress = ?";
                const search_query_address = mysql.format(sqlSearch, [
                  balances.result[k].account,
                ]);
                //last update
                if (i == calls && k == balancesBsc.result.length - 1) {
                  await connection.query(
                    search_query_address,
                    async (err, search_add_result) => {
                      if (err) throw err;
                      console.log("bsc search data : ", search_add_result);
                      const sqlUpdate =
                        "UPDATE user_table SET depositAmtBsc = ? , availableBalanceBsc = ? WHERE bscAddress = ?";
                      const update_query = mysql.format(sqlUpdate, [
                        parseFloat(currAddBal),
                        parseFloat(currAddBal) +
                          search_add_result[0].winAmtBsc -
                          search_add_result[0].lossAmtBsc,
                        balancesBsc.result[k].account,
                      ]);
                      await connection.query(
                        update_query,
                        async (err, update_result) => {
                          connection.release();
                          if (err) throw err;
                          res.json(update_result);
                        }
                      );
                    }
                  );
                } else {
                  await connection.query(
                    search_query_address,
                    async (err, search_add_result) => {
                      if (err) throw err;
                      console.log("bsc search data : ", search_add_result);
                      const sqlUpdate =
                        "UPDATE user_table SET depositAmtBsc = ? , availableBalanceBsc = ? WHERE bscAddress = ?";
                      const update_query = mysql.format(sqlUpdate, [
                        parseFloat(currAddBal),
                        parseFloat(currAddBal) +
                          search_add_result[0].winAmtBsc -
                          search_add_result[0].lossAmtBsc,
                        balancesBsc.result[k].account,
                      ]);
                      await connection.query(
                        update_query,
                        async (err, update_result) => {
                          if (err) throw err;
                          res.json(update_result);
                        }
                      );
                    }
                  );
                }
              }
            }
          });
        }
      }
    }); //end of connection.query()
  }); //end of db.connection()
});

app.listen(port, () => console.log(`Server Started on port ${port}...`));
