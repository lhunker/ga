/**
 * Created by lhunker on 9/17/15.
 * ga.js
 * The base Genetic Algorithm class
 */

/**
 * The constructor for the GA class - used to run a genetic algorithm
 * @param list An array of available pieces in any format
 * @param fitness A function that takes in the sorted list for a permutation and returns the fitness
 *  as a number
 * @param permeate a boolean indicating whether to shuffle the order in the list
 * @param include a boolean indicating whether to shuffle if pieces are included in the list
 * @constructor
 */
function GA(list, fitness, permeate, include){
  this.list = list;
  this.fitness = fitness;
  this.permutate = permeate;
  this.include = include;
}

/**
 * Runs the algorithm for for a specific time and population
 * @param population the population size to work with
 * @param time the wall clock time to run the algorithm
 * @return [] The best solution from the genetic algorithm
 */
GA.prototype.run = function (population, time){
  //TODO implement function

  //Create indices array and shuffle

  //Create boolean array and randomize

  //while within time do generation

  return reconstitute([], []);
};

/**
 * Takes the internal array representations of the sorting and convert it into an array
 * @param order An array with indices of the list in the desired order
 * @param included An array of booleans corresponding to the indices in order
 *  indicates if that number should be included in the result
 * @return [] An array containing objects from the list
 */
function reconstitute(order, included){
  //TODO implement function
  return [];
}


module.exports = GA;