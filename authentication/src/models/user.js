import { DataTypes, Model } from 'sequelize';
import { mysqlConnection as sequelize } from '../databases/mysql';
import bcrypt from 'bcryptjs';

class User extends Model {
  static hashPassword(password) {
    return bcrypt.hash(password, 16);
  }

  static comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        validatePassword(password) {
          if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(password))
            throw new Error(
              'The password must contain at least 8 characters including at least 1 uppercase, 1 lowercase and one number'
            );
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
  }
);

User.addHook('beforeCreate', async user => {
  const hashedPassword = await User.hashPassword(user.password);

  user.password = hashedPassword;
});

User.addHook('afterCreate', async user => {
  const foundRole = user.role_id;

  if (!foundRole) await user.setRole(3);
});

export default User;
