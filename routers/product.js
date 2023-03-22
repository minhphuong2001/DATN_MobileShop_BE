const express = require("express");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const productController = require("../controllers/productController");
const permission = require("../middlewares/permission");
const multer = require("multer");

const router = express.Router({ mergeParams: true });

const storageEngine = multer.diskStorage({
	destination: "./uploads/products",
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
	});
const upload = multer({ storage: storageEngine })

router
  .route("/")
  .get(productController.index)
  .post(
    verifyAccessToken, permission("admin"), 
    upload.fields([{ name: 'images', maxCount: 5 }]),
    productController.create
  );

router
  .route("/:id")
  .get(productController.getById)
  .put(verifyAccessToken, permission("admin"), productController.update)
  .delete(verifyAccessToken, permission("admin"), productController.delete);

module.exports = router;
