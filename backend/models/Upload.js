const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: String,
  uploadedAt: { type: Date, default: Date.now }
});

const Upload = mongoose.models.Upload || mongoose.model('Upload', UploadSchema);

module.exports = Upload;
