const path = require('path');
const express = require('express');

const port = process.env.PORT || 8080;
const publicpath = path.join(__dirname, '../public');
var app = express();

app.use(express.static(publicpath));

app.listen(8080 , ()=>{
    console.log(`Server is up on port ${port}`);
});