import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { BsCashStack } from "react-icons/bs";
import { withdraw } from "../../services/withdrawService";
import { userInfo } from "../../services/userInfo";
const WithdrawForm = ({
  walletBalance,
  bnbWalletBalance,
  polyWalletBalance,
  user,
  withdrawChain,
  amount,
  setAmount,
  setPoints,
  setWalletBalance,
  setBnbWalletBalance,
  setPolyWalletBalance,
}) => {
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const handleWithdraw = (e) => {
    e.preventDefault();
    if (user) {
      const data = {
        chain: withdrawChain,
        withdraw_address: withdrawAddress,
        amount: amount,
      };
      withdraw(user?.token, data)
        .then((withdrawRes) => {
          return userInfo(user?.token);
        })
        .then((userRes) => {
          setPoints(userRes.points);
          setWalletBalance(parseFloat(userRes.available_balance_eth));
          setBnbWalletBalance(parseFloat(userRes.available_balance_bsc));
          setPolyWalletBalance(parseFloat(userRes.available_balance_poly));
          setIsWithdrawing(false);
        })
        .catch((error) => {
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
              Withdraw Address
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
                max={
                  withdrawChain == "eth"
                    ? walletBalance
                    : withdrawChain == "bsc"
                    ? bnbWalletBalance
                    : polyWalletBalance
                }
                onBlur={(e) => {
                  if (e.target.value < 0)
                    e.target.value = -1.0 * e.target.value;
                  if (e.target.value == "") e.target.value = 0.0;
                  setAmount(() => {
                    if (withdrawChain == "eth") {
                      if (parseFloat(e.target.value) > walletBalance)
                        e.target.value = walletBalance;
                    } else if (withdrawChain == "bsc") {
                      if (parseFloat(e.target.value) > bnbWalletBalance)
                        e.target.value = bnbWalletBalance;
                    } else {
                      if (parseFloat(e.target.value) > polyWalletBalance)
                        e.target.value = polyWalletBalance;
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
                    } else if (withdrawChain == "bsc") {
                      newValue = bnbWalletBalance;
                    } else {
                      newValue = polyWalletBalance;
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
