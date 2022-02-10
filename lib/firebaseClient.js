import firebase from "firebase/compat/app";

const clientCredentials = {
  apiKey: "AIzaSyAhc4eugOkH-97E28W5rLSGdA2Go7AVuU8",
  authDomain: "diceup-game.firebaseapp.com",
  projectId: "diceup-game",
  storageBucket: "diceup-game.appspot.com",
  messagingSenderId: "322371515176",
  appId: "1:322371515176:web:5f61fc0239b221ecce161d",
};

export default function firebaseClient() {
  if (!firebase.apps.length) {
    firebase.initializeApp(clientCredentials);
  }
}
