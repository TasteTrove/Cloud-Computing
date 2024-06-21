module.exports = (sequelize, DataTypes) => {
  const Food = sequelize.define(
    "Food",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lokasi: {
        type: DataTypes.STRING,
      },
      deskripsi: {
        type: DataTypes.TEXT,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "food",
    }
  );

  Food.associate = (models) => {
    Food.hasMany(models.Food_gambar, {
      foreignKey: "FoodId",
    });
  };

  return Food;
};
