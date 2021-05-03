const Anomaly = require('./anomalydetect')
var anomaly = new Anomaly();

var collection = []
class AlgoAnomaly{
    constructor(dictionary, isHybrid){
        this.dictionary=dictionary;
        this.isHybrid=isHybrid;
        //var cf = {featcher1, featcher2, threshold}
        this.cfArr=[]
        //this.collection = collection;
    }
    getcd(){
        return this.cfArr;
    }

    pearson(){
        let max =0;
        let keyMax;
        for(const key1 in this.dictionary){

            for(const key2 in this.dictionary){

                if(key1 == key2){
                    continue
                }
                let num =0;
                num= Math.abs(anomaly.pearson(this.dictionary[key1], this.dictionary[key2],this.dictionary[key2].length ));
                if(num>max){
                    max=num;
                    keyMax = key2;
                }

            }
            if(this.isHybrid){
                if(max>=0.2){
                    console.log("aviv is the king");
                    this.cfArr.push({featcher1: this.dictionary[key1], featcher2: this.dictionary[keyMax], threshold: max});
                }

            }else{
                if(max>=0.9){
                    console.log("aviv is the king");
                    this.cfArr.push({featcher1: this.dictionary[key1], featcher2: this.dictionary[keyMax], threshold: max});

                }
            }

         }
    }
   
}


module.exports = AlgoAnomaly;