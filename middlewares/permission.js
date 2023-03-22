const ErrorResponse = require("../helpers/ErrorResponse");

const permission = (role) => {
  return (req, res, next) => {
    if (req.role !== role) return next(new ErrorResponse(400, "No authorized"));

    next();
  };
};

module.exports = permission;
