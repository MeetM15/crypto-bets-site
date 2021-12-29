import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import axios from "axios";
axios.defaults.baseURL = "https://cryptodice1.herokuapp.com/";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID}
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_ID}
    >
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default MyApp;
