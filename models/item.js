const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/to-doapp");

const itemSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  checked: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Item', itemSchema);
