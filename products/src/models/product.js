import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.static(
  'updateStock',
  async function (product_id, quantity, previousStock) {
    const foundProduct = await this.findById(product_id);

    if (!foundProduct) return null;

    if (previousStock) foundProduct.stock += quantity;
    else foundProduct.stock -= quantity;

    return foundProduct.save();
  }
);

export default model('Product', productSchema);
