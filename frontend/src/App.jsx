import React, { Component } from 'react';
import { Auth0Lock } from 'auth0-lock';
import './App.css';
import Config from './config/credentials'

class App extends Component {

    constructor() {
        super();

        const lock = new Auth0Lock(
            Config.client_id, Config.domain
        );

        this.state = {
            accessToken: null,
            profile: null
        }
        this.lock = lock;
        this.lock.on('authenticated', this.onAuthentication)
    }

    componentWillMount() {
        const accessToken = localStorage.getItem('accessToken');
        const profile = localStorage.getItem('profile');

        if (accessToken && profile) {

            this.setState({
                accessToken: accessToken,
                profile: JSON.parse(profile)
            });

        }

    }

    onAuthentication = (authResult) => {
        const { accessToken } = authResult
        this.lock.getUserInfo(accessToken, (error, profile) => {

            if (error) {
                console.error(error);
                return;
            }

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('profile', JSON.stringify(profile));

            this.setState({
                accessToken, profile
            });
        });

    }

    showLogin = () => {
        this.lock.show();
    }

    clearState = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('profile');
        this.setState({ accessToken: null, profile: null });
    }

    logout = () => {
        this.clearState()
        this.lock.logout();

    }

    render() {
        const {profile} = this.state
        return (
            <div className="App">
                <header className="App-header">
                    {this.state.accessToken ? (<div><p>{profile.name} is logged in</p><button onClick={this.logout}>Logout</button></div>) : (<div><p>User is not logged in</p><button onClick={this.showLogin}>Login</button></div>)}
                </header>
            </div >
        );
    }
}

export default App;
