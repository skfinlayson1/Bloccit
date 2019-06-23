const express = require("express");
const router = express.Router();

const advertisementController = require("../controllers/advertisementController");

router.get("/advertisement", advertisementController.index);
router.get("/advertisement/new", advertisementController.new);
router.post("/advertisement/create", advertisementController.create);
router.get("/advertisement/:id", advertisementController.show);
router.get("/advertisement/:id/edit", advertisementController.edit);
router.post("/advertisement/:id/update", advertisementController.update);
router.post("/advertisement/:id/destroy", advertisementController.destroy)

module.exports = router;