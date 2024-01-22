import { DataTypes, Model } from 'sequelize';
import { connection as sequelize } from '../databases/mysql';

class Role extends Model {}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30],
      },
    },
  },
  {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    underscored: true,
  }
);

export default Role;
