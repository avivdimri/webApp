const AnomalyImport = require('./anomalydetection')
const enclosingCircle = require('smallest-enclosing-circle')
var anomaly = new AnomalyImport.Anomaly();
var collection_train = {}; // having the id and the cf - learn normal.
var MODELS = {}; //for the model data like id, upload time and status position 
class AlgoAnomaly{

    constructor(dictionary, isHybrid,model_id){
        this.dictionary = dictionary;
        this.isHybrid = isHybrid;
        this.model_id  = model_id;
        this.cfArr=[]  
    }
    learnNormal(){
        this.pearson()
        this.treshold_points()
    }

    pearson(){
        let i=0, j=0;
        //Search for correlations
        for( const key1 in this.dictionary){
            i++;
            j=0;
            let max=0;
            //The variable holds the name of the column with the highest correlation
            let maxFeatcher = null;
            for( const key2 in this.dictionary){
                j++;
                //Are these columns we have already tested
                if(i>=j){
                    continue
                }
                //The correlation
                let num =0;
                num= Math.abs(anomaly.pearson(this.dictionary[key1], this.dictionary[key2],this.dictionary[key2].length ));

                if(num>max){
                    max = num;
                    maxFeatcher =  key2;
                }

            }
             if(this.isHybrid){
                if(max>=0.5){
                    this.cfArr.push({featcher1: key1, featcher2: maxFeatcher, cor: max});
                }
                }else{
                    if(max>=0.9){
                        this.cfArr.push({featcher1: key1, featcher2: maxFeatcher, cor: max});

                    }
             }
        }
    }

    treshold_points(){
        //Go over all the cf
        for(let j=0; j<this.cfArr.length;j++ ){
            let arrPoints=[];
            let x=0,  y=0, size=0;
            let cf = this.cfArr[j];
            size = this.dictionary[cf.featcher1].length;
            //Create an array of points from the correlative columns 
            for(let i =0;i<size;i++){
                 x = this.dictionary[cf.featcher1][i];
                 y = this.dictionary[cf.featcher2][i];
               let point = new AnomalyImport.Point(x,y);
               arrPoints.push(point);
            }
            //for line
            if(cf.cor>=0.9){
            //make line
             let l = anomaly.linear_reg(arrPoints,arrPoints.length);
             //save the line un the cf
             this.cfArr[j].line_reg = l;
             /////////
           
             /////////
             //find treshold
            let max_line = 0;
            for (let i =0;i<arrPoints.length;i++){
               let dev_line = anomaly.dev(arrPoints[i],l);
               if(dev_line>max_line){
                   max_line=dev_line;
               }
            }
            this.cfArr[j].treshold = max_line;
           
            //collection_train[this.model_id].cf = this.cfArr;
            // if treshold < 0.9 (circle case)
            }else{
                let circle = enclosingCircle(arrPoints);
                this.cfArr[j].circle = circle;
                let radius =  circle.r;
               let max_circle = 0;
                for (let i =0;i < arrPoints.length;i++){
                    let dev_circle = anomaly.distance(arrPoints[i],circle.x,circle.y);
                    if(dev_circle>max_circle){
                        max_circle=dev_circle;
                    }
                 }
                this.cfArr[j].treshold = max_circle;
                this.cfArr[j].radius = radius;
                //update the global data 
                }
                
        }  
        this.updateData();
    }
    updateData(){
        collection_train[this.model_id] = this.cfArr;
        MODELS[this.model_id].status = "ready";
    }
    
}
var start=-1, end=0;
var arrSpan=[];


function detect(dictionary, id){
    console.log("indise detect");
    let cfArr = collection_train[id];

   // let AnomalyReport={};
    //let reason=[];
   
    let anomalies={};
    let size = cfArr.length;
    console.log(size);
    // let size = cfArr.length;
     //Go over all the cf
    // let size = cfArr.length;
    for (let i =0; i<size;i++){
        let cf = cfArr[i];
        console.log(cf);
        //The columns
        if(!(dictionary[cf.featcher1]) || !(dictionary[cf.featcher2] )){
           continue;
        }
       
        let feature1= dictionary[cf.featcher1];
        let feature2 = dictionary[cf.featcher2];
        
        //Go over the columns
        for(let j =0; j<feature1.length;j++){
            let point = new AnomalyImport.Point(feature1[j],feature2[j]);
             //case of line reg (treshold >=0.9)
            if(cf.cor>= 0.9 ){  
             let num = anomaly.dev(point,cf.line_reg);
            //there is anomaly 
             if(num > cf.treshold){
                 //save the anomaly
               // AnomalyReport.push({feature1: cf.featcher1, feature2: cf.featcher2, index: j})
               console.log("sholud be devion")
                saveAnomaly(j); 
            }
               //case of circle (treshold < 0.9)
            } else{
                let num = anomaly.distance(point,cf.circle.x,cf.circle.y);
                 //there is anomaly 
                if(num > cf.radius){
                  //  AnomalyReport.push({feature1: cf.featcher1, feature2: cf.featcher2, index: j})
                  saveAnomaly(j); 
                }
            }

            }
            if(start==-1){
                anomalies[cf.featcher1]=[];

            }else{
                arrSpan.push([start,end+1]);
                anomalies[cf.featcher1]=arrSpan;

            }
            start=-1;
            arrSpan=[];
        }
        return anomalies;
         //console.log(anomalies);
    }


    function saveAnomaly(index){
        if(start === -1){
            start =index;
            end=index;
        }else if(index=== end+1){
            end++;
        }else{
            arrSpan.push([start,end+1]);
            start= index;
            end = index;
        }
    }
module.exports = {AlgoAnomaly,collection_train,MODELS,detect};