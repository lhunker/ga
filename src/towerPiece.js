/**
 * Created by Daniel on 9/21/2015.
 * towerPiece.js
 * The class defining the towerPiece object, the pieces that make up a tower
 */

/**
 * The constructor for the TowerPiece class
 * @param type A string representing the type of the TowerPiece
 * @param width A number representing the width of the TowerPiece
 * @param strength A number representing the strength of the TowerPiece
 * @param cost A number representing the cost of the TowerPiece
 * @constructor
 */
function TowerPiece(type, width, strength, cost){
    this.type = type;
    this.width = width;
    this.strength = strength;
    this.cost = cost;
}