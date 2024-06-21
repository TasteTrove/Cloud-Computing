var express = require("express");
const Multer = require("multer");
var router = express.Router();

const {
  getAllFood,
  getFoodByNama,
  getFoodByNamaV2,
  addFood,
  updateFood,
  deleteFood,
  searchFood,
} = require("../controllers/Foods");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get("/", getAllFood);
router.get("/search", searchFood);
router.get("/:nama", getFoodByNama);
router.get("/v2/:nama", getFoodByNamaV2);
router.post("/", multer.single("gambar_lokasi"), addFood);
router.put("/:nama", multer.single("gambar_lokasi"), updateFood);
router.delete("/:nama", deleteFood);

module.exports = router;
