import axios from "../config/axios";
import firebase from "firebase/compat/app";
import "firebase/auth";
import firebaseClient from "../lib/firebaseClient";

export const signUp = (data = {}) => {
  return new Promise(async (resolve, reject) => {
    firebaseClient();
    firebase
      .auth()
      .createUserWithEmailAndPassword(data.email, data.password)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export const login = (data = {}) => {
  return new Promise((resolve, reject) => {
    firebaseClient();
    firebase
      .auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

// export const forgotPassword = (email) => {
//   return new Promise((resolve, reject) => {
//     firebase
//       .auth()
//       .sendPasswordResetEmail(email, {
//         url: "https://maskedmed.com/login",
//       })
//       .then((res) => resolve(res))
//       .catch((err) => reject(err));
//   });
// };

// login to our system by passing firebase token
export const signIn = (token, data) => {
  return axios({
    url: "/login",
    method: "POST",
    headers: {
      authorization: "bearer " + token,
    },
    data,
  }).then((response) => response.data);
};
