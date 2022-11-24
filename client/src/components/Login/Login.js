import React, { Component } from 'react';
import Axios from "axios";
import { Link, Redirect, Route } from "react-router-dom";
import './Login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        const name = e.target.name;
        const type = e.target.type;
        const value = type === 'checkbox' ? e.target.checked : e.target.value;

        this.setState({
            [name]: value
        });
    }
    handleSubmit(e) {
        Axios({
            method: "POST",
            url: "http://localhost:8080/api/user/login",
            data: {
                email: this.state.email,
                password: this.state.password
            }
        }).then(
            (res) => {
                if (res.data) {
                    document.cookie = "jwtcookie=" + res.data;
                    this.props.history.push('/dashboard')
                    window.location.reload()
                } else {
                    document.getElementById("resultLogin").innerHTML = 'There was an error while login to your account'
                    document.getElementById("resultLogin").style.color = "red"
                }
            }, (error) => {
                document.getElementById("resultLogin").innerHTML = 'There was an error while login to your account'
                document.getElementById("resultLogin").style.color = "red"
            }
        );
        e.preventDefault();
    }

    goToRegister = () => {
        this.props.history.push('/register')
        window.location.reload()
    }

    render() {
        return (
            <div>
                <div className="topbutton">
                    <button className="btn-2" onClick={()=> this.goToRegister()} type="submit">Register</button>
                </div>
                <div className="bLogin">
                    <div className="top1"></div>
                    <form onSubmit={this.handleSubmit}>
                        <div className="webflow-style-input">
                            <input type="text" value={this.state.email} onChange={this.handleChange} name="email" placeholder="Email"/>
                        </div>
                        <div className="webflow-style-input">
                            <input type="password" value={this.state.password} onChange={this.handleChange} name="password" placeholder="Password" />
                        </div>
                        <p id="resultLogin"> </p>
                        <button className="btn-1" type="submit">Login</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;
