const express = require('express');
const { registerUser } = require('./register');
const app = express();
let port = 3000;

app.use(express.json());

app.get('', (req, res) => {
    console.log(`${new Date().toJSON()} - index - Get method called`);
    res.send(`all is okay go ahead-------------------`);
})
app.post('/register', async (req, res) => {
    console.log(`${new Date().toJSON()} - index - new user come for registration`);
    let result = await registerUser(req)
    console.log(`${new Date().toJSON()} - index - ${JSON.stringify(result)}`);
    res.status(result.code).json(result.res);
})

app.get('/view-loan/:loan_id', (req, res) => {
    console.log(`${new Date().toJSON()} - index - show loan details`);
    res.send('see loan details');
})

app.get('/view-statement/:customer_id/:loan_id', (req, res) => {
    console.log(`${new Date().toJSON()} - index - new user come for registration`);
    res.send('show ')
})

app.get(`/make-payment/:customer_id/:loan_id`, (req, res) => {
    console.log(`${new Date().toJSON()} - index - new user come for registration`);
    res.send('make a payment');
})

app.get('/check-eligibility', (req, res) => {
    console.log(`${new Date().toJSON()} - index - new user come for registration`);
    res.send('check eligiblity');
})

app.get('/create-loan', (req, res) => {
    console.log(`${new Date().toJSON()} - index - new user come for registration`);
    res.send('credit loan');
})

app.listen(port, () => {
    console.log(`${new Date().toJSON()} - Server is running at http://localhost:${port}`)
})
