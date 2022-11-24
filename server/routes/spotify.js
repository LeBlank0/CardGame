const router = require('express').Router();
const fetch = require('node-fetch');
const request = require('request');
const { URLSearchParams } = require('url');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');

router.get('/call', (req, res) => {
    var scopes = 'user-read-private user-read-email user-read-currently-playing';
    res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + process.env.SPOT_ID +
    '&scope=' + scopes +
    '&redirect_uri=' + process.env.SPOT_REDIRECT);
});

router.get('/callback', async (req, res) => {
    if (!req.query || !req.query.code)
           return res.status(403).send({"error": true, "status": "Something went wrong"});
    let base64buffer = Buffer.from(process.env.SPOT_ID + ':' + process.env.SPOT_SECRET).toString('base64');
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", req.query.code);
    params.append("redirect_uri", process.env.SPOT_REDIRECT);
    var options = {
        'method': 'POST',
        'headers': {
            'Authorization': "Basic " + base64buffer
        },
        "body": params
    };
    let response = await fetch('https://accounts.spotify.com/api/token', options);
    let json = await response.json();
    const access = jwt.sign(json.access_token, process.env.TOKEN_SECRET);
    const refresh = jwt.sign(json.refresh_token, process.env.TOKEN_SECRET);
    if (!req.cookies || !req.cookies.jwtcookie) {
        let info = await getUserInfo(access)
        let user = await User.findOne({ email: info.email });
        if (user) {
            user.spotify.access = access;
            user.spotify.refresh = refresh;
        } else {
            user = new User({
                name: info.display_name,
                email: info.email,
                spotify: {
                    access: access,
                    refresh: refresh,
                }
            });
            await user.save();
        }
        user = await User.findOne({ email: info.email });
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.header('auth-token', token)
    } else {
        let cookie = req.cookies.jwtcookie.split('.')[1];
        cookie = Buffer.from(cookie, 'base64').toString('ascii');
        cookie = JSON.parse(cookie)._id;
        const user = await User.findOne({ _id: cookie });
        user.spotify.access = access;
        user.spotify.refresh = refresh;
        user.save();
    }
    return res.redirect('http://localhost:3000/dashboard');
});

async function getUserInfo(access_token) {
    let token = access_token.split('.')[1];
    token = Buffer.from(token, 'base64').toString('ascii');
    var options = {
        'method': 'GET',
        'headers': {
            'Authorization': "Bearer " + token
        }
    };
    let response = await fetch('https://api.spotify.com/v1/me', options);
    let json = await response.json();
    return json;
}

async function refresh(cookie) {
    const user = await User.findOne({ _id: cookie });
    let base64buffer = Buffer.from(process.env.SPOT_ID + ':' + process.env.SPOT_SECRET).toString('base64');
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", user.spotify.refresh);
    var options = {
        'method': 'POST',
        'headers': {
            'Authorization': "Basic " + base64buffer
        },
        "body": params
    };
    let response = await fetch('https://accounts.spotify.com/api/token', options);
    let json = await response.json();
    const access = jwt.sign(json.access_token, process.env.TOKEN_SECRET);
    const refresh = jwt.sign(json.refresh_token, process.env.TOKEN_SECRET);
    user.spotify.access = access;
    user.spotify.refresh = refresh;
    user.save();
};

router.get('/artist_top', async (req, res) => {
    if (!req.query || !req.cookies || !req.cookies.jwtcookie)
        return res.status(403).send({ "error": true, "status": "Something went wrong" });
    let cookie = req.cookies.jwtcookie.split('.')[1];
    cookie = Buffer.from(cookie, 'base64').toString('ascii');
    cookie = JSON.parse(cookie)._id;
    const user = await User.findOne({ _id: cookie });
    let token = user.spotify.access.split('.')[1];
    token = Buffer.from(token, 'base64').toString('ascii');
    const options1 = {
        url: 'https://api.spotify.com/v1/search',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        qs: {
            'q': req.query.artist,
            'type': 'artist',
            'limit': '1'
        },
    };
    function callback1(err, response, body) {
        if (JSON.parse(body).error) {
            return err;
        }
        if (err || JSON.parse(body).artists.total == 0) {
            return (err);
        }
        let id = JSON.parse(body).artists.items[0].id;
        const options2 = {
            url: 'https://api.spotify.com/v1/artists/' + id + '/top-tracks',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            qs: {
                'market': 'FR',
            },
        };
        function callback2(err2, response2, body2) {
            if (err2) {
                return (err2);
            }
            let ret = JSON.parse(body2);
            return (res.send(ret));
        }
        request(options2, callback2);
    }
    request(options1, callback1);
});

router.get('/artist_follower', async (req, res) => {
    if (!req.query || !req.cookies || !req.cookies.jwtcookie)
        return res.status(403).send({ "error": true, "status": "Something went wrong" });
    let cookie = req.cookies.jwtcookie.split('.')[1];
    cookie = Buffer.from(cookie, 'base64').toString('ascii');
    cookie = JSON.parse(cookie)._id;
    const user = await User.findOne({ _id: cookie });
    let token = user.spotify.access.split('.')[1];
    token = Buffer.from(token, 'base64').toString('ascii');
    const options1 = {
        url: 'https://api.spotify.com/v1/search',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        qs: {
            'q': req.query.artist,
            'type': 'artist',
            'limit': '1'
        },
    };
    function callback1(err, response, body) {
        if (JSON.parse(body).error) {
            return err;
        }
        if (err || JSON.parse(body).artists.total == 0) {
            return (err);
        }
        let id = JSON.parse(body).artists.items[0].id;
        const options2 = {
            url: 'https://api.spotify.com/v1/artists/' + id,
            headers: {
                'Authorization': 'Bearer ' + token
            },
        };
        function callback2(err2, response2, body2) {
            if (err2) {
                return (err2);
            }
            let ret = JSON.parse(body2);
            return (res.send(ret));
        }
        request(options2, callback2);
    }
    request(options1, callback1);
});

router.get('/albums', async (req, res) => {
    if (!req.query || !req.cookies || !req.cookies.jwtcookie)
        return res.status(403).send({ "error": true, "status": "Something went wrong" });
    let cookie = req.cookies.jwtcookie.split('.')[1];
    cookie = Buffer.from(cookie, 'base64').toString('ascii');
    cookie = JSON.parse(cookie)._id;
    const user = await User.findOne({ _id: cookie });
    let token = user.spotify.access.split('.')[1];
    token = Buffer.from(token, 'base64').toString('ascii');
    const options1 = {
        url: 'https://api.spotify.com/v1/search',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        qs: {
            'q': req.query.artist,
            'type': 'artist',
            'limit': '1'
        },
    };
    function callback1(err, response, body) {
        if (JSON.parse(body).error) {
            return err;
        }
        if (err || JSON.parse(body).artists.total == 0) {
            return (err);
        }
        let id = JSON.parse(body).artists.items[0].id;
        const options2 = {
            url: 'https://api.spotify.com/v1/artists/' + id + '/albums',
            headers: {
                'Authorization': 'Bearer ' + token
            },
        };
        function callback2(err2, response2, body2) {
            if (err2) {
                return (err2);
            }
            let ret = JSON.parse(body2);
            return (res.send(ret));
        }
        request(options2, callback2);
    }
    request(options1, callback1);
});

module.exports = router;