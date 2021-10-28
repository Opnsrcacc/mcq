module.exports = () => {
    let express = require('express'),
        { check } = require('express-validator'),
        { verifyJwt } = require('../../utills/commonfunction')(),
        userroutes = express.Router();
    let { addUsers, loginUser, LogOut } = require('./userController')();

    userroutes.post('/add',
        check('name').not().isEmpty().withMessage('Name is \required'),
        check('email').isEmail().not().isEmpty().withMessage('Email is \required'),
        addUsers);

    userroutes.post('/login',
        check('name').not().isEmpty().withMessage('Name'),
        check('password').not().isEmpty().withMessage('Password'),
        loginUser);

    userroutes.patch('/logout',
        verifyJwt,
        LogOut
    );
    return userroutes;
}