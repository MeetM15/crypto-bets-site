import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import axios from "axios";
axios.defaults.baseURL = "https://cryptodice1.herokuapp.com/";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      appId={"chuIgYSKuoha43XNd0HsvlCj1BhlJ63uR1ntxHW5"}
      serverUrl={"https://t1l3lc39wqjw.usemoralis.com:2053/server"}
    >
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default MyApp;
