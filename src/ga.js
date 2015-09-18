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
  this.list = list; this.fitness = fitness;
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

function orderOneCrossover(arr1, arr2, switchedArrays) {
    console.log('Array 1: ' + arr1.join(', '));
    console.log('Array 2: ' + arr2.join(', '));
    // Select a random starting point at least one away from the end
    var start = Math.floor(Math.random() * (arr1.length - 1));
    // Select a length to keep
    var len = Math.floor(Math.random() * (arr1.length - start));
    if (len === 0) {
        len = 1;
    }
    console.log('Start: ' + start + ', Length: ' + len);
    // Create child1 from that range
    var child1 = arr1.slice(start, start + len);
    console.log('Child 1: ' + child1.join(', '));
    var parent2 = [];
    var i;
    // Create a copy of arr2
    for (i = 0; i < arr2.length; i++) parent2.push(arr2[i]);
    // and then remove values from the new child
    for (i = 0; i < child1.length; i++) parent2.splice(parent2.indexOf(child1[i]), 1);
    console.log('Updated array 2: ' + parent2.join(', '));
    // Copy values at right edge of array, - 1 because indexes aren't inclusive
    var rightCount = arr2.length - start - len;
    var leftCount = parent2.length - rightCount;
    for (i = rightCount; i > 0; i--) child1.push(parent2[parent2.length - i]);
    // Copy remaining values to left edge
    for (i = leftCount - 1; i >= 0; i--) child1.splice(0, 0, parent2[i]);
    console.log('Completed child 1: ' + child1.join(', '));
    var child2;
    if (!switchedArrays) child2 = orderOneCrossover(arr2, arr1, true);
    else return child1;
    return {child1: child1, child2: child2};
}

module.exports = GA;
