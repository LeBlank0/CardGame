const router = require('express').Router();
const request = require('request');
const verify = require('./verifyToken');

router.get('/city', verify, (req, res) => {
    const options = {
        url: 'https://api.openweathermap.org/data/2.5/weather',
        qs: {
            'q': req.query.city,
            'appid': process.env.WEATHER_TOKEN
        },
    };
    function callback(err, response, body) {
        if (err) {
            return (err);
        }
        return (res.send(body));
    }
    request(options, callback);
});

module.exports = router;