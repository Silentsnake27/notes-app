const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Inicie sesión antes de continuar');
    res.redirect('/users/login');
};

module.exports = helpers;