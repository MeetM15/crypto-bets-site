import axios from "../config/axios";

export const withdraw = (token, data) => {
  return axios({
    url: "/withdraw",
    method: "POST",
    headers: {
      authorization: "bearer " + token,
    },
    data,
  }).then((response) => response.data);
};
