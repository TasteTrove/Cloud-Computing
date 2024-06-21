var express = require("express");
const Multer = require("multer");
var router = express.Router();

const {
  getAllFoodGambar,
  getFoodGambarById,
  getFoodGambarByFood,
  addFoodGambar,
  deleteFoodGambar,
} = require("../controllers/FoodGambar");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get("/", getAllFoodGambar);
router.get("/:id", getFoodGambarById);
router.get("/food/:id", getFoodGambarByFood);
router.post("/", multer.single("gambar"), addFoodGambar);
router.delete("/:id", deleteFoodGambar);

module.exports = router;
