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
    ProbClass = require('./Bin');
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
if (!process.argv[4] || !parseInt(process.argv[4])) {
    console.error('Enter a run time');
    process.exit();
}

probObj = new ProbClass();
probObj.loadFile(process.argv[3], function () {
    var ga = new GA(probObj.list, probObj.fitness.bind(probObj),
        probObj.permutate, probObj.include);

    var result = ga.run(250, parseInt(process.argv[4]));
    console.info('Total generations: ' + result.tGen);
    console.info('Best solution: ' + probObj.printResults(result.best) + ', best score: ' + result.bScore + ', best generation: ' + result.bGen);
    console.info('Last solution: ' + probObj.printResults(result.last) + ', score: ' + result.score);
});
