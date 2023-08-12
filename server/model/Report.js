const { Schema, model } = require('mongoose');

const schema = new Schema(
  {
    name: { type: String, required: true },
    depart_id: { type: Schema.Types.ObjectId, ref: 'Depart', required: true },
    is_public: Boolean,
    rate: Number,
    create_user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    change_user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: 'create_ts', updatedAt: 'change_ts' } }
);

module.exports = model('Report', schema);
