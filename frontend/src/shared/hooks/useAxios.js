import axios from "axios";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
// import { setError } from "../../redux/slices/errorSlice";

const API_ENDPOINT = "http://localhost:5000";

export const useAxios = () => {
  const dispatch = useDispatch();

  const sendRequest = useCallback(async (url, method = "GET", data = null, headers = {}) => {
    console.log("hi")
    try {
      const response = await axios({
        url: API_ENDPOINT + url,
        method,
        data,
        headers,
      });
      return response.data;
    } catch (err) {
      let error = {};
      console.log(err)
      if (err.response) {
        error = err.response.data;
      } else {
        error = { message: err.message || "Unkown error occured", status: 500 };
      }
      // dispatch(setError(error));
      throw err;
    }
  }, []);

  return { sendRequest };
};
