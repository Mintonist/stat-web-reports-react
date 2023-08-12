const { Schema, model } = require('mongoose');

const schema = new Schema(
  {
    login: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'editor', 'viewer'], required: true },
    login_ts: Number,
  },
  { timestamps: { createdAt: 'create_ts', updatedAt: 'change_ts' } }
);

module.exports = model('User', schema);
