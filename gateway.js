const express = require('express');
const app = express()

//USE PROXY SERVER TO REDIRECT THE INCOMMING REQUEST
const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer();

const jwt = require('jsonwebtoken')
const JWT_SECRETE = "347186591486#^%%ABCF*##GHE"

function authToken(req, res, next) {
    console.log(req.headers.authorization)
    const header = req?.headers.authorization;
    const token = header && header.split(' ')[1];

    if (token == null) return res.status(401).json("Please send token");

    jwt.verify(token, JWT_SECRETE, (err, user) => {
        if (err) return res.status(403).json("Invalid token", err);
        req.user = user;
        next()
    })
}

function authRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json("Unauthorized");
        }
        next();
    }
}

//REDIRECT TO THE REGISTRATION MICROSERVICE

app.use('/reg', (req, res) => {
    console.log("INSIDE API GATEWAY REGISTRATION ROUTE")
    proxy.web(req, res, { target: 'http://localhost:5001' });
})


//REDIRECT TO THE LOGIN(Authentication) MICROSERVICE
app.use('/auth', (req, res) => {
    console.log("INSIDE API GATEWAY LOGIN ROUTE")
    proxy.web(req, res, { target: 'http://localhost:5002' });
})

//REDIRECT TO Personal Account Microservice 
app.use('/indv',authToken, authRole('person'),(req, res) => {
    console.log("INSIDE Individual ROUTE")
    proxy.web(req, res, { target: 'http://localhost:5003' });
})

//REDIRECT TO Group Account MICROSERVICE
app.use('/group',authToken, authRole('group'), (req, res) => {
    console.log("INSIDE Group ROUTE")
    proxy.web(req, res, { target: 'http://localhost:5004' });
})

app.listen(4000, () => {
    console.log("API Gateway Service is running on PORT NO : 4000")
})