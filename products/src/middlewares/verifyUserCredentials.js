import axios from 'axios';

export default async (req, _res, next) => {
  try {
    const {
      headers: { authorization },
      method,
      path,
      body: { original_path, previous_stock },
    } = req;

    await axios.post(
      `http://authentication:8080/authentication/verify-user-credentials`,
      {
        original_method: method,
        original_path: original_path || path,
      },
      {
        headers: {
          authorization,
        },
      }
    );

    req.previousStock = previous_stock;

    next();
  } catch (error) {
    const { response } = error;

    next(response ? `${error}: ${response.data}` : error);
  }
};
