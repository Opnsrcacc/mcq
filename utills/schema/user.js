let { model, Schema } = require('mongoose'),
    userschema = new Schema({
        email: { type: String, required: true, trim: true, index: { unique: true } },
        name: { type: String, required: true, trim: true, index: { unique: true } },
        status: Number,
        password: String,
        activity: { last_login: { type: Date }, last_logout: { type: Date } },
        time_Stamps: { type: Number, default: +new Date() }
    }, { timestamps: true, versionKey: false });
module.exports = model('users', userschema, 'users');