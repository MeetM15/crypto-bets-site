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
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address or Username
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  autoComplete="false"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="false"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 "
                onClick={(e) => {
                  setIsLoginLoading(true);
                  handleLogin(e);
                }}>
                {isLoginLoading ? (
                  <ClipLoader size={"20px"} />
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <LockClosedIcon
                        className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                        aria-hidden="true"
                      />
                    </span>
                    Sign in
                  </>
                )}
              </button>
              <button
                type="button"
                className="group relative w-full flex justify-center py-2 px-4 border-2 text-sm font-medium rounded-md focus:outline-none"
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
