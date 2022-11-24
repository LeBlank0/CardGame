import React, { Component } from 'react';
import Axios from "axios";
import './Dashboard.css';
import TriggerButton from './TriggerButton'
import SquareBox from './SquareBox'

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dico: [],
            arrayCard: [],
            id: 0
        };
        this.handleClick = this.handleClick.bind(this);
    }

    deconnectWala = () => {
        document.cookie = "jwtcookie=";
        this.props.history.push('/login')
        window.location.reload()
    }

    handleClick(param) {
        let array = this.state.arrayCard
        let dd = this.state.dico
        let index = array.indexOf(param);
        array.splice(index, 1);
        dd.splice(index, 1);
        this.setState({ arrayCard: array, dico: dd })
    }

    addAcard = (content) => {
        let array = this.state.arrayCard;
        let dd = this.state.dico;
        array.push(this.state.id)
        dd.push(content)
        console.log(dd)
        this.setState({ id: this.state.id + 1, arrayCard: array, dico: dd})
    }

    fixBug = (card) => {
        console.log("asdasd")
        console.log(card)
        console.log(this.state.dico.length)
        // if (card)
        return this.state.dico[card];
    }

    render() {
        return (
            <div>
                <div className="topbutton">
                    <button className="btn-3" onClick={() => this.deconnectWala()} type="submit">Logout</button>
                </div>
                <div className="bDashboard">
                    <div className="placeSquareBoxHere">
                        {
                            this.state.arrayCard.map((card) => (
                                <SquareBox key={card} id={card} thedico={this.state.dico[card]} handleClick={() => this.handleClick(card)} />
                            ))
                        }
                    </div>
                </div>
                <div className="addWidButton">
                    <TriggerButton addAcard={this.addAcard} />
                </div>
            </div>
        );
    }
}

export default Dashboard;
