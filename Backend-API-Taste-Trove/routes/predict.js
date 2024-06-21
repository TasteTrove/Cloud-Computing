var express = require("express");
const Multer = require("multer");
var router = express.Router();

const { predictMain } = require("../controllers/Predict");

const multer = Multer({
  storage: Multer.memoryStorage(),
});

router.post("/", multer.single("file"), predictMain);
// router.post("/random", predictRandom);

module.exports = router;
