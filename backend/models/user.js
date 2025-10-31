const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  birthday: { type: Date, required: true },
  password: { type: String, required: true }
});

// Virtual to populate uploads (not stored in User document)
UserSchema.virtual('uploads', {
  ref: 'Upload',           // The model to use
  localField: '_id',       // Find uploads where 'user' matches '_id'
  foreignField: 'user'     
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

// Prevent OverwriteModelError by checking existing models
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
