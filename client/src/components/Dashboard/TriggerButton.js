import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import { message } from 'antd';
import 'antd/dist/antd.css';
import './TriggerButton.css'

class TriggerButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theinput: '',
            theinput2: '',
            timer: '',
            placeholder1: '',
            placeholder2: '',
            opspot: false,
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        const name = e.target.name;
        const type = e.target.type;
        const value = type === 'checkbox' ? e.target.checked : e.target.value;

        this.setState({
            [name]: value
        });
    }
    getContent = () => {
        var widget = document.getElementById("slct").value;
        var type = document.getElementById("slct1").value;
        var type2 = document.getElementById("slct2").value;
        var inputcont = document.getElementById("inputcont").value;
        var inputcont2 = document.getElementById("inputcont2").value
        var inputtimer = document.getElementById("inputtimer").value;

        // console.log(widget)
        // console.log(type)
        // console.log(type2)
        // console.log(inputcont)
        // console.log(inputcont2)
        // console.log(inputtimer)

        if (widget == 1) {
            if (type == 1) {
                // Artist best songs
                return ({ service: "Spotify", widget: 1, input1: inputcont, input2: '', timer: inputtimer })
            } else if (type == 2) {
                // Artist followers
                return ({ service: "Spotify", widget: 2, input1: inputcont, input2: '', timer: inputtimer })
            } else if (type == 3) {
                // Artist album
                return ({ service: "Spotify", widget: 3, input1: inputcont, input2: '', timer: inputtimer })
            } else {
                message.error("ERROR")
                return ({ service: "CoinMarketCap", widget: 'error', input1: 'error', input2: 'error', timer: 'error' })
            }
        } else if (widget == 2) {
            if (type2 == 1) {
                // Get Coin value
                return ({ service: "CoinMarketCap", widget: 1, input1: inputcont, input2: inputcont2, timer: inputtimer })
            } else if (type2 == 2) {
                // Top Coins
                return ({ service: "CoinMarketCap", widget: 2, input1: inputcont, input2: inputcont2, timer: inputtimer })
            } else {
                message.error("ERROR")
                return ({ service: "CoinMarketCap", widget: 'error', input1: 'error', input2: 'error', timer: 'error' })
            }
        } else if (widget == 3) {
            return ({ service: "Weather", widget: 0, input1: inputcont, input2: '', timer: inputtimer })
        } else {
            message.error("ERROR")
        }
    }

    checkBeforeLaunch = () => {
        var widget = document.getElementById("slct").value;
        var type = document.getElementById("slct1").value;
        var type2 = document.getElementById("slct2").value;
        var inputcont = document.getElementById("inputcont").value;
        var inputcont2 = document.getElementById("inputcont2").value
        var inputtimer = document.getElementById("inputtimer").value;

        if (widget == 1) {
            if (type == 1) {
                if (inputtimer <= 0)
                    message.error('Timer is too short');
                else if (inputcont && inputtimer)
                    this.props.addAcard(this.getContent())
                else
                    message.error("Fields are empty");
            } else if (type == 2) {
                if (inputtimer <= 0)
                    message.error('Timer is too short');
                else if (inputcont && inputtimer)
                    this.props.addAcard(this.getContent())
                else
                    message.error("Fields are empty");
            } else if (type == 3) {
                if (inputtimer <= 0)
                    message.error('Timer is too short');
                else if (inputcont && inputtimer)
                    this.props.addAcard(this.getContent())
                else
                    message.error('Fields are empty')
            } else
                message.error('Error');
        } else if (widget == 2) {
            if (type2 == 1) {
                if (inputtimer <= 0)
                    message.error('Timer is too short');
                else if (inputcont && inputcont2 && inputtimer)
                    this.props.addAcard(this.getContent());
                else
                    message.error('Fields are empty')
            } else if (type2 == 2) {
                if (inputcont <= 0) {
                    message.error('List as too be greater than 0')
                } else if (inputcont > 10) {
                    message.error('List as too be less than 10')
                } else if (inputcont > 0 && inputcont <= 10) {
                    if (inputtimer <= 0)
                        message.error('Timer is too short');
                    else if (inputcont && inputcont2 && inputtimer)
                        this.props.addAcard(this.getContent());
                    else
                        message.error('Fields are empty')
                } else {
                    message.error('List need to be a number')
                }
            } else
                message.error('Error');
        } else if (widget == 3) {
            if (inputtimer <= 0)
                message.error('Timer is too short');
            else if (inputcont && inputtimer)
                this.props.addAcard(this.getContent());
            else
                message.error('Fields are empty')
        } else {
            message.error('Error')
        }
    }
    logToSpotify = () => {
        window.open('http://localhost:8080/api/spotify/call');
        this.setState({opspot: true})
    }

    selectIsChanging = () => {
        var e = document.getElementById("slct");
        var elemval = e.value;
        if (elemval == 1) {
            document.getElementById("tselect1").style.visibility = "initial";
            document.getElementById("tselect2").style.visibility = "hidden";
            document.getElementById("theinput").style.visibility = "hidden";
            document.getElementById("theinput2").style.visibility = "hidden";
            document.getElementById("timer").style.visibility = "hidden";
            document.getElementById("btnspot").style.visibility = "initial";
            document.getElementById("addbn").style.visibility = "hidden";
        } else if (elemval == 2) {
            document.getElementById("tselect1").style.visibility = "hidden";
            document.getElementById("tselect2").style.visibility = "initial";
            document.getElementById("theinput").style.visibility = "hidden";
            document.getElementById("theinput2").style.visibility = "hidden";
            document.getElementById("timer").style.visibility = "hidden";
            document.getElementById("btnspot").style.visibility = "hidden";
            document.getElementById("addbn").style.visibility = "hidden";
        } else if (elemval == 3) {
            document.getElementById("tselect1").style.visibility = "hidden";
            document.getElementById("tselect2").style.visibility = "hidden";
            document.getElementById("theinput").style.visibility = "initial";
            document.getElementById("theinput2").style.visibility = "hidden";
            document.getElementById("timer").style.visibility = "initial";
            document.getElementById("btnspot").style.visibility = "hidden";
            document.getElementById("addbn").style.visibility = "initial";
            this.setState({placeholder1: 'Town'})
        } else {
            document.getElementById("theinput").style.visibility = "hidden";
            document.getElementById("theinput2").style.visibility = "hidden";
            document.getElementById("timer").style.visibility = "hidden";
            document.getElementById("btnspot").style.visibility = "hidden";
            document.getElementById("addbn").style.visibility = "hidden";
        }
    }

    selectIsChanging1 = () => {
        var e = document.getElementById("slct1");
        var elemval = e.value;

        if (elemval == 1) {
            document.getElementById("theinput").style.visibility = "initial";
            document.getElementById("theinput2").style.visibility = "hidden";
            document.getElementById("timer").style.visibility = "initial";
            // if (this.state.opspot == true) {
                document.getElementById("addbn").style.visibility = "initial";
            // } else {
            //     document.getElementById("addbn").style.visibility = "hidden";
            // }
            this.setState({ placeholder1: 'Artist'})
        } else if (elemval == 2) {
            document.getElementById("theinput").style.visibility = "initial";
            document.getElementById("theinput2").style.visibility = "hidden";
            document.getElementById("timer").style.visibility = "initial";
            // if (this.state.opspot == true) {
                document.getElementById("addbn").style.visibility = "initial";
            // } else {
            //     document.getElementById("addbn").style.visibility = "hidden";
            // }
            this.setState({ placeholder1: 'Artist' })
        } else if (elemval == 3) {
            document.getElementById("theinput").style.visibility = "initial";
            document.getElementById("theinput2").style.visibility = "hidden";
            document.getElementById("timer").style.visibility = "initial";
            // if (this.state.opspot == true) {
                document.getElementById("addbn").style.visibility = "initial";
            // } else {
            //     document.getElementById("addbn").style.visibility = "hidden";
            // }
            this.setState({ placeholder1: 'Artist' })
        } else {
            document.getElementById("theinput").style.visibility = "hidden";
            document.getElementById("theinput2").style.visibility = "hidden";
            document.getElementById("timer").style.visibility = "hidden";
            document.getElementById("addbn").style.visibility = "hidden";
        }
    }

    selectIsChanging2 = () => {
        var e = document.getElementById("slct2");
        var elemval = e.value;
        if (elemval == 1) {
            document.getElementById("theinput").style.visibility = "initial";
            document.getElementById("theinput2").style.visibility = "initial";
            document.getElementById("timer").style.visibility = "initial";
            document.getElementById("addbn").style.visibility = "initial";
            this.setState({ placeholder1: 'Coin', placeholder2: 'Currency' })
        } else if (elemval == 2) {
            document.getElementById("theinput").style.visibility = "initial";
            document.getElementById("theinput2").style.visibility = "initial";
            document.getElementById("timer").style.visibility = "initial";
            document.getElementById("addbn").style.visibility = "initial";
            this.setState({ placeholder1: 'How many coin to show', placeholder2: 'Currency' })
        } else {
            document.getElementById("theinput").style.visibility = "hidden";
            document.getElementById("theinput2").style.visibility = "hidden";
            document.getElementById("timer").style.visibility = "hidden";
            document.getElementById("addbn").style.visibility = "hidden";
        }
    }
    render() {
        return (
            <Popup trigger={<button className="add-btn">Add Service</button>} modal nested >
                {close => (
                    <div className="modal">
                        <button className="close" onClick={close}>
                            &times;
                        </button>
                        <div className="header">Add a service</div>
                        <div className="select">
                            <select onChange={this.selectIsChanging} className="slct" id="slct">
                                <option defaultValue="0">Choose a Widget</option>
                                <option value="1">Spotify</option>
                                <option value="2">CoinMarketCap</option>
                                <option value="3">WeatherMap</option>
                            </select>
                        </div>
                        <div className="select1" id="tselect1">
                            <select onChange={this.selectIsChanging1} className="slct" id="slct1">
                                <option defaultValue="0">Choose a Service</option>
                                <option value="1">Artist best songs</option>
                                <option value="2">Artist follower count</option>
                                <option value="3">Artist Album</option>
                            </select>
                        </div>
                        <div className="select2" id="tselect2">
                            <select onChange={this.selectIsChanging2} className="slct" id="slct2">
                                <option defaultValue="0">Choose a Service</option>
                                <option value="1">Get coin value</option>
                                <option value="2">List of Highest marketcap Coin</option>
                            </select>
                        </div>
                        <div className="content">
                            <div className="btnspot" id="btnspot">
                                <button className="btn-spot" onClick={() => this.logToSpotify()} type="submit">LOG TO SPOTIFY</button>
                            </div>
                            <div className="webflow-style-input" id="theinput">
                                <input type="text" value={this.state.theinput} onChange={this.handleChange} name="theinput" placeholder={this.state.placeholder1} id="inputcont"/>
                            </div>
                            <div className="webflow-style-input" id="theinput2">
                                <input type="text" value={this.state.theinput2} onChange={this.handleChange} name="theinput2" placeholder={this.state.placeholder2} id="inputcont2"/>
                            </div>
                            <div className="webflow-style-input" id="timer">
                                <input type="number" value={this.state.timer} onChange={this.handleChange} name="timer" placeholder="Refresh timer (in seconds)" id="inputtimer"/>
                            </div>
                        </div>
                        <div className="serviceadd" id="addbn">
                            <button className="btn-addwid" onClick={this.checkBeforeLaunch} type="submit">Add the service</button>
                        </div>
                    </div>
                )}
            </Popup>
        );
    }
}

export default TriggerButton;