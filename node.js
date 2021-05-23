const express = require('express')
const app = express();
const port = 9876;
const bodyParser = require('body-parser');
const fileuploding =require('express-fileupload');
const AlgoAnomalyFile = require('./algoAnomaly');
const { json } = require('body-parser');
const fs = require('fs');

app.use(express.static('./'));
app.use(express.json());
app.use(express.urlencoded({
extended: false
}));
var index=0;

app.use(fileuploding());

app.get('/', (req,res) => {
    var html = fs.readFileSync('index.html' , 'utf8');
    res.send(html);
});
app.get('/api/model', (req,res) => {
    if(AlgoAnomalyFile.MODELS[req.query.model_id] != undefined) {
        res.send(JSON.stringify(AlgoAnomalyFile.MODELS[req.query.model_id]))
    }else{
        res.sendStatus(404);
    }
});
function findDev(req) {
    console.log("inside post");
    csvData_train = req.files.train.data.toString('utf8');
    let data_train = parser(csvData_train);

    csvData_test = req.files.test.data.toString('utf8');
    let data_test = parser(csvData_test);
    let isHybrid = false;
    if (req.query.model_type === 'hybrid') {
        isHybrid = true;
    }
    AlgoAnomalyFile.collection_train[index] = {};
    let situation = "pending"
    let nDate = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Jerusalem'
    });
    let data = ({
        model_id: index,
        upload_time: nDate, status: situation
    });
    AlgoAnomalyFile.MODELS[index] = data;
    //res.send(JSON.stringify(data))
    //let dic={"a":[1,2,3,4,5,6,7,8,9],"b":[5,0,2,1,3,8,8,8,1], "C":[1.4,2.4,3.4,4.4,5.4,6.4,7.4,8.4,9.4], "d":[5.5,0.5,2.5,1.5,3.5,8.5,8.5,8.5,1.5]}

    let algo = new AlgoAnomalyFile.AlgoAnomaly(data_train, isHybrid, index);
    algo.learnNormal();
    let devion = AlgoAnomalyFile.detect(data_test, index);
    index++;
    return devion;

}
app.post('/api/server', (req, res) => {
    let dev = findDev(req);
    const obj = Object.fromEntries(dev);
    //let d = JSON.stringify(dev)
    res.send(obj);
});
function create_table(devion_data){
    /*var myBooks = []

    const iterator_map = devion_data.keys();

    for(let i =0;i<devion_data.size;i++){
        let k = iterator_map.next().value
        
        let obj ={
            "Features": k,
            "Spans of devion": devion_data.get(k),
        }
        myBooks.push(obj);
    }*/
    let text = "<h1>Anomaly Detection Server</h1>"
    text += "<style>\n table, th, td { \n border: 1px solid black;\n border-collapse: collapse;\n } \n"
    text += "th, td { padding: 15px; \n text-align: left; \n }\n #t01 tr:nth-child(even)  { \n  background-color: #eee; \n } \n #t01 tr:nth-child(odd) { \n background-color: #fff; \n }\n"
    text += " #t01 th { \n background-color: black; \n color: white; \n }\n tr:hover {background-color:#f5f5f5;} \n td {background-color: #4CAF50; color: white;} \ n h2.hidden { visibility: hidden;; }</style>"
    text += "<table>" 
    text+= "<table style= \"width:80%\" >\n"
    text+= "<tr> \n <td> Feature </td> \n <td>Anomalies </td> \n </tr> \n"
    for(let[key,value] of devion_data){
        let ano = "";
        if(value.length>0){
            let array = value.toString().split(',')
           for(let i=0; i<array.length;i+=2){
               ano += array[i] + "-" + array[i+1]+ "    "
            }
           //ano += value
           //console.log(ano)
        }
        text += " <tr> \n <th>"+ key + "</th> \n <th>" + ano+"   "  +"</th> \n </tr> \n"
    }
    text+= " <h2>Aviv dimri is the king</h2> </table>"
    //text += " <tr> \n <th>AVIV</th> \n <th>DIMRI</th> \n <th>Age</th> \n </tr> \n <tr> \n  <td>IS</td> \n <td>THE</td> \n <td>KING</td> \n </tr> \n <tr> \n <td>Eve</td> \n<td>Jackson</td> \n <td>94</td> \n </tr> \n </table> "
    return text;
}
app.post('/api/model', (req,res) => {

    let devion = findDev(req);
    let f = create_table(devion)   
    //var ht = fs.readFileSync(f , 'utf8');
    res.send(f);
    index++;
});

app.get('/api/models', (req,res) => {
    let list_models = new Array();
    const propOwn = Object.getOwnPropertyNames(AlgoAnomalyFile.MODELS);
    for(let i=0;i<propOwn.length;i++){
        if(AlgoAnomalyFile.MODELS[i] != undefined) {
          list_models.push(AlgoAnomalyFile.MODELS[i])
        }
    }
    //list_models = list_models[0];
    res.send(JSON.stringify(list_models));
});
app.delete('/api/model', (req,res) => {
    if(req.query.model_id in AlgoAnomalyFile.MODELS) {
        erase(req.query.model_id);
    }else{
        res.sendStatus(404);
    }
   
});
app.post('/api/anomaly', (req,res) => {
   if(req.query.model_id in AlgoAnomalyFile.MODELS){
      //let dic={"a":[1,2,3,4,5,6,7,8,9], "b":[5,0,2,1,3,8,8,8,1] ,"C":[50,0,3.4,4.4,885,8,8,1], "d":[5.5,0.5,454,345,3.5,8.5,555,8.5,1.5]}
      const start_json = JSON.stringify("{anomliels:");
      let anomliels =JSON.stringify(AlgoAnomalyFile.detect(req.body,req.query.model_id));
      const end_json = JSON.stringify("reason}")
      res.send(start_json+anomliels+end_json);
   }else{
    res.sendStatus(404);
   }
});

function erase(id){
    delete AlgoAnomalyFile.MODELS[id];
    delete AlgoAnomalyFile.collection_train[id];
    //erase from the tow data structers.
}
app.listen(port);

function parser(csvData){
    let arr =  csvData.split("\n");//arr hold all thee lines
    let featuers=[];
    featuers = arr[0].split(",");//a,b,c,d
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