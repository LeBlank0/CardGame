import React, { Component, useState } from 'react';
import Axios from "axios";
import { Link, Redirect, Route } from "react-router-dom";
import './Register.css';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
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
            url: "http://localhost:8080/api/user/register",
            data: {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            }
        }).then(
            (res) => {
                if (res.data.user) {
                    document.getElementById("resultRegister").innerHTML = 'Your account has been successfully created now you can login to your account'
                    document.getElementById("resultRegister").style.color = "green"
                    this.props.history.push('/login')
                    // window.location.reload()
                } else {
                    document.getElementById("resultRegister").innerHTML = 'There was an error while creating your account'
                    document.getElementById("resultRegister").style.color = "red"
                }
            }, (error) => {
                document.getElementById("resultRegister").innerHTML = 'There was an error while creating your account'
                document.getElementById("resultRegister").style.color = "red"
            }
        );
        e.preventDefault();
    }

    goToLogin = () => {
        this.props.history.push('/login');
        window.location.reload();
    }

    render() {
        return (
            <div>
                <div className="topbutton">
                    <button className="btn-2" onClick={() => this.goToLogin()} type="submit">Login</button>
                </div>
                <div className="bRegister">
                    <div className="top1"></div>
                    <form onSubmit={this.handleSubmit}>
                        <div className="webflow-style-input">
                            <input type="text" value={this.state.name} onChange={this.handleChange} name="name" placeholder="Name" />
                        </div>
                        <div className="webflow-style-input">
                            <input type="text" value={this.state.email} onChange={this.handleChange} name="email" placeholder="Email" />
                        </div>
                        <div className="webflow-style-input">
                            <input type="password" value={this.state.password} onChange={this.handleChange} name="password" placeholder="Password" />
                        </div>
                        <p id="resultRegister"> </p>
                        <button className="btn-1" type="submit">Register</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;
