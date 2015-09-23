/**
 * Created by lhunker on 9/17/15.
 * The main file for the genetic algorithm assignment
 */

//This file will be called from the command line
//Kick off any processing here

//Simple sample program
var GA = require('./ga');
var Packer = require('./Packer');
var packer = new Packer();
packer.loadFile('numbers', function() {
    /*var fitness = function(list){
      var sum = 0;
        list.forEach(function (l, i) {
            sum += l * i;
        });
        return sum;
    };*/
    //var test = new GA([1,5,7,8,3,9,2], fitness, true, true);
    var test = new GA(packer.numbers, packer.fitness.bind(packer), true, true);

    console.info('Solution = ' + test.run(10, 5));
});
