const HttpError = require("../models/http-error")

exports.unkownError = (next, err) =>{
    const error = new HttpError("Unkown error occured "+err, 500);
    return next(error);
}