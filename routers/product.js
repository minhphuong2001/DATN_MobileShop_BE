const express = require("express");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const productController = require("../controllers/productController");
const productVersionController = require("../controllers/productVersionController");
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
    upload.fields([{ name: 'images', maxCount: 10 }]),
    productController.create
  );

router
  .route("/:id")
  .get(productController.getById)
  .put(verifyAccessToken, permission("admin"), productController.update)
router
  .route("/stop/:id")
  .put(verifyAccessToken, permission("admin"), productController.stopWorking);
router
  .route("/active/:id")
  .put(verifyAccessToken, permission("admin"), productController.activeWorking);

router.get("/category/:id", productController.getProductByCategory)

module.exports = router;
