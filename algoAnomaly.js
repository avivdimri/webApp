const AnomalyImport = require('./anomalydetection')
const enclosingCircle = require('smallest-enclosing-circle')
var anomaly = new AnomalyImport.Anomaly();
// having the id and the cf - learn normal.
var collection_train = {}; 
//for the model data like id, upload time and status position 
var MODELS = {};

//The class is responsible for detecting the anomalies 
class AlgoAnomaly{

    /*
    The constructor receives a dictionary of the exception name and data,
     a Boolean flag of the detector and the ID of the detector for
      future support in keeping all detectors anomalies in the data structure
    */
    constructor(dictionary, isHybrid,model_id){
        this.dictionary = dictionary;
        this.isHybrid = isHybrid;
        this.model_id  = model_id;
        //Array with data of each pair of correlations
        this.cfArr=[]  
    }
    //The method reveals correlations and then the treshold
    learnNormal(){
        this.pearson()
        this.treshold_points()
    }

    //The method reveals correlations
    pearson(){
        let i=0, j=0;
        //Search for correlations
        for( const key1 in this.dictionary){
            i++;
            j=0;
            let max=0;
            //The variable holds the name of the column with the highest correlation
            let maxFeature = null;
            for( const key2 in this.dictionary){
                j++;
                //Are these columns we have already tested
                if(i>=j){
                    continue
                }
                //The correlation
                let num =0;
                num= Math.abs(anomaly.pearson(this.dictionary[key1], this.dictionary[key2],this.dictionary[key2].length ));
                //save the max corelation
                if(num>max){
                    max = num;
                    maxFeature =  key2;
                }

            }
           //Saving the data
             if(this.isHybrid){
                if(max>=0.5){
                    this.cfArr.push({feature1: key1, feature2: maxFeature, cor: max});
                }
                }else{
                    if(max>=0.9){
                        this.cfArr.push({feature1: key1, feature2: maxFeature, cor: max});

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
            size = this.dictionary[cf.feature1].length;
            //Create an array of points from the correlative columns 
            for(let i =0;i<size;i++){
                 x = this.dictionary[cf.feature1][i];
                 y = this.dictionary[cf.feature2][i];
               let point = new AnomalyImport.Point(parseFloat(x),parseFloat(y));
               arrPoints.push(point);
            }
            //for line
            if(cf.cor>=0.9){
            //make line
             let l = anomaly.linear_reg(arrPoints,arrPoints.length);
             //save the line un the cf
             this.cfArr[j].line_reg = l;
           
             //find treshold
            let max_line = 0;
            for (let i =0;i<arrPoints.length;i++){
               let dev_line = anomaly.dev(arrPoints[i],l);
               if(dev_line>max_line){
                   max_line=dev_line;
               }
            }
            this.cfArr[j].treshold = max_line * 1.1;
       
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
                this.cfArr[j].treshold = max_circle * 1.1;
                this.cfArr[j].radius = radius;
                //update the global data 
                }
                
        }  
        //for future support in keeping all detectors anomalies in the data structur
        this.updateData();
    }
//for future support in keeping all detectors anomalies in the data structur
    updateData(){
        collection_train[this.model_id] = this.cfArr;
        MODELS[this.model_id].status = "ready";
    }
    
}

//Global variables
var start=-1, end=0;
var arrSpan=[];

//The method reveals anomalies
function detect(dictionary, id){
    
    let cfArr = collection_train[id];
   
    let anomalies= new Map();
    let size = cfArr.length;
    
    for (let i =0; i<size;i++){
        let cf = cfArr[i];
        //The columns
        if(!(dictionary[cf.feature1]) || !(dictionary[cf.feature2] )){
           continue;
        }
       
        let feature1= dictionary[cf.feature1];
        let feature2 = dictionary[cf.feature2];
        
        //Go over the columns
        for(let j =0; j<feature1.length;j++){
            //let point = new AnomalyImport.Point(parseFloat(feature1[j]), parseFloat(feature2[j]));
            let point = new AnomalyImport.Point(feature1[j], feature2[j]);

             //case of line reg (treshold >=0.9)
            if(cf.cor>= 0.9 ){  
             let num = anomaly.dev(point,cf.line_reg);
            //there is anomaly 
             if(num > cf.treshold){
                 //save the anomaly
                saveAnomaly(j); 
            }
               //case of circle (treshold < 0.9)
            } else{
                let num = anomaly.distance(point,cf.circle.x,cf.circle.y);
                 //there is anomaly 
                if(num > cf.radius){
                  saveAnomaly(j); 
                }
            }

            }
            //If there were no anomalies
            if(start==-1){
                //save
                anomalies.set(cf.feature1 +"  <-->  " + cf.feature2, [])

            }else{
                //save
                arrSpan.push([start,end+1]);
                anomalies.set(cf.feature1 +"  <-->  " + cf.feature2, arrSpan)

            }
            //Reset for next loop
            start=-1;
            arrSpan=[];
        }
        return anomalies;
    }

    //The function saves the anomalies by ranges
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

    //import
module.exports = {AlgoAnomaly,collection_train,MODELS,detect};