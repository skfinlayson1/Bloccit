'use strict';
module.exports = (sequelize, DataTypes) => {
  var Flair = sequelize.define('Flair', {
    name: DataTypes.STRING,
    color: DataTypes.STRING
  }, {});
  Flair.associate = function(models) {
    Flair.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    })
  };
  return Flair;
};