const express = require("express");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const categoryController = require("../controllers/categoryController");
const permission = require("../middlewares/permission");
const multer = require("multer");

const router = express.Router({ mergeParams: true });

const storageEngine = multer.diskStorage({
  destination: "./uploads/categories",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storageEngine });

router
  .route("/")
  .get(categoryController.index)
  .post(upload.single("logo"), categoryController.create);

router
	.route("/:id")
	.get(categoryController.getById)
  .put(
    verifyAccessToken, permission("admin"),
    upload.single("logo"),
    categoryController.update
  )
  .delete(verifyAccessToken, permission("admin"), categoryController.delete);
module.exports = router;
