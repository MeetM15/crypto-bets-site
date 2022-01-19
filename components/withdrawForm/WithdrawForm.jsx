import axios from "axios";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { BsCashStack } from "react-icons/bs";

const WithdrawForm = ({
  walletBalance,
  bnbWalletBalance,
  user,
  withdrawChain,
  amount,
  setAmount,
  web3,
  web3_bsc,
  setWalletBalance,
  setBnbWalletBalance,
}) => {
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const handleWithdraw = (e) => {
    e.preventDefault();
    const currChain = withdrawChain;
    if (user && user[0]) {
      const data = {
        email: user[0].email,
        chain: withdrawChain,
        receiver: withdrawAddress,
        amt: amount,
      };
      console.log(data);
      axios
        .post("/withdraw", data)
        .then((withdrawRes) => {
          setIsWithdrawing(false);
          console.log(withdrawRes);
          if (currChain == "eth") return web3.eth.getBalance(user[0].address);
          else return web3_bsc.eth.getBalance(user[0].bscAddress);
        })
        .then((res) => {
          if (currChain == "eth") return web3.utils.fromWei(res);
          else return web3_bsc.utils.fromWei(res);
        })
        .then((res) => {
          if (currChain == "eth")
            setWalletBalance(
              parseFloat(res) > 0.00003 ? parseFloat(res) - 0.00003 : 0.0
            );
          else
            setBnbWalletBalance(
              parseFloat(res) > 0.00003 ? parseFloat(res) - 0.00003 : 0.0
            );

          console.log("enable click");
          if (document.getElementById("rollBtn").hasAttribute("disabled"))
            document.getElementById("rollBtn").removeAttribute("disabled");
        })
        .catch((error) => {
          console.log("error : ", error);
        });
    }
  };
  return (
    <div className="w-full flex items-center justify-center p-4 sm:px-6 lg:px-8">
      <form className="w-full sm:w-84 space-y-6" onSubmit={handleWithdraw}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div className="mb-2">
            <label
              htmlFor="withdrawAddress"
              className="p-2 text-xs text-gray-500 font-medium">
              Your {withdrawChain == "eth" ? "ETH" : "BNB"} Address
            </label>
            <input
              id="withdrawAddress"
              type="text"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter your address!"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              disabled={isWithdrawing}
            />
          </div>
          <div>
            <label
              htmlFor="amount"
              className="p-2 text-xs text-gray-500 font-medium">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              step="0.000001"
              min="0.000000"
              max={withdrawChain == "eth" ? walletBalance : bnbWalletBalance}
              onBlur={(e) => {
                if (e.target.value < 0) e.target.value = -1.0 * e.target.value;
                if (e.target.value == "") e.target.value = 0.0;
                setAmount(() => {
                  if (withdrawChain == "eth") {
                    if (parseFloat(e.target.value) > walletBalance)
                      e.target.value = walletBalance;
                  } else {
                    if (parseFloat(e.target.value) > bnbWalletBalance)
                      e.target.value = bnbWalletBalance;
                  }
                  return parseFloat(parseFloat(e.target.value).toFixed(8));
                });
              }}
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="amount"
              value={amount}
              onChange={(e) =>
                setAmount(parseFloat(parseFloat(e.target.value).toFixed(8)))
              }
              disabled={isWithdrawing}
            />
          </div>
        </div>
        <div className="flex items-center">
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 "
            disabled={isWithdrawing}
            onClick={(e) => {
              setIsWithdrawing(true);
              handleWithdraw(e);
            }}>
            {isWithdrawing ? (
              <ClipLoader />
            ) : (
              <>
                <span className="flex items-center mr-3">
                  <BsCashStack size={"20px"} />
                </span>
                Withdraw
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WithdrawForm;
