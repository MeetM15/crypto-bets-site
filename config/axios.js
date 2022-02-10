import axios from "axios";
import { API_URL } from "../config/constant";

export default function config(params) {
  return axios({
    baseURL: API_URL,
    ...params,
  });
}
