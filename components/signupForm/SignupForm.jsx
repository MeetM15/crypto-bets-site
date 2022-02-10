import { useState } from "react";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";
import { signUp } from "../../services/authService";
import { signIn } from "../../services/authService";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const SignupForm = ({ setToggleLoginModalOpen, user }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userExist, setUserExist] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const handleSignup = async (e) => {
    e.preventDefault();
    const data = {
      username: username,
      refer_code: localStorage.getItem("referredById")
        ? localStorage.getItem("referredById")
        : "",
    };
    const signUpData = {
      email: email,
      password: password,
    };
    signUp(signUpData)
      .then(async (res) => {
        console.log(res);
        const token = await firebase.auth().currentUser.getIdToken();
        return signIn(token, data);
      })
      .then((res) => {
        setToggleLoginModalOpen(() => {
          setIsLoginLoading(false);
          return false;
        });
        setUserExist(false);
        router.reload();
      })
      .catch((err) => {
        // if (err.message == "EMAIL_NOT_FOUND") {
        //   setUserExist(true);
        //   setIsLoginLoading(false);
        // }
        console.log("error : ", err.code);
        console.log("error : ", err.message);
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
              {userExist == true && (
                <div className="w-full font-medium text-red-800 text-sm">
                  User already exists!
                </div>
              )}
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
