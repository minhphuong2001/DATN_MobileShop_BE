require("dotenv").config();
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../helpers/ErrorResponse");
const redisClient = require("../config/redis");

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  // Empty token
  if (!token) {
    return next(new ErrorResponse(401, "Access token not found"));
  }

  // Check valid token
  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decode.userId;
    req.role = decode.role;

    next();
  } catch (error) {
    next(new ErrorResponse(401, error.message));
  }
};

const verifyRefreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  // Check empty refresh token
  if (!refreshToken) {
    return next(new ErrorResponse(401, "Refresh token not found"));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        redisClient.get(decoded.userId.toString(), function(error, redisRefreshToken) {
            if(error) 
               return next(new ErrorResponse(401, error.message));

        // Check token stored in redis
        if (!redisRefreshToken) {
          return next(new ErrorResponse(401, "Refresh token not stored"));
        }

        if (refreshToken !== redisRefreshToken) {
          return next(
            new ErrorResponse(401, "Refresh token not match token stored")
          );
        }

        // Everything is good
        req.userId = decoded.userId;

        next();
      }
    );
  } catch (error) {
    return next(new ErrorResponse(401, "Invalid token"));
  }
};

const verifyResetToken = (req, res, next) => {
  const { resetToken } = req.params;

  // Check empty token
  if (!resetToken) {
    return next(new ErrorResponse(401, "Not found reset token"));
  }

  // Check valid token
  try {
    const decoded = jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return next(new ErrorResponse(401, error.message));
  }
};

module.exports = { verifyAccessToken, verifyRefreshToken, verifyResetToken };
