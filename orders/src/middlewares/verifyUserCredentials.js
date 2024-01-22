import axios from 'axios';

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
      `http://authentication:8080/authentication/verify-user-credentials`,
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
