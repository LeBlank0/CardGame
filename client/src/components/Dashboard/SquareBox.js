import React, { Component } from 'react';
import Axios from "axios";
import './SquareBox.css'
import axios from 'axios';

class SquareBox extends Component {
    signal = axios.CancelToken.source();

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            key: this.props.id,
            dico: this.props.thedico,
            interval: '',
            content: '',
            numtab: [],
            spotartist_tracksname: [],
            spotartist_tracksduration: [],
            spotartist_tracksurl: [],
            spotfollow_name: '',
            spotfollow_url: '',
            spotfollow_followers: '',
            spotfollow_img: '',
            spotalbum_name: [],
            spotalbum_urls: [],
            spotalbum_img: [],
            spotalbum_date: [],
            cmccoin_rank: '',
            cmccoin_name: '',
            cmccoin_price: '',
            cmccoin_change24: '',
            cmctop_name: [],
            cmctop_cmcrank: [],
            cmctop_price: [],
            cmctop_change24: [],
            weather_town: '',
            weather_country: '',
            weather_temp: '',
            weather_weather: '',
            weather_weather_more: '',
            weather_wind: ''
        };
    }

    componentDidMount() {
        console.log(this.state.key)
        console.log(this.state.dico)
        this.setState({ interval: this.state.dico.timer})
        this.waitUntil();
    }
    componentWillUnmount() {
        this.signal.cancel('Api is being canceled');
        clearInterval(this.state.interval);
    }
    checkWidandService() {
        if (this.state.dico.service == "Spotify") {
            if (this.state.dico.widget == 1) {
                this.getSPOTIFYartist(this.state.dico.input1)
            } else if (this.state.dico.widget == 2) {
                this.getSPOTIFYfollowers(this.state.dico.input1)
            } else if (this.state.dico.widget == 3) {
                this.getSPOTIFYalbum(this.state.dico.input1)
            }
        } else if (this.state.dico.service == "CoinMarketCap") {
            if (this.state.dico.widget == 1) {
                this.getCMCcoin(this.state.dico.input1, this.state.dico.input2)
            } else if (this.state.dico.widget == 2) {
                this.getCMCtop(this.state.dico.input1, this.state.dico.input2)
            }
        } else if (this.state.dico.service == "Weather") {
            this.getWEATHER(this.state.dico.input1)
        }
    }
    waitUntil = async() => {
        try {
            this.checkWidandService();
            this.state.interval = setInterval(() => {
                this.checkWidandService();
            }, this.state.dico.timer * 1000);
        } catch (error) {
            if (axios.isCancel(err)) {
                console.log('Error: ', err.message); // => prints: Api is being canceled
            } else {
                this.setState({ isLoading: false });
            }
        }
    }

    getSPOTIFYartist = (artist) => {
        try {
        Axios.get("http://localhost:8080/api/spotify/artist_top?artist=" + artist, { withCredentials: true, cancelToken: this.signal.token })
            .then(
                (res) => {
                    if (res.data) {
                        if (res.data.tracks[0].name) {
                            var tracktab = []
                            var durationtab = []
                            var urltab = []
                            var atab = []
                            var index = 0
                            res.data.tracks.forEach(element => {
                                tracktab.push(element.name)
                                urltab.push(element.external_urls.spotify)
                                atab.push(index);
                                index++
                                var mins = ~~(((element.duration_ms) / 1000 % 3600) / 60);
                                var secs = ~~((element.duration_ms) / 1000) % 60;
                                var ret = "";
                                ret += "" + mins + ":" + (secs < 10 ? "0" : "");
                                ret += "" + secs;
                                durationtab.push(ret)
                            });
                            this.setState({ spotartist_tracksduration: durationtab, spotartist_tracksurl: urltab, spotartist_tracksname: tracktab, content: "good", numtab: atab})
                        } else {
                            this.setState({ content: "error" })
                        }
                    }
                }, (error) => {
                    this.setState({ content: "error" })
                }
            );
        } catch (error) {
            throw error;
        }
    }
    getSPOTIFYfollowers = (artist) => {
        Axios.get("http://localhost:8080/api/spotify/artist_follower?artist=" + artist, { withCredentials: true, cancelToken: this.signal.token })
        .then(
            (res) => {
                if (res.data) {
                    if (res.data.name) {
                        this.setState({ spotfollow_followers: res.data.followers.total, spotfollow_img: res.data.images[0].url, spotfollow_name: res.data.name, spotfollow_url: res.data.external_urls.spotify, content: "good" })
                    } else {
                        this.setState({ content: "error" })
                    }
                }
            }, (error) => {
                this.setState({ content: "error" })
            }
        );
    }
    getSPOTIFYalbum = (artist) => {
        try {
            Axios.get("http://localhost:8080/api/spotify/albums?artist=" + artist, { withCredentials: true, cancelToken: this.signal.token })
            .then(
                (res) => {
                    if (res.data) {
                        console.log(res.data)
                        if (res.data.items[0].name) {
                            var spotalbum_date = [];
                            var spotalbum_img = [];
                            var spotalbum_name = [];
                            var spotalbum_urls = [];
                            var atab = [];
                            var index = 0

                            res.data.items.forEach(element => {
                                if (element.album_type == "album") {
                                    spotalbum_name.push(element.name)
                                    spotalbum_date.push(element.release_date)
                                    spotalbum_img.push(element.images[1].url)
                                    spotalbum_urls.push(element.external_urls.spotify)
                                    atab.push(index)
                                    index++
                                }
                            });
                            this.setState({ spotalbum_date: spotalbum_date, spotalbum_img: spotalbum_img, spotalbum_name: spotalbum_name, spotalbum_urls: spotalbum_urls, numtab: atab,content: "good" })
                        } else {
                            this.setState({ content: "error" })
                        }
                    }
                }, (error) => {
                    this.setState({ content: "error" })
                }
            );
        } catch(error) {
            throw error;
        }
    }
    getCMCcoin = (coin, currency) => {
        try {
            Axios.get("http://localhost:8080/api/cmc/coin?sym=" + coin + "&con=" + currency, { withCredentials: true, cancelToken: this.signal.token })
            .then(
                (res) => {
                    if (res.data.status.error_code == 0) {
                        var tmp = res.data.data[Object.keys(res.data.data)[0]].quote
                        this.setState({ cmccoin_change24: tmp[Object.keys(tmp)[0]].percent_change_24h.toFixed(2), cmccoin_price: tmp[Object.keys(tmp)[0]].price.toFixed(2), cmccoin_name: res.data.data[Object.keys(res.data.data)[0]].name, cmccoin_rank: res.data.data[Object.keys(res.data.data)[0]].cmc_rank, content: "good"})
                    } else {
                        this.setState({ content: "error" })
                    }
                }, (error) => {
                    this.setState({ content: "error" })
                }
            );
        } catch(error) {
            throw error;
        }
    }
    getCMCtop = (limit, currency) => {
        try {
            Axios.get("http://localhost:8080/api/cmc/top?max=" + limit + "&con=" + currency, { withCredentials: true, cancelToken: this.signal.token })
            .then(
                (res) => {
                    if (res.data.status.error_code == 0) {
                        var nametab = [];
                        var ranktab = [];
                        var pricetab = [];
                        var changetab = [];
                        var atab = [];
                        for (let index = 0; index < limit; index++) {
                            atab.push(index);
                        }
                        res.data.data.forEach(element => {
                            nametab.push(element.name)
                            ranktab.push(element.cmc_rank)
                            pricetab.push((element.quote[Object.keys(element.quote)[0]].price).toFixed(2))
                            if ((element.quote[Object.keys(element.quote)[0]].percent_change_24h) > 0) {
                                let asd = (element.quote[Object.keys(element.quote)[0]].percent_change_24h).toFixed(2);
                                changetab.push((element.quote[Object.keys(element.quote)[0]].percent_change_24h).toFixed(2))
                            } else {
                                changetab.push((element.quote[Object.keys(element.quote)[0]].percent_change_24h).toFixed(2))
                            }
                        });
                        this.setState({ cmctop_change24: changetab, cmctop_cmcrank: ranktab, cmctop_name: nametab, cmctop_price: pricetab, content: "good", numtab: atab})
                    } else {
                        this.setState({ content: "error" })
                    }
                }, (error) => {
                    this.setState({ content: "error" })
                }
            );
        } catch(error) {
            throw error;
        }
    }
    getWEATHER = (town) => {
        try {
            Axios.get("http://localhost:8080/api/weather/city?city=" + town, { withCredentials: true, cancelToken: this.signal.token })
            .then(
                (res) => {
                    if (res.data) {
                        if (res.data.name) {
                            this.setState({ weather_town: res.data.name, weather_country: res.data.sys.country, weather_temp: (res.data.main.temp - 273).toFixed(2), weather_weather: res.data.weather[0].main, weather_weather_more: res.data.weather[0].description, weather_wind: res.data.wind.speed, content: "good"})
                        } else {
                            this.setState({ content: "error" })
                        }
                    }
                }, (error) => {
                    this.setState({ content: "error" })
                }
            );
        } catch (error) {
            throw error;
        }
    }
    render() {
        function ShowContent(props) {
            if (props.state.dico.service == "Spotify" && props.state.dico.widget == 1) {
                if (props.state.content != "good") {
                    return (
                        <div>
                            <p>Wrong Parameters</p>
                        </div>
                    )
                } else {
                    return (
                        <div className="spotifytab">
                            <h1 className="spotbigname">{props.state.dico.input1} Best Songs</h1>
                            <ol className="customlistspot">
                                {
                                    props.state.numtab.map((card) => (
                                        <li href={props.state.spotartist_tracksurl[card]}>{props.state.spotartist_tracksname[card]} ({props.state.spotartist_tracksduration[card]})</li>
                                    ))
                                }
                            </ol>
                        </div>
                    )
                }
            } else if (props.state.dico.service == "Spotify" && props.state.dico.widget == 2) {
                if (props.state.content != "good") {
                    return (
                        <div>
                            <p>Wrong Parameters</p>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            {
                                <div className="spotifytab">
                                    <div className="alignimg">
                                        <img className="imgartist" src={props.state.spotfollow_img} alt="imgartist"/>
                                    </div>
                                    <div className="spotbigname">
                                        <a href={props.state.spotfollow_url}>{props.state.spotfollow_name}</a>
                                    </div>
                                    <p className="spotfollowers">{props.state.spotfollow_followers} Followers</p>
                                </div>
                            }
                        </div>
                    )
                }
            } else if (props.state.dico.service == "Spotify" && props.state.dico.widget == 3) {
                if (props.state.content != "good") {
                    return (
                        <div>
                            <p>Wrong Parameters</p>
                        </div>
                    )
                } else {
                    return (
                        <div className="spotifytabalbum">
                            <div className="slideshow">
                                {
                                    props.state.numtab.map((card) => (
                                        <div className="images">
                                            <img className="album_cover" src={props.state.spotalbum_img[card]} /><br />
                                            <a className="albumname" href={props.state.spotalbum_urls[card]}>{props.state.spotalbum_name[card]}</a><br />
                                            <a className="albumdate">{props.state.spotalbum_date[card]}</a><br />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            } else if (props.state.dico.service == "CoinMarketCap" && props.state.dico.widget == 1) {
                if (props.state.content != "good") {
                    return (
                        <div>
                            <p>Wrong Parameters</p>
                        </div>
                    )
                } else {
                    if (props.state.cmccoin_change24 >= 0) {
                        var tmp = "+" + props.state.cmccoin_change24
                        return (
                            <div className="btc_coin_green">
                                {
                                    <p className="cmcbigname">{props.state.dico.input1} (#{props.state.cmccoin_rank})</p>
                                }
                                {
                                    <p className="cmcsubname">{props.state.cmccoin_name}</p>
                                }
                                {
                                    <p className="cmcprice">{props.state.cmccoin_price} {props.state.dico.input2}</p>
                                }
                                {
                                    <p className="cmcprice2">{tmp}% in 24h</p>
                                }
                            </div>
                        )
                    } else {
                        var tmp = props.state.cmccoin_change24
                        return (
                            <div className="btc_coin_red">
                                {
                                    <p className="cmcbigname">{props.state.dico.input1} (#{props.state.cmccoin_rank})</p>
                                }
                                {
                                    <p className="cmcsubname">{props.state.cmccoin_name}</p>
                                }
                                {
                                    <p className="cmcprice">{props.state.cmccoin_price} {props.state.dico.input2}</p>
                                }
                                {
                                    <p className="cmcprice2">{tmp}% in 24h</p>
                                }
                            </div>
                        )
                    }
                }
            } else if (props.state.dico.service == "CoinMarketCap" && props.state.dico.widget == 2) {
                if (props.state.content != "good") {
                    return (
                        <div>
                            <p>Wrong Parameters</p>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <h1 className="topnamelistcrypto">TOP {props.state.dico.input1} Crypto</h1>
                            <ol className="customlistcrypto">
                            {
                                props.state.numtab.map((card) => (
                                    <li><strong>{props.state.cmctop_name[card]}</strong> &nbsp;({props.state.cmctop_price[card]} {props.state.dico.input2}) {props.state.cmctop_change24[card]}%</li>
                                ))
                            }
                            </ol>
                        </div>
                    )
                }
            } else if (props.state.dico.service == "Weather") {
                if (props.state.content != "good") {
                    return (
                        <div>
                            <p>Wrong Parameters</p>
                        </div>
                    )
                } else {
                    return (
                        <div className="weathertab">
                            {
                                <div className="center">
                                    <p className="townname">{props.state.weather_town} ({props.state.weather_country})</p>
                                </div>
                            }
                            {
                                <div className="center">
                                    <p className="temperature">{props.state.weather_temp} °C</p>
                                </div>
                            }
                            {
                                <div className="center topalt">
                                    <p className="altname">{props.state.weather_weather} ({props.state.weather_weather_more})</p>
                                </div>
                            }
                        </div>
                    )
                }
            } else {
                return <p>ERROR</p>
            }
        }

        return (
            <div className="aroundsquareBox">
                <div className="topfucked"></div>
                <div className="squareBox">
                    {/* <div className="x small" onClick={() => this.props.handleClick(this.state.key)}><b></b><b></b><b></b><b></b></div> */}
                    <div className="squarecontent">
                        <ShowContent state={this.state}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default SquareBox;