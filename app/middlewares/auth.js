module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/login');
    },
    ensureRole: function(role) {
      return function(req, res, next) {
        if (req.isAuthenticated() && req.user.role === role) {
          return next();
        }
        res.status(403).send('Access denied');
      };
    }
  };