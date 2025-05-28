const appError = require("../utils/appError");


module.exports = (req, res, next) => {

    // check if user is admin or tour-leader

    if (
      !req.user || (req.user.role !== 'admin' && req.user.role !== 'lead-guide')
    ) {
      return next(
        new appError('You do not have permission to perform this action', 403)
      );
    }
    next()
}

