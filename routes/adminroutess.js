module.exports = () => {
    let express = require('express'),
        AdminRoutes = express.Router(),
        UserRoutes = require('../routes/user/userRoutes')(),
        questionsRoutes = require('../routes/user/questions/questionsroutes')();

    AdminRoutes.use('/user/questions', questionsRoutes);

    AdminRoutes.use('/user', UserRoutes);
    return AdminRoutes;
};