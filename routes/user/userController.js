module.exports = (io) => {
    let { isObjectId, ObjectId, validPassword, jwtSign, CheckValue } = require('../../utills/commonfunction')(),
        { validationResult } = require('express-validator'),
        { hashSync, genSaltSync } = require('bcrypt-nodejs'),
        userschema = require('../../utills/schema/user'),
        questionsSchema = require('../../utills/schema/questions');

    let updateUserNameInProduct = async (req) => {
        try {
            let { _id = '', name = '', email = '' } = req;
            if (isObjectId(_id)) {
                await questionsSchema.updateMany({ userId: ObjectId(_id) }, { username: name, useremail: email }, { multi: true });
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(`errorin ${error}`)
            return false;
        }
    };

    let addUsers = async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let { name = '', status = 1, _id = '', email = '', password = '' } = req.body, obj = {};
            if (!CheckValue(name)) {
                return res.status(400).json({ status: 0, response: 'Name is required' });
            }
            obj['status'] = status;
            obj['name'] = name;
            obj['email'] = email;
            if (isObjectId(_id)) {
                if (CheckValue(password)) {
                    obj['password'] = hashSync(password, genSaltSync(8), null);
                }
                let checkEmail = await userschema.find({ _id: { $ne: ObjectId(_id) }, email: String(email).trim() }, '_id');
                if (checkEmail && checkEmail.length > 0) {
                    return res.status(200).json({ status: 0, response: 'name already exists' });
                }
                let checkname = await userschema.find({ _id: { $ne: ObjectId(_id) }, name: String(name).trim() }, '_id');
                if (checkname && checkname.length > 0) {
                    return res.status(200).json({ status: 0, response: 'name already exists' });
                }
                let update = await userschema.updateMany({ _id: ObjectId(_id) }, obj, { multi: true });
                if (update && update.nModified !== 0) {
                    updateUserNameInProduct({ _id, name, email });
                    return res.status(200).json({ status: 1, response: 'User updated successfully', ids: _id });
                } else {
                    return res.status(200).json({ status: 0, response: 'User not updated' });
                }
            } else {
                if (!CheckValue(password)) {
                    return res.status(400).json({ status: 0, response: 'Password is required' });
                }
                let checkEmail = await userschema.find({ email: String(email).trim() }, '_id');
                if (checkEmail && checkEmail.length > 0) {
                    return res.status(200).json({ status: 0, response: 'name already exists' });
                }
                let checkname = await userschema.find({ name: String(name).trim() }, '_id');
                if (checkname && checkname.length > 0) {
                    return res.status(200).json({ status: 0, response: 'name already exists' });
                }
                obj['password'] = hashSync(password, genSaltSync(8), null);
                obj['time_Stamps'] = +new Date();
                let insert = await userschema.insertMany([...Array.of(obj)]);
                if (insert && insert.length > 0) {
                    let ids = insert.map(e => e._id);
                    return res.status(200).json({ status: 1, response: 'user added successfully', ids, authToken: jwtSign({ user_id: insert[0]._id, email: email }) });
                } else {
                    return res.status(200).json({ status: 0, response: 'user not added' });
                }
            }
        } catch (error) {
            console.log(`error addUsers  in ${error}`);
            return res.status(500), json({ status: 0, response: error });
        }
    };

    let loginUser = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let { name = '', password = '' } = req.body;
            let checkUser = await userschema.findOne({ $or: [{ name: String(name).trim() }, { email: String(name).trim() }] }, "_id email password");
            if (checkUser && checkUser._id) {
                if (validPassword(password, checkUser.password)) {
                    let obj = {};
                    obj['activity.last_login'] = new Date();
                    await userschema.update({ _id: ObjectId(checkUser._id) }, obj);
                    return res.status(200).json({ status: 1, response: 'Login successfully', authToken: jwtSign({ user_id: checkUser._id, email: checkUser.email }) })
                } else {
                    return res.status(200).json({ status: 0, response: 'Password is not valid' });
                }
            } else {
                return res.status(200).json({ status: 0, response: 'No users found' });
            }
        } catch (error) {
            console.log(`error loginUser in ${error}`);
            return res.status(500).json({ status: 0, response: error });
        }
    };

    let LogOut = async (req, res) => {
        try {
            let { loginId = '' } = req.params, obj = {};
            obj['activity.last_logout'] = new Date();
            let update = await userschema.update({ _id: ObjectId(loginId) }, obj);
            if (update && update.nModified !== 0) {
                return res.status(200).json({ status: 1, response: 'Logout successfully' });
            } else {
                return res.status(200).json({ status: 0, response: 'Not logout' });
            }
        } catch (error) {
            console.log(`error LogOut in ${error}`);
            return res.status(500).json({ status: 0, response: error });
        }
    };

    return { addUsers, loginUser, LogOut };
}
