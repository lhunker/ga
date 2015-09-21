/**
 * Created by Daniel on 9/21/2015.
 * tower.js
 * The class defining the Tower object
 */

var TowerPiece = require('towerPiece.js');

/**
 * The constructor for the Tower class
 * @param pieces An array of tower pieces
 * @constructor
 */
function Tower(pieces){
    this.pieces = pieces;
}

/**
 * Checks to see if a tower is legal
 * @param tower The Tower to check
 * @return {boolean} true if the Tower is legal
 */
function isLegalTower(tower){
    return (followsRule1(tower) && followsRule2(tower) && followsRule3(tower) && followsRule4(tower) && followsRule5(tower));
}

/**
 * The helper function that checks rule 1 of Tower legality
 * @param tower The tower to check
 * @return {boolean} true if the Tower follows rule 1
 */
function followsRule1(tower){
    return (tower.pieces[0].type === 'Door');
}

/**
 * The helper function that checks rule 2 of Tower legality
 * @param tower The tower to check
 * @return {boolean} true if the Tower follows rule 2
 */
function followsRule2(tower){
    var length = tower.pieces.length;
    var lengthIndex = length - 1;
    return (tower.pieces[lengthIndex].type === 'Lookout');
}

/**
 * The helper function that checks rule 3 of Tower legality
 * @param tower The tower to check
 * @return {boolean} true if the Tower follows rule 3
 */
function followsRule3(tower){
    var length = tower.pieces.length;
    var lengthIndex = length - 1;
    var i;
    var trueSoFar = true;
    for (i = 1; i < lengthIndex; i++){
        if (tower.pieces[i].type !== 'Wall'){
            trueSoFar = false;
        }
    }
    return trueSoFar;
}

/**
 * The helper function that checks rule 4 of Tower legality
 * @param tower The tower to check
 * @return {boolean} true if the Tower follows rule 4
 */
function followsRule4(tower){
    var length = tower.pieces.length;
    var i;
    var trueSoFar = true;
    for (i = 1; i < length; i++){
        if (tower.pieces[i].width > tower.pieces[i-1].width){
            trueSoFar = false;
        }
    }
    return trueSoFar;
}

/**
 * The helper function that checks rule 5 of Tower legality
 * @param tower The tower to check
 * @return {boolean} true if the Tower follows rule 5
 */
function followsRule5(tower){
    var length = tower.pieces.length;
    var i;
    var j;
    var trueSoFar = true;
    var numPiecesAbove;
    for (i = 0; i < length; i++){
        numPiecesAbove = 0;
        for (j = i + 1; j < length; j++){
            numPiecesAbove++;
        }
        if (numPiecesAbove > tower.pieces[i].strength){
            trueSoFar = false;
        }
    }
    return trueSoFar;
}

/**
 * Returns the score of the given Tower
 * @param tower The Tower being scored
 * @return {Number} The score of the Tower
 */
function towerScore(tower){
    var height = tower.pieces.length;
    var totalCost = 0;
    var i;
    for (i = 0; i < height; i++){
        totalCost += tower.pieces[i].cost;
    }
    if (isLegalTower(tower)){
        return (10 + Math.pow(height, 2) - totalCost);
    }
    else {
        return 0;
    }
}