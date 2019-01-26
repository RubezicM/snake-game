const express = require('express');
const fs = require('fs')
const port = process.env.PORT || 3008;
var app = express();



app.use((req,res,next)=>{
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log',log + '\n',(err)=>{
        if(err){
            console.log('Unable to append to server.log');
        } else {
            console.log('server.log updated');
        }
    })
    next();
});

// app.use((req,res,next)=>{
//     res.render('maintance.hbs',{
//         message:"We will be back soon.",
//         update: "The website is being updated"
//     })
// })

app.use(express.static(__dirname + '/public'));


app.get('/bad',(req,res)=>{
    res.send({
        error: 'Error handling the request'
    })
})

app.listen(port,()=> {
    console.log(`Server is up on port ${port}`);
})