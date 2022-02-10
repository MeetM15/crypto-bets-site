import axios from "../config/axios";

export const userInfo = (token) => {
  return axios({
    url: "/user_info",
    method: "POST",
    headers: {
      authorization: "bearer " + token,
    },
  }).then((response) => response.data);
};
