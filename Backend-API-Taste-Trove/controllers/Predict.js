const axios = require("axios");
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

const predictMain = async (req, res) => {
  if (req.file) {
    const ext = path.extname(req.file.originalname).toLowerCase();

    if (
      ext !== ".png" &&
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".webp"
    ) {
      return res.status(404).json({
        status: "fail",
        message:
          "Hanya dapat menggunakan file gambar (.png, .jpg, .jpeg atau .webp)",
      });
    }

    const newFilename = `${uuidv1()}-${req.file.originalname}`;
    const blob = bucket.file(`predict_uploads/${newFilename}`);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (error) => {
      return res.status(400).json({
        status: "fail",
        message: error,
      });
    });

    blobStream.on("finish", async () => {
      const filename = blob.name.replaceAll("predict_uploads/", "");

      try {
        const getPrediction = await axios.post(process.env.API_PREDICT_HOST, {
          file: filename,
        });
        const predictedTastetrove = getPrediction.data;

        const findTastetrove = await Tastetrove.findOne({
          where: {
            nama: predictedTastetrove.nama,
          },
        });

        if (!findTastetrove) {
          const Tastetrove = await Tastetrove.create(predictedTastetrove);
          return res.json(Tastetrove);
        }

        res.json(findTastetrove);
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          status: "fail",
          message: "Tidak terdeteksi",
        });
      }
    });

    blobStream.end(req.file.buffer);
  } else {
    return res.status(400).json({
      status: "fail",
      message: "Mohon mengisi semua kolom yang diperlukan",
    });
  }
};

// const predictRandom = async (req, res) => {
//   const random_Tastetrove = [
//     {
//       nama: "Lumpia",
//       lokasi: "Jawa Tengah",
//       deskripsi: "",
//     },
//     {
//       nama: "Serabi",
//       lokasi: "Jawa Barat",
//       deskripsi: "",
//     },
//     {
//       nama: "Sup Konro",
//       lokasi: "Sulawesi Selatan",
//       deskripsi: "",
//     },
//     {
//       nama: "Gohu Ikan",
//       lokasi: "Maluku Utara",
//       deskripsi: "",
//     },
//     {
//       nama: "Ayam Taliwang",
//       lokasi: "Nusa Tenggara Barat",
//       deskripsi: "",
//     },
//     {
//       nama: "Rujak Cingur",
//       lokasi: "Jawa Timur",
//       deskripsi: "",
//     },
//     {
//       status: "fail",
//     },
//   ];

//   const response =
//     random_Tastetrove[Math.floor(Math.random() * random_Tastetrove.length)];

//   res.json(response);
// };

module.exports = {
  predictMain,
  // predictRandom,
};
