const router = require('express').Router();
const request = require('request');
const verify = require('./verifyToken');

router.get('/coin', verify, (req, res) => {
    const options = {
        url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
        headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_TOKEN
        },
        qs: {
            'symbol': req.query.sym,
            'convert': req.query.con
        },
        json: 'true'
    };
    function callback(err, response, body) {
        if (err) {
            return (err);
        }
        return (res.send(body));
    }
    request(options, callback);
});

router.get('/top', verify, (req, res) => {
    const options = {
        url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_TOKEN
        },
        qs: {
            'start': '1',
            'limit': req.query.max,
            'convert': req.query.con
        },
        json: 'true'
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