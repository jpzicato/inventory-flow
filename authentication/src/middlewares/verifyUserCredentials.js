import { Role, Token, User } from '../models';
import envVariables from '../config/envVariables';

const PERMISSIONS = {
  administrator: ['GET', 'POST', 'PUT', 'DELETE'],
  reader: ['GET'],
};

export const authorizeAccessToken = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    const accessToken =
      authorizationHeader && authorizationHeader.split(' ')[1];

    if (!accessToken) return res.status(401).send('Access token needed');

    const userId = await Token.verifyToken(
      accessToken,
      envVariables.ACCESS_TOKEN_SECRET
    );

    const foundUser = await User.findByPk(userId);

    if (!foundUser)
      return res.status(401).send('The access token does not belong to a user');

    const { id, RoleId } = foundUser;

    req.roleId = RoleId;
    req.userId = id;

    next();
  } catch (error) {
    next(error);
  }
};

export const verifyUserPermissions = async (
  {
    userId,
    roleId,
    path,
    method,
    body: { role_id, original_method, original_path },
  },
  res,
  next
) => {
  try {
    if (original_path) {
      PERMISSIONS.customer = ['GET'];

      if (original_path.split('/')[1] === 'orders')
        PERMISSIONS.customer.push('POST', 'PUT', 'DELETE');
    } else {
      // eslint-disable-next-line no-prototype-builtins
      if (PERMISSIONS.hasOwnProperty('customer')) delete PERMISSIONS.customer;
    }

    const { name: roleName } = await Role.findByPk(roleId);

    const sentenceConditions = [
      path.split('/')[1] == userId,
      PERMISSIONS[roleName] &&
        PERMISSIONS[roleName].includes(original_method || method),
    ];

    if (sentenceConditions[0] || sentenceConditions[1]) {
      if (!sentenceConditions[1] && role_id)
        return res
          .status(403)
          .send(
            `The user id ${userId} is allowed to update his own data except the role_id field`
          );

      return next();
    }

    res.status(403).send(`Not allowed for ${roleName} users`);
  } catch (error) {
    next(error);
  }
};
