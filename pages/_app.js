import "../styles/globals.css";
import axios from "axios";
axios.defaults.baseURL = "https://cryptodice1.herokuapp.com/";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
