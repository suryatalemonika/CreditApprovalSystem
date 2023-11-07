const express = require('express');
const app = express();
let port = 3000;

app.get('',(req,res)=>{
    console.log(`${new Date().toJSON()} - index - Get method called`);
    res.send(`all is okay go ahead`);
})
app.listen(port,()=>{
    console.log(`${new Date().toJSON()} - App is running on port ${port}`)
})