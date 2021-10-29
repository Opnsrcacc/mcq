module.exports = () => {
    let express = require('express'),
        questionRoutes = express.Router(),
        { check } = require('express-validator'),
        { verifyJwt } = require('../../../utills/commonfunction')(),
        { addQuestions, editGetQuestions, listQuestion, deleteQuestion, dashBoardCount } = require('./questioncontroller')();

    questionRoutes.get('/dashboard', verifyJwt, dashBoardCount);

    questionRoutes.post('/add',
        check('name').not().isEmpty().withMessage('Name is required'),
        check('options').not().isEmpty().isArray().withMessage('Choice is required'),
        check('status').not().isEmpty().withMessage('Status is required'),
        verifyJwt,
        addQuestions
    );

    questionRoutes.get('/edit',
        check('_id').not().isEmpty().withMessage('Id is required'),
        verifyJwt,
        editGetQuestions
    );

    questionRoutes.delete('/delete',
        check('_id').not().isEmpty().withMessage('Id is required'),
        verifyJwt,
        deleteQuestion
    );

    questionRoutes.get('/list', verifyJwt, listQuestion);

    return questionRoutes;
};