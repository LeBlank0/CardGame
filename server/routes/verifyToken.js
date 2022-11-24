const User = require('../model/User');

module.exports = function(req, res, next) {
    if (!req.cookies) return res.status(401).send('Access denied');
    try {
        let cookie = req.cookies.jwtcookie.split('.')[1];
        cookie = Buffer.from(cookie, 'base64').toString('ascii');
        cookie = JSON.parse(cookie)._id;
        const user = User.findOne({ _id: cookie });
        next();
    } catch (err) {
        return res.status(400).send('Invalid token');
    }
}
