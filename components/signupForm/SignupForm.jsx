import { LockClosedIcon } from "@heroicons/react/solid";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";
const SignupForm = ({ setToggleLoginModalOpen }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const handleSignup = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
      username: username,
      password: password,
    };
    try {
      const signupRes = await axios.post("/createUser", data);
      localStorage.setItem("token", signupRes.data.accessToken);
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
          <form className="mt-4 space-y-6" onSubmit={handleSignup}>
            <div className="-space-y-px">
              <div>
                <label
                  htmlFor="username"
                  className="text-formtext text-xs mb-2 font-medium">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none relative bg-inputbg shadow-inner block w-full px-3 py-3 font-medium rounded-md focus:outline-none focus:z-10 sm:text-sm mb-4"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="email-address"
                  className="text-formtext text-xs mb-2 font-medium">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
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
                  className="appearance-none relative bg-inputbg shadow-inner block w-full px-3 py-3 font-medium rounded-md focus:outline-none focus:z-10 sm:text-sm mb-4"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-secondary bg-primary-100 mr-4"
                onClick={(e) => {
                  setIsLoginLoading(true);
                  handleSignup(e);
                }}>
                {isLoginLoading ? <ClipLoader size={"20px"} /> : "Sign Up"}
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

export default SignupForm;
