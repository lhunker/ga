/**
 * Created by lhunker on 9/17/15.
 * The main file for the genetic algorithm assignment
 */

//This file will be called from the command line
//Kick off any processing here

//Simple sample program
var GA = require('./ga');
var fitness = function(list){
  var sum = 0;
    list.forEach(function (l){
        sum += l;
    });
    return sum;
};
var test = new GA([1,5,7,8,3,9,2], fitness, true, true);

console.info('Solution = ' + test.run(10, 5));