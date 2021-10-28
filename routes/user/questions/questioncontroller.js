module.exports = () => {
    let { validationResult } = require('express-validator'),
        questionsChema = require('../../../utills/schema/questions'),
        UserSchema = require('../../../utills/schema/user'),
        { get } = require('lodash'),
        { ObjectId, isObjectId, checkArray, CheckValue } = require('../../../utills/commonfunction')();

    let UpdateUserName = async (req) => {
        try {
            let { userId = '', _id = '' } = req;
            if (isObjectId(userId) && isObjectId(_id)) {
                let getusers = await UserSchema.findOne({ _id: ObjectId(userId) }, 'name email'), obj = {};
                obj['username'] = get(getusers, 'name', '');
                obj['useremail'] = get(getusers, 'email', '');
                await questionsChema.updateOne({ _id: ObjectId(_id) }, obj, { multi: true });
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(`error in ${error}`);
            return false;
        }
    };

    let dashBoardCount = async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let { loginId: userId = '' } = req.params;
            if (!isObjectId(userId)) {
                return res.status(400).json({ status: 0, response: 'User id required' });
            }
            let p1 = questionsChema.countDocuments({ userId: ObjectId(userId), status: 1 }),
                p2 = questionsChema.countDocuments({ userId: ObjectId(userId), status: 2 }),
                all = await Promise.all([p1, p2]);
            return res.status(200).json({ status: 1, response: { active: get(all, '0', 0), inactive: get(all, '1', 0) } });
        } catch (error) {
            console.log(`error const dashBoardCount in ${error}`);
            return res.status(500).json({ status: 0, response: error });
        }
    };

    let addQuestions = async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let { name = '', _id = '', status = 1, options = [] } = req.body,
                { loginId: userId = '' } = req.params,
                obj = {};
            if (!isObjectId(userId)) {
                return res.status(200).json({ status: '00', response: 'User id required' });
            }
            if (!CheckValue(name)) {
                return res.status(200).json({ status: 0, response: 'Name is required' });
            }
            if (!checkArray(options) || [...options].length === 0) {
                return res.status(200).json({ status: 0, response: 'Options is required' });
            }
            obj['name'] = name;
            obj['status'] = status;
            obj['userId'] = ObjectId(userId);
            obj['options'] = [...options];
            if (isObjectId(_id)) {
                let update = await questionsChema.updateOne({ _id: ObjectId(_id) }, obj);
                if (update && update.nModified !== 0) {
                    UpdateUserName({ userId, _id: _id });
                    return res.status(200).json({ status: 1, response: 'Questions updated successfully ' });
                } else {
                    return res.status(200).json({ status: 0, response: 'Questions not updated' });
                }
            } else {
                obj['time_Stamps'] = +new Date();
                let insert = await questionsChema.insertMany([...Array.of(obj)]);
                if (insert && insert.length > 0) {
                    UpdateUserName({ userId, _id: insert[0]._id });
                    return res.status(200).json({ status: 1, response: 'Questions inserted successfully ' });
                } else {
                    return res.status(200).json({ status: 0, response: 'Questions not inserted' });
                }
            }
        } catch (error) {
            console.log(`error const addQuestions in ${error}`);
            return res.status(500).json({ status: 0, response: error });
        }
    };

    let editGetQuestions = async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let { loginId: userId = '' } = req.params, { _id = '' } = req.query;
            if (!isObjectId(userId)) {
                return res.status(200).json({ status: '00', response: 'User id required' });
            }
            if (!isObjectId(_id)) {
                return res.status(400).json({ status: 0, response: 'Id is required' });
            }
            return res.status(200).json({ status: 1, response: await questionsChema.findOne({ _id: ObjectId(_id), userId: ObjectId(userId) }, '_id name status options') })
        } catch (error) {
            console.log(`error const editGetQuestions in ${error}`);
            return res.status(500).json({ status: 0, response: error });
        }
    };

    let deleteQuestion = async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let { loginId: userId = '' } = req.params, { _id = '' } = req.query;
            if (!isObjectId(userId)) {
                return res.status(200).json({ status: '00', response: 'User id required' });
            }
            if (!isObjectId(_id)) {
                return res.status(400).json({ status: 0, response: 'Id is required' });
            }
            let deleteData = await questionsChema.deleteOne({ _id: ObjectId(_id), userId: ObjectId(userId) });
            if (deleteData && deleteData.deletedCount !== 0) {
                return res.status(200).json({ status: 1, response: 'Question deleted successfully' });
            } else {
                return res.status(200).json({ status: 0, response: 'Question not deleted' });
            }
        } catch (error) {
            console.log(`error const deleteQuestion in ${error}`);
            return res.status(500).json({ status: 0, response: error });
        }
    };

    let listQuestion = async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let { skip = 0, limit = 10, filed = 'createdAt', order = -1, search = '' } = req.query,
                { loginId: userId = '' } = req.params, query = [], finalquery = [], withoutLimit = [];
            if (!isObjectId(userId)) {
                return res.status(200).json({ status: '00', response: 'Id is required' });
            }
            query.push({ $match: { userId: ObjectId(userId), status: { $in: [1, 2] } } });
            if (search) {
                query.push({ $match: { name: { $regex: search + '.*', $options: "si" } } });
            }
            withoutLimit = [...query];
            withoutLimit.push({ $count: 'overallcount' });
            query.push(
                { $sort: { [filed]: +order } },
                { $skip: +skip },
                { $limit: +limit },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        status: 1,
                        options: 1,
                        createdAt: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } }
                    }
                }
            );
            finalquery = [
                {
                    $facet: {
                        overallcount: withoutLimit,
                        result: query
                    }
                }
            ];
            let list = await questionsChema.aggregate(finalquery),
                overallcount = get(list, '0.overallcount.0.overallcount', 0),
                data = get(list, '0.result', []),
                datalength = data.length;
            return res.status(200).json({ status: 1, response: { overallcount, datalength, data } });
        } catch (error) {
            console.log(`error const listQuestion in ${error}`);
            return res.status(500).json({ status: 0, response: error });
        }
    };

    return { addQuestions, editGetQuestions, deleteQuestion, listQuestion, dashBoardCount };
};