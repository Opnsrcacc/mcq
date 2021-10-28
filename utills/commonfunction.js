module.exports = () => {
    let { Types, isValidObjectId } = require('mongoose'),
        { SECRET_KEY } = require('../config/config'),
        { get } = require('lodash'),
        { compareSync } = require("bcrypt-nodejs"),
        { sign, verify } = require('jsonwebtoken'),
        userSchema = require('./schema/user');

    const validPassword = (entered, bcrypted) => compareSync(entered, bcrypted),
        ObjectId = e => Types.ObjectId(e),
        isObjectId = e => isValidObjectId(e),
        checkArray = e => Array.isArray(e),
        jwtSign = (obj = {}) => {
            try {
                return sign({ ...obj }, SECRET_KEY, { expiresIn: '8h' })
            } catch (error) {
                return false;
            }
        },
        verifyJwt = async (req, res, next) => {
            let token = get(req, 'headers.authorization', '');
            try {
                verify(token, SECRET_KEY, async (err, decode) => {
                    if (err && !decode) {
                        return res.status(200).json({ status: '00', response: 'Unauthorised access' });
                    } else {
                        if (decode.exp && (+new Date(decode.exp * 1000) < +new Date())) {
                            return res.status(200).json({ status: '00', response: 'Unauthorised access' });
                        }
                        if (decode && decode.user_id) {
                            let usersdata = await userSchema.findOne({ _id: ObjectId(decode.user_id) }, '_id email name ');
                            if (usersdata && usersdata._id) {
                                req.params.loginId = usersdata._id;
                                req.params.loginData - usersdata;
                                next();
                            } else {
                                return res.status(200).json({ status: '00', response: 'Unauthorised access' });
                            }
                        } else {
                            return res.status(200).json({ status: '00', response: 'Unauthorised access' });
                        }
                    }
                });
            } catch (error) {
                return res.status(400).json({ status: 0, response: 'Unauthorised access' });
            }
        }, CheckValue = (e = "") => {
            if (String(e).length > 0 && String(e) !== String(undefined) && String(e) !== String(null)) {
                return true;
            } else {
                return false;
            }
        };
    return { validPassword, ObjectId, isObjectId, checkArray, jwtSign, verifyJwt, CheckValue };
};