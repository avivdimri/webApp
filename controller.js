const express = require('express')
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const fileuploding =require('express-fileupload');
const AlgoAnomalyFile = require('./Model/algoAnomaly');
const { json } = require('body-parser');
const fs = require('fs');

//fro using css file.
app.use(express.static('./View/'));
app.use(express.json());
app.use(express.urlencoded({
extended: false
}));
//global index for id to each req.
var index=0;
//use to upload files.
app.use(fileuploding());


//if use ask for the app web - by /.
app.get('/', (req,res) => {
    var html = fs.readFileSync('View/index.html' , 'utf8');
    res.send(html);
});

//given a id of model return is status.
app.get('/api/model', (req,res) => {
    if(AlgoAnomalyFile.MODELS[req.query.model_id] != undefined) {
        res.send(JSON.stringify(AlgoAnomalyFile.MODELS[req.query.model_id]))
    }else{
        res.sendStatus(404);
    }
});

//for the app that sent a req and gwt a table of the anomalies.
app.post('/api/model', (req,res) => {
    if(req.files.train == undefined){
        res.send("There is no train file - please upload train file!");
        return
    }
    if(req.files.test == undefined){
        res.send("There is no test file - please upload test file!");
        return
    }
    let devion = findDev(req);
    if (devion==-1){
        res.send("There is no featurs row - please upload file with featurs row!");
        return
    }
    let table = create_table(devion);
    //update the id of the client.
    index++;   
    res.send(table);
});
// get all the models that where ion the systeam by json.
app.get('/api/models', (req,res) => {
    let list_models = new Array();
    const propOwn = Object.getOwnPropertyNames(AlgoAnomalyFile.MODELS);
    for(let i=0;i<propOwn.length;i++){
        if(AlgoAnomalyFile.MODELS[i] != undefined) {
          list_models.push(AlgoAnomalyFile.MODELS[i])
        }
    }
    res.send(JSON.stringify(list_models));
});

//delete a model from the server if he is exsit,return error if not.
app.delete('/api/model', (req,res) => {
    if(req.query.model_id in AlgoAnomalyFile.MODELS) {
        erase(req.query.model_id);
    }else{
        res.sendStatus(404);
    }
   
});
app.post('/api/anomaly', (req,res) => {
    if(req.files.train == undefined){
        res.send("There is no train file - please upload train file!");
        return
    }
    if(req.files.test == undefined){
        res.send("There is no test file - please upload test file!");
        return
    }
    let dev = findDev(req);
    if (dev==-1){
        res.send("There is no featurs row - please upload file with featurs row!");
        return
    }
    const obj = Object.fromEntries(dev);
    res.send(obj);
});

app.listen(port);

function create_table(devion_data){
   
    // let text = "<h1>Anomaly Detection Table</h1>"
    let text = "<style>\n *{background-color: rgba(124, 86, 96, 0.774);} table, th, td { \n border: 1px solid black;\n border-collapse: collapse;\n } \n"
    text += "th, td { padding: 15px; \n text-align: left; \n }\n #t01 tr:nth-child(even)  { \n  background-color: #eee; \n } \n #t01 tr:nth-child(odd) { \n background-color: #fff; \n }\n"
    text += " #t01 th { \n background-color: black; \n color: white; \n }\n tr:hover {background-color:#f5f5f5;} \n td {background-color: #c74e4e; color: white;} \ n h2.hidden { visibility: hidden;; }</style>"
    text += "<table>" 
    text+= "<table style= \"width:100%\" >\n"
    text+= "<tr> \n <td> Feature </td> \n <td>Anomalies </td> \n </tr> \n"
    for(let[key,value] of devion_data){
        let val = "";
        if(value.length>0){
            let array = value.toString().split(',')
           for(let i=0; i<array.length;i+=2){
               val += array[i] + "-" + array[i+1]+ "    "
            }
        }
        text += " <tr> \n <th>"+ key + "</th> \n <th>" + val+"   "  +"</th> \n </tr> \n"
    }
    text+= "  </table>"

    return text;
}
function erase(id){
    delete AlgoAnomalyFile.MODELS[id];
    delete AlgoAnomalyFile.collection_train[id];
    
}

function findDev(req) {
    csvData_train = req.files.train.data.toString('utf8');
    let data_train = parser(csvData_train);
    csvData_test = req.files.test.data.toString('utf8');
    let data_test = parser(csvData_test);
    let isHybrid = false;
    if (req.body.model_type == 'Hybrid') {
        isHybrid = true;
    }
    AlgoAnomalyFile.collection_train[index] = {};
    let situation = "pending"
    let nDate = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Jerusalem'
    });
    let data_status = ({
        model_id: index,
        upload_time: nDate, status: situation
    });
    AlgoAnomalyFile.MODELS[index] = data_status;
    let algo = new AlgoAnomalyFile.AlgoAnomaly(data_train, isHybrid, index);
    algo.learnNormal();
    let devion = AlgoAnomalyFile.detect(data_test, index);
    index++;
    return devion;
}
//parser the csv file.
function parser(csvData){
    let arr =  csvData.split("\n");
    let featuers=[];
    featuers = arr[0].split(",");
    if(!isNaN(featuers[0])){
        return -1;
    }
    let data = {}
    for(let i=0;i<featuers.length;i++){
        data[featuers[i]]=[];
 }
 for(let i = 1;i<(arr.length)-1;i++){
    let temp = arr[i].split(',');
     for(let j=0;j<(featuers.length);j++){
         data[featuers[j]].push(temp[j]);
     }
    }
    return data;
}