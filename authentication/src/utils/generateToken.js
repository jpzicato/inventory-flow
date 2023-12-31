import envVariables from '../config/envVariables';
import jwt from 'jsonwebtoken';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRATION } =
  envVariables;

export default (userId, expires) =>
  jwt.sign(
    { userId },
    expires ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET,
    expires && { expiresIn: ACCESS_TOKEN_EXPIRATION }
  );
