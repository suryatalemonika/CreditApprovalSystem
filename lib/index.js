const express = require('express');
const register = require('./register');
const app = express();
let port = 3200;

app.get('',(req,res)=>{
    console.log(`${new Date().toJSON()} - index - Get method called`);
    res.send(`all is okay go ahead-------------------`);
})
app.get('/register',(req,res)=>{
    console.log(`${new Date().toJSON()} - index - new user come for registration`);
    res.send(`register`);
    register.registerUser('monika')
})

app.get('/view-loan/:loan_id',(req,res)=>{
    console.log(`${new Date().toJSON()} - index - show loan details`);
    res.send('see loan details');
})

app.get('/view-statement/:customer_id/:loan_id',(req,res)=>{
    console.log(`${new Date().toJSON()} - index - new user come for registration`);
    res.send('show ')
})

app.get(`/make-payment/:customer_id/:loan_id`,(req,res)=>{
    console.log(`${new Date().toJSON()} - index - new user come for registration`);
    res.send('make a payment');
})

app.get('/check-eligibility',(req,res)=>{
    console.log(`${new Date().toJSON()} - index - new user come for registration`);
    res.send('check eligiblity');
})

app.get('/create-loan',(req,res)=>{
    console.log(`${new Date().toJSON()} - index - new user come for registration`);
    res.send('credit loan');
})

app.listen(port,()=>{
    console.log(`${new Date().toJSON()} - App is running on port ${port}`)
})