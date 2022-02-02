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
}) => {
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const handleWithdraw = (e) => {
    e.preventDefault();
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
          console.log(withdrawRes);
          return axios.post("/getUserData", {
            email: userEmail,
          });
        })
        .then((res) => {
          setUser([res.data]);
          setIsWithdrawing(false);
          console.log(withdrawRes);
        })
        .catch((error) => {
          setUser([]);
          console.log("error : ", error);
        });
    }
  };
  return (
    <div className="w-full flex items-center justify-center p-4 sm:px-6 lg:px-8">
      <form className="w-full sm:w-84 space-y-6" onSubmit={handleWithdraw}>
        <div className="rounded-md -space-y-px">
          <div className="mb-2">
            <label
              htmlFor="withdrawAddress"
              className="p-2 text-xs text-formtext font-medium">
              {withdrawChain == "eth" ? "ETH" : "BNB"} Address
            </label>
            <input
              id="withdrawAddress"
              type="text"
              required
              className="appearance-none relative bg-inputbg shadow-inner block w-full px-3 py-3 font-medium rounded-md focus:outline-none focus:z-10 sm:text-sm mb-4"
              placeholder="Enter your address!"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              disabled={isWithdrawing}
            />
          </div>
          <div>
            <label
              htmlFor="amount"
              className="p-2 text-xs text-formtext font-medium">
              Amount
            </label>
            <div className="p-1 rounded-md shadow-inner w-full h-10 flex items-center justify-start  bg-inputbg">
              <input
                id="amount"
                type="number"
                step="0.000001"
                min="0.000000"
                max={withdrawChain == "eth" ? walletBalance : bnbWalletBalance}
                onBlur={(e) => {
                  if (e.target.value < 0)
                    e.target.value = -1.0 * e.target.value;
                  if (e.target.value == "") e.target.value = 0.0;
                  setAmount(() => {
                    if (withdrawChain == "eth") {
                      if (parseFloat(e.target.value) > walletBalance)
                        e.target.value = walletBalance;
                    } else {
                      if (parseFloat(e.target.value) > bnbWalletBalance)
                        e.target.value = bnbWalletBalance;
                    }
                    return parseFloat(
                      Math.floor(e.target.value * 1000000) / 1000000
                    );
                  });
                }}
                required
                className="px-7 py-2 bg-inputbg rounded font-medium text-sm w-full"
                placeholder="amount"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    parseFloat(Math.floor(e.target.value * 1000000) / 1000000)
                  )
                }
                disabled={isWithdrawing}
              />
              <button
                className="text-xs text-btntext font-medium p-2.5 flex items-center justify-center rounded-md ml-1 bg-secondary h-full"
                onClick={() => {
                  setAmount((prev) => {
                    var newValue;
                    if (withdrawChain == "eth") {
                      newValue = walletBalance;
                    } else {
                      newValue = bnbWalletBalance;
                    }
                    return parseFloat(Math.floor(newValue * 1000000) / 1000000);
                  });
                }}
                type="button">
                max
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-secondary bg-primary-100 "
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
