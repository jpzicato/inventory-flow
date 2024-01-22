import axios from 'axios';
import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
  {
    products: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          min: 1,
          required: true,
        },
      },
    ],
    delivery_address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    user_id: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

orderSchema.static(
  'getProducts',
  async function (products, authorization, verifyQuantity) {
    let response = [];

    for (const { _id, quantity } of products) {
      const { data } = await axios.get(
        `http://products:8080/api/products/${_id}`,
        {
          headers: {
            authorization,
          },
        }
      );

      if (verifyQuantity && data.stock - quantity < 0) {
        response = `Requested quantity of product id ${_id} not available`;

        break;
      }

      response.push(data);
    }

    return response;
  }
);

orderSchema.static('getUser', async function (userId, authorization) {
  await axios.get(`http://authentication:8080/users/${userId}`, {
    headers: {
      authorization,
    },
  });
});

export default model('Order', orderSchema);
