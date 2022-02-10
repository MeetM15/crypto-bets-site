import axios from "../config/axios";
// vip level up
export const liveBets = (token) => {
  return axios({
    url: "/live_bets",
    method: "GET",
    headers: {
      authorization: "bearer " + token,
    },
  }).then((response) => response.data);
};

export const getMyBets = (token, data) => {
  return axios({
    url: "/my_bets",
    method: "POST",
    headers: {
      authorization: "bearer " + token,
    },
    data,
  }).then((response) => response.data);
};

export const placeBet = (token, data) => {
  return axios({
    url: "/bet",
    method: "POST",
    headers: {
      authorization: "bearer " + token,
    },
    data,
  }).then((response) => response.data);
};
