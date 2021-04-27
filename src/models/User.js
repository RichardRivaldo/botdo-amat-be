const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

userSchema.methods.checkPassword = async (inputPassword, actualPassword) =>
    await bcrypt.compare(inputPassword, actualPassword);

exports.User = mongoose.model('User', userSchema);
