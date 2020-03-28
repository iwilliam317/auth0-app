import React, { Component } from 'react';
import { Auth0Lock } from 'auth0-lock';
import './App.css';

class App extends Component {



    constructor() {
        super();


        const lock = new Auth0Lock(
            'CLIENT_ID',
            'DOMAIN'
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

        this.lock.getUserInfo(authResult.accessToken, (error, profile) => {

            if (error) {
                console.error(error);
                return;
            }


            localStorage.setItem('accessToken', authResult.accessToken);
            localStorage.setItem('profile', JSON.stringify(profile));


            this.setState({
                accessToken: authResult.accessToken,
                profile: profile
            });
        });

    }

    showLogin = () => {

        this.lock.show();

    }

    logout = () => {

        // Clear the localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('profile');

        // Clean the state
        this.setState({ accessToken: null, profile: null });

        // Clear the Auth0 session then redirect back to the homepage
        this.lock.logout();

    }
    render() {
        return (
            <div className="App">
                <header className="App-header">

                    {
                        this.state.accessToken ?
                            (
                                // We're logged in
                                // Load the user's name and a logout button
                                <div>
                                    <p>
                                        {this.state.profile.name} is logged in
                  </p>
                                    <button onClick={this.logout}>Logout</button>
                                </div>
                            )
                            :
                            (
                                // We're not logged in yet
                                // Display the login button
                                <div>
                                    <p>
                                        User is not logged in
                  </p>
                                    <button onClick={this.showLogin}>Login</button>
                                </div>
                            )
                    }
                </header>
            </div >
        );
    }
}

export default App;
