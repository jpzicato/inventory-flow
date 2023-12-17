import axios from 'axios';
import envVariables from '../config/envVariables';

const { AUTHENTICATION_HOST, AUTHENTICATION_PORT } = envVariables;

export default async (req, _res, next) => {
  try {
    const {
      method,
      path,
      headers: { authorization },
    } = req;

    const {
      data: { userId, roleId },
    } = await axios.post(
      `http://${AUTHENTICATION_HOST}:${AUTHENTICATION_PORT}/authentication/verify-user-credentials`,
      {
        original_method: method,
        original_path: path,
      },
      {
        headers: {
          authorization: authorization,
        },
      }
    );

    req.userId = userId;
    req.roleId = roleId;

    next();
  } catch (error) {
    const { response } = error;

    next(response ? `${error}: ${response.data}` : error);
  }
};
