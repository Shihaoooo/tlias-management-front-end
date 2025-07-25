/* eslint-disable no-unused-vars */
import request from "@/utils/request";

export const login = (data) => {
  return request.post("/login", data);
};
