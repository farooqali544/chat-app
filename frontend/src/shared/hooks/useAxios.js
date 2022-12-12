import axios from "axios";
import { useCallback, useState } from "react";

const API_ENDPOINT = "http://localhost:5000";

export const useAxios = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const sendRequest = useCallback(async (url, method = "GET", data = null, headers = {}) => {
    setIsLoading(true);

    try {
      const response = await axios({
        url: API_ENDPOINT + url,
        method,
        data,
        headers,
      });
      return response.data;
    } catch (err) {
      // let errorMessage =
      //   typeof err.response !== 'undefined'
      //     ? err.response.data.message
      //     : err.message
      let errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
