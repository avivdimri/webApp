const express = require('express')
const app = express();
const port = 9876;
const bodyParser = require('body-parser');
const AlgoAnomalyFile = require('./algoAnomaly');
const { json } = require('body-parser');
app.use(express.json());
app.use(express.urlencoded({
extended: false
}));
var index=0;



app.get('/api/model', (req,res) => {
    if(AlgoAnomalyFile.MODELS[req.query.model_id] != undefined) {
        res.send(JSON.stringify(AlgoAnomalyFile.MODELS[req.query.model_id]))
    }else{
        res.sendStatus(404);
    }
});

app.post('/api/model', (req,res) => {
    let isHybrid = false;
    if(req.query.model_type ==='hybrid'){
        isHybrid = true;
    }
    AlgoAnomalyFile.collection_train[index]={};
    let situation = "pending"
    let nDate= new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Jerusalem'
      });
    let data = ({ model_id:  index,
        upload_time: nDate ,status: situation});
    AlgoAnomalyFile.MODELS[index] = data;  
    res.send(JSON.stringify(data))
    let dic={"a":[1,2,3,4,5,6,7,8,9],"b":[5,0,2,1,3,8,8,8,1], "C":[1.4,2.4,3.4,4.4,5.4,6.4,7.4,8.4,9.4], "d":[5.5,0.5,2.5,1.5,3.5,8.5,8.5,8.5,1.5]}
    let algo = new AlgoAnomalyFile.AlgoAnomaly(req.body,isHybrid,index);
    algo.learnNormal();
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