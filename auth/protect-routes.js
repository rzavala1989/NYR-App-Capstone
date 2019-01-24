module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', "Not Authorized without being logged in");
        res.redirect("./users/login");
        
    }
}