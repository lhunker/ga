/**
 * Created by Daniel on 9/21/2015.
 * tower.js
 * The class defining the Tower object
 */

var fs = require('fs');
var parse = require('csv-parse');

/**
 * The constructor for the Tower class
 * @constructor
 */
function Tower(){
    this.list = [];
    this.permutate = true;
    this.include = true;
}

//TODO refactor and use functional everywhere, or do OOP and use this.list

/**
 * Loads a set of pieces from a given file
 * @param file String containing the filename
 * @param callback Function to run after loading the file
 */
Tower.prototype.loadFile = function(file, callback) {
    // to maintain scoping
    var _this = this;

    // crete parser for each line
    var parser = parse({delimiter: '\t'});
    var data = [];

    // create variables to make tower pieces
    var type;
    var width;
    var strength;
    var cost;

    // while parsing, append data
    parser.on('readable', function() {
        var record;
        while ((record = parser.read())) {
            data.push(record)
        }
    });

    // log errors
    parser.on('error', function(err) {
        console.error(err.message);
    });

    // on finish, parse each line
    parser.on('finish', function() {
        for (var i = 0; i < data.length; i++) {
            // set the tower piece variables
            type = data[i][0];
            width = parseInt(data[i][1]);
            strength = parseInt(data[i][2]);
            cost = parseInt(data[i][3]);

            // create a tower piece from the variables and push it to this.list
            _this.list.push({type: type, width: width, strength: strength, cost: cost});
        }

        // go to the callback
        callback();
    });

    // read specified file
    fs.readFile(file, 'utf8', function(err, data){
        if (err) {
            console.error('Error opening file: ' +  err);
            process.exit(2);
        }
        parser.write(data);
        parser.end();
    });
};

/**
 * Checks to see if a tower is legal
 * @param tower The Tower to check
 * @return {boolean} true if the Tower is legal
 */
Tower.prototype.isLegal = function isLegalTower(tower){
    return (followsRule1(tower) && followsRule2(tower) && followsRule3(tower) && followsRule4(tower) && followsRule5(tower));
};

/**
 * The helper function that checks rule 1 of Tower legality
 * @param tower The tower to check
 * @return {boolean} true if the Tower follows rule 1
 */
function followsRule1(tower){
    return (tower[0].type === 'Door');
}

/**
 * The helper function that checks rule 2 of Tower legality
 * @param tower The tower to check
 * @return {boolean} true if the Tower follows rule 2
 */
function followsRule2(tower){
    var length = tower.length;
    var lengthIndex = length - 1;
    return (tower[lengthIndex].type === 'Lookout');
}

/**
 * The helper function that checks rule 3 of Tower legality
 * @param tower The tower to check
 * @return {boolean} true if the Tower follows rule 3
 */
function followsRule3(tower){
    var length = tower.length;
    var lengthIndex = length - 1;
    for (var i = 1; i < lengthIndex; i++){
        if (tower[i].type !== 'Wall'){
            return false;
        }
    }
    return true;
}

/**
 * The helper function that checks rule 4 of Tower legality
 * @param tower The tower to check
 * @return {boolean} true if the Tower follows rule 4
 */
function followsRule4(tower){
    var length = tower.length;
    var i;
    for (i = 1; i < length; i++){
        if (tower[i].width > tower[i-1].width){
            return false;
        }
    }
    return true;
}

/**
 * The helper function that checks rule 5 of Tower legality
 * @param tower The tower to check
 * @return {boolean} true if the Tower follows rule 5
 */
function followsRule5(tower){
    var length = tower.length;
    var i;
    var j;
    var numPiecesAbove;
    for (i = 0; i < length; i++){
        numPiecesAbove = 0;
        for (j = i + 1; j < length; j++){
            numPiecesAbove++;
        }
        if (numPiecesAbove > tower[i].strength){
            return false;
        }
    }
    return true;
}

/**
 * Returns the score of the given Tower
 * @param tower The list of pieces being scored
 * @return {Number} The score of the Tower
 */
Tower.prototype.fitness = function towerScore(tower){
    var height = tower.length;
    var totalCost = 0;
    var i;
    for (i = 0; i < height; i++){
        totalCost += tower[i].cost;
    }
    if (this.isLegal(tower)){
        return (10 + Math.pow(height, 2) - totalCost);
    }
    else {
        return 0;
    }
};

module.exports = Tower;