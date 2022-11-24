const router = require('express').Router();
const request = require('request');

router.get('/about.json', (req, res) => {
    const options = {
        url: 'https://api.ipify.org?format=json',
    };
    function callback(err, response, body) {
        if (err) {
            return (err);
        }
        let ret = JSON.parse(body);
        let ip = ret.ip;
        return res.status(200).json({
            client:  {
                host: ip
            },
            server:  {
                current_time: Date.now(),
                services: [{
                    name: "spotify",
                    widgets: [{
                        name: "artist_top",
                        description: "Display the artist's top 10 song.",
                        params: [{
                            name: "artist",
                            type: "string"
                        }]
                    }, {
                        name: "artist_follower",
                        description: "Display the artist's follower count.",
                        params: [{
                            name: "artist",
                            type: "string"
                        }]
                    }, {
                        name: "albums",
                        description: "Display the artist's albums.",
                        params: [{
                            name: "artist",
                            type: "string"
                        }]
                    }]
                }, {
                    name: "coinmarketcap",
                    widgets: [{
                        name: "coin",
                        description: "Display a coin value.",
                        params: [{
                            name: "sym",
                            type: "string"
                        }, {
                            name: "con",
                            type: "string"
                        }]
                    }, {
                        name: "top",
                        description: "Display the top n coin.",
                        params: [{
                            name: "max",
                            type: "integer"
                        }, {
                            name: "con",
                            type: "string"
                        }]
                    }]
                }, {
                    name: "weather",
                    widgets: [{
                        name: "city",
                        description: "Display the city weather.",
                        params: [{
                            name: "city",
                            type: "integer"
                        }]
                    }]
                }]
            }
        })
    }
    request(options, callback);
});


module.exports = router;