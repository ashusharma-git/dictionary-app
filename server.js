require('dotenv').config();
const express = require("express");
const app = express();
const https = require('https');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/", (req, res)=>{
    res.render("index");
});

app.get("/search", (req, res)=>{
    // console.log(req.body);
    // console.log(req.query);
    // const word = req.params["word"]
    const word = req.query.word;
    https.get(process.env.API+word, resp => {
        if(resp.statusCode===404) res.render("notFound");
        else{
            let data = [];
            resp.on('data', chunk => {
                data.push(chunk);
            })
            resp.on('end', () => {
                // console.log('Response ended: ');
                const dataa = JSON.parse(Buffer.concat(data).toString());

                res.render("result", {result: dataa[0]});
            });
        }
    }).on('error', err => {
        console.log('Error........: ', err.message);
    });
})


const PORT = 3333;
app.listen(PORT, ()=>{
    console.info("Server running on PORT: ", PORT);
})