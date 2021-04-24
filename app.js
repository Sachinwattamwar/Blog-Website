const express = require('express');
const app = express();

app.get('/' , (Req , res)=>{
    res.send('done');
});

app.listen(3000 , ()=>{
    console.log('port working');
})