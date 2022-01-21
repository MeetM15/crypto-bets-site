import { LockClosedIcon } from "@heroicons/react/solid";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";

const LoginForm = ({ setToggleLoginModalOpen }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };
    try {
      const loginRes = await axios.post("/login", data);
      localStorage.setItem("token", loginRes.data.accessToken);
    } catch (error) {
      console.log("error : ", error);
    }
    router.reload();
    setToggleLoginModalOpen(() => {
      setIsLoginLoading(false);
      return false;
    });
  };
  return (
    <>
      <div className="min-h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <form className="mt-12 space-y-6" onSubmit={handleLogin}>
            <div className="-space-y-px">
              <div>
                <label
                  htmlFor="email-address"
                  className="text-formtext text-xs mb-2 font-medium">
                  Email
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  autoComplete="false"
                  className="appearance-none relative bg-inputbg shadow-inner block w-full px-3 py-3 font-medium rounded-md focus:outline-none focus:z-10 sm:text-sm mb-4"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="text-formtext text-xs mb-2 font-medium">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="false"
                  className="appearance-none relative bg-inputbg shadow-inner block w-full px-3 py-3 font-medium rounded-md focus:outline-none focus:z-10 sm:text-sm mb-4"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <button
                type="submit"
                disabled={isLoginLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-secondary bg-primary-100"
                onClick={(e) => {
                  setIsLoginLoading(true);
                  handleLogin(e);
                }}>
                {isLoginLoading ? <ClipLoader size={"20px"} /> : "Sign in"}
              </button>
              <button
                type="button"
                className="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md focus:outline-none border border-primary-20"
                onClick={() => {
                  setToggleLoginModalOpen(false);
                }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
