import { DataTypes, Model } from 'sequelize';
import { mysqlConnection as sequelize } from '../config/databases/mysql';
import jwt from 'jsonwebtoken';
import generateToken from '../utils/generateToken';

class Token extends Model {
  static async generateTokens(userId) {
    const accessToken = generateToken(userId, true);
    const refreshToken = generateToken(userId);

    const createdToken = await Token.create({
      value: refreshToken,
    });

    await createdToken.setUser(userId);

    return {
      accessToken,
      refreshToken,
    };
  }

  static async verifyToken(token, secret) {
    const { userId } = jwt.verify(token, secret);

    return userId;
  }
}

Token.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Token',
    tableName: 'tokens',
    underscored: true,
  }
);

export default Token;
