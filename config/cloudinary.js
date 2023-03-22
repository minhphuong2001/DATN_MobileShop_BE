const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
  cloud_name: "dtqc99syb",
  api_key: "529998644514161",
  api_secret: "LDMD5DzIeqH0ovt2CuQhZHKy4Uo",
  secure: true
});

module.exports = cloudinary;