import React, { Component } from 'react'
import GoogleLogin from 'react-google-login';

function Login() {

    const responseGoogle = (response) => {
        console.log(response);
    }
    return (
        <GoogleLogin
            clientId="718990108790-il6qfr68ffivhvdbpte6l1f6m77lvt7e.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
        />
    );
}


export default Login
