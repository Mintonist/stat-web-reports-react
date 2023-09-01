const { Schema, model } = require('mongoose');

const schema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    color: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = model('Depart', schema);
