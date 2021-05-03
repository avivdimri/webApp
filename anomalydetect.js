class Anomaly {

   avg(arrx,size) {
      let i;
      let sum = 0;
      for (i = 0; i < size; i++) {
          sum += arrx[i];
      }
      let avg = sum / size;
      return avg;
  }
  
   vareince(x,size) {
      let sum = 0;
      let i;
      let avgX = this.avg(x, size);
      for (i = 0; i < size; i++) {
          sum += Math.pow(x[i] - avgX, 2);
      }
      //let v = sum / size;
      return sum / size;
  }
  
  // returns the covariance of X and Y
      cov (x, y,size) {
      let arrayZ = new Array();
      let i;
      for (i = 0; i < size; i++) {
          arrayZ[i] = x[i] * y[i];
      }
      let avgX = this.avg(x, size);
      let avgY = this.avg(y, size);
      let avgZ = this.avg(arrayZ, size);
      let cov = avgZ - (avgX * avgY);
      return cov;
  }
  
  
  
  // returns the Pearson correlation coefficient of X and Y
   pearson(x, y,size) {
      let varX = this.vareince(x, size);
      let varY = this.vareince(y, size);
      let squarVar = Math.sqrt(varX) * Math.sqrt(varY);
      let p = this.cov(x, y, size) / squarVar;
      return p;
  }
  
  // performs a linear regression and returns the line equation
  linear_reg(points,size) {
      let arrX = new Array();
      let arrY = new Array();
      let i;
      for (i = 0; i < size; i++) {
          arrX[i] = points[i].x;
          arrY[i] = points[i].y;
      }
      let a = this.cov(arrX, arrY, size) / this.vareince(arrX, size);
      let b = this.avg(arrY, size) - (a * (this.avg(arrX, size)));
      return {a, b};
  
  }
  
  // returns the deviation between point p and the line equation of the points
  dev( p,points,size) {
      let line = this.linear_reg(points, size);
      let dis = line.f(p.x);
      return this.fabs(dis - p.y);
  }
  
  // returns the deviation between point p and the line from the function.
  dev(p, l) {
      return this.fabs(l.f(p.x) - p.y);
  }
};
class Line {
      
           a;
           b;
      
           /*constructor() {
               a=0;
               b=0;
           }*/
      
           constructor(x,y) {
               this.a=x;
               this.b=y
      
          function f(x) {
              return this.a * x + this.b;
          }
      }
  }
      
 class Point {
          x;  
          y;
          /*constructor() {
              this.x=0;
              this.y=0;
          }*/
      
      
          constructor(x,y) {
              this.x=x;
              this.y=y;
          }
      }
module.exports = Anomaly;
     