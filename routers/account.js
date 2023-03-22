const express = require('express');
const accountController = require('../controllers/accountController');
const permission = require('../middlewares/permission');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const router = express.Router({ mergeParams: true });


router
	.route("/")
	.get(verifyAccessToken, permission('admin'), accountController.getAll);

router
	.route("/:id")
	.get(verifyAccessToken, permission('admin'), accountController.getById)
	.delete(verifyAccessToken, permission('admin'), accountController.delete)

module.exports = router;