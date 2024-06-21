const Validator = require("fastest-validator");
const { Storage } = require("@google-cloud/storage");
var path = require("path");
const uuid = require("uuid");

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT,
  credentials: {
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    private_key: process.env.GCLOUD_PRIVATE_KEY,
  },
});

const bucket = storage.bucket(process.env.GCS_BUCKET);

const uuidv1 = uuid.v1;

const { Food, Food_gambar } = require("../models");

const v = new Validator();

const getAllFoodGambar = async (req, res) => {
  const food_gambar = await food_gambar.findAll({
    include: [
      {
        model: Food,
      },
    ],
  });
  res.json(food_gambar);
};

const getFoodGambarById = async (req, res) => {
  const id = req.params.id;

  const food_gambar = await Food_gambar.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Food,
      },
    ],
  });

  if (!food_gambar) {
    return res.status(404).json({
      status: "fail",
      message: "Data gambar makanan tidak ditemukan",
    });
  }

  res.json(food_gambar);
};

const getFoodGambarByFood = async (req, res) => {
  const id = req.params.id;

  const food = await Food.findByPk(id);

  if (!food) {
    return res.status(404).json({
      status: "fail",
      message: "Data makanan tidak ditemukan",
    });
  }

  const food_gambar = await Food_gambar.findAll({
    where: {
      FoodId: id,
    },
    include: [
      {
        model: Food,
      },
    ],
  });

  res.json(food_gambar);
};

const addFoodGambar = async (req, res) => {
  const schema = {
    FoodId: "number|integer|optional",
  };

  const food_gambar_detail = JSON.parse(req.body.data);

  const validate = v.validate(food_gambar_detail, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  const { FoodId } = food_gambar_detail;

  if (FoodId === "") {
    return res.status(400).json({
      status: "fail",
      message: "Mohon mengisi semua kolom yang diperlukan",
    });
  }

  const food = await Food.findByPk(FoodId);

  if (!food) {
    return res.status(404).json({
      status: "fail",
      message: "Data makanan tidak ditemukan",
    });
  }

  if (req.file) {
    const ext = path.extname(req.file.originalname).toLowerCase();

    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return res.status(404).json({
        status: "fail",
        message: "Hanya dapat menggunakan file gambar (.png, .jpg atau .jpeg)",
      });
    }

    const newFilename = `${uuidv1()}-${req.file.originalname}`;
    const blob = bucket.file(newFilename);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (error) => {
      console.log(error);
    });

    blobStream.on("finish", async () => {
      console.log("success");
    });

    blobStream.end(req.file.buffer);

    food_gambar_detail.gambar = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;
    const food_gambar = await Food_gambar.create(food_gambar_detail);

    res.json(food_gambar);
  } else {
    return res.status(400).json({
      status: "fail",
      message: "Mohon mengisi semua kolom yang diperlukan",
    });
  }
};

const deleteFoodGambar = async (req, res) => {
  const id = req.params.id;

  const food_gambar = await Food_gambar.findByPk(id);

  if (!food_gambar) {
    return res.status(404).json({
      status: "fail",
      message: "Data gambar makanan tidak ditemukan",
    });
  }

  if (food_gambar.gambar) {
    const gambar_old = food_gambar.gambar.replaceAll(
      `https://storage.googleapis.com/${process.env.GCS_BUCKET}/`,
      ""
    );

    try {
      await bucket.file(gambar_old).delete();
    } catch (error) {
      console.log(error);
    }
  }

  await food_gambar.destroy();

  res.status(200).json({
    status: "success",
    message: "Data gambar makanan telah terhapus",
  });
};

module.exports = {
  getAllFoodGambar,
  getFoodGambarById,
  getFoodGambarByFood,
  addFoodGambar,
  deleteFoodGambar,
};
