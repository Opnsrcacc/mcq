let { Types, model, Schema } = require('mongoose'),
    questionsSchema = new Schema({
        name: { type: String, required: true, trim: true, index: true },
        options: [],
        status: Number,
        time_Stamps: { type: Number, default: +new Date() },
        username: String,
        useremail: String,
        userId: { type: Types.ObjectId }  /* ref users */
    }, { timestamps: true, versionKey: false });
module.exports = model('questionsAnswers', questionsSchema, 'questionsAnswers');