/**
 * Created by lhunker on 9/17/15.
 * The main file for the genetic algorithm assignment
 */

var GA = require('./ga');
var ProbClass;
var probObj;

//Select Problem
var problem = parseInt(process.argv[2]);
if (problem === 1) {
    ProbClass = require('./Packer');
} else if (problem === 2) {
    //TODO switch in class 2
    ProbClass = require('./Packer');
} else if (problem === 3) {
    ProbClass = require('./Tower');
} else {
    console.error('Enter a valid problem number (1-3)');
    process.exit();
}

if (!process.argv[3]) {
    console.error('Enter a file name');
    process.exit();
}

probObj = new ProbClass();
probObj.loadFile(process.argv[3], function () {
    var ga = new GA(probObj.list, probObj.fitness.bind(probObj), true, true);

    console.info('Solution = ' + ga.run(10, 5));
});