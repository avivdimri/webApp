const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 2500;
const Anomaly = require("./anomalydetect")
const AlgoAnomaly = require("./algoAnomaly")
var a  = new Anomaly();
var collection = [];
var i =0;
//var nDate;
var n;
//kkk
exports.collection = collection;
console.log(a.avg([1,2,3,4,5],5));
console.log(a.pearson([43,21,25,42,57,59],[99,65,79,75,87,81],6));
app.use(bodyParser.json());
app.get('/', (req,res)=>{
    res.send("hello");
});
app.post('/', (req,res)=> {
    let nDate= new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Jerusalem'
      });
      let data = ({  model_id:  i++,
        upload_time: nDate});
    res.send(data)
    collection.push(data)
    var algo = new AlgoAnomaly(req.body,true,collection);
    algo.pearson();
    console.log(data);

});
app.listen(port);