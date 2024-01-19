import { Token, User } from '../models';
import {
  logInValidation,
  passwordMatchValidation,
  refreshTokenValidation,
} from '../validators/authentication';
import { handleValidationError } from '../utils/errorHelpers';
import envVariables from '../config/envVariables';

const { REFRESH_TOKEN_SECRET } = envVariables;

export const signUp = async ({ body }, res, next) => {
  try {
    const { password, repeat_password } = body;

    const errorMessage = handleValidationError(passwordMatchValidation, {
      password,
      repeat_password,
    });

    if (errorMessage) return res.status(400).send(errorMessage);

    const { id } = await User.create(body);

    const tokens = await Token.generateTokens(id);

    res.status(201).send(tokens);
  } catch (error) {
    next(error);
  }
};

export const logIn = async ({ body: { email, password } }, res, next) => {
  try {
    const errorMessage = handleValidationError(logInValidation, {
      email,
      password,
    });

    if (errorMessage) return res.status(400).send(errorMessage);

    const foundUser = await User.findOne({
      where: {
        email,
      },
    });

    if (!foundUser) return res.status(404).send('User not found');

    const { id: user_id, password: foundUserPassword } = foundUser;

    const foundToken = await Token.findOne({
      where: {
        user_id,
      },
    });

    if (foundToken) return res.status(400).send('User already logged in');

    const passwordsMatch = await User.comparePassword(
      password,
      foundUserPassword
    );

    if (!passwordsMatch) return res.status(401).send('Wrong password');

    const tokens = await Token.generateTokens(user_id);

    res.send(tokens);
  } catch (error) {
    next(error);
  }
};

export const renewAccessToken = async (
  { body: { refresh_token } },
  res,
  next
) => {
  try {
    const errorMessage = handleValidationError(refreshTokenValidation, {
      refresh_token,
    });

    if (errorMessage) return res.status(400).send(errorMessage);

    const user_id = await Token.verifyToken(
      refresh_token,
      REFRESH_TOKEN_SECRET
    );

    const deletedCount = await Token.destroy({
      where: {
        value: refresh_token,
        user_id,
      },
    });

    if (!deletedCount)
      return res
        .status(404)
        .send('The provided refresh_token does not belong to a user');

    const tokens = await Token.generateTokens(user_id);

    res.send(tokens);
  } catch (error) {
    next(error);
  }
};

export const logOut = async ({ body: { refresh_token } }, res, next) => {
  try {
    const errorMessage = handleValidationError(refreshTokenValidation, {
      refresh_token,
    });

    if (errorMessage) return res.status(400).send(errorMessage);

    const deletedCount = await Token.destroy({
      where: {
        value: refresh_token,
      },
    });

    if (!deletedCount)
      return res
        .status(404)
        .send('The provided refresh_token does not belong to a user');

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const verifyUserCredentials = ({ userId, roleId }, res) => {
  res.send({ userId, roleId });
};
