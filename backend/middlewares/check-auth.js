const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  /*The "OPTIONS" request method is used in HTTP communication to retrieve information about the communication options available for a specific resource or server. It is often used in conjunction with Cross-Origin Resource Sharing (CORS) to allow a browser to determine if a specific request is safe to send, and to determine the available options for a resource or server.}*/

  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      const error = new HttpError("Authentication failed!", 401);
      return next(error);
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.authUser = decodedToken;
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 401);
    return next(error);
  }
};
