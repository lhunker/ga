/**
 * Created by lhunker on 9/17/15.
 * ga.js
 * The base Genetic Algorithm class
 */
var debug = require('debug')('ga');
var shuffle = require('knuth-shuffle').knuthShuffle;
var moment = require('moment');

/**
 * The constructor for the GA class - used to run a genetic algorithm
 * @param list An array of available pieces in any format
 * @param fitness A function that takes in the sorted list for a permutation and returns the fitness
 *  as a number
 * @param permutate a boolean indicating whether to shuffle the order in the list
 * @param include a boolean indicating whether to shuffle if pieces are included in the list
 * @constructor
 */
function GA(list, fitness, permutate, include){
    this.list = list;
    this.fitness = fitness;
    this.permutate = permutate;
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

    var indices = [];
    var inclusions = [];
    //Create indices array and shuffle
    for (var i = 0; i < population; i++){
        var next;
        if(this.permutate){
            next = shuffleIndices(this.list.length);
        }else{
            next = incrementingOrder(this.list.length);
        }
        indices.push(next);
        if(this.include){
            next = booleanArrayGenerator(this.list.length);
        }else{
            next = generateTrue(this.list);
        }
        inclusions.push(next);
    }

    //while within time do generation
    var start = moment();
    var end = moment(start).add(time, 's'); //TODO assuming seconds for now
    while (moment().isBefore(end)) {
        var combine = selectParents(indices, inclusions);
        var children = {indices: [], include: []};
        for(var j = 0; j < combine.indices.length; j += 2) {
            var nxt = orderOneCrossover(combine.indices[j], combine.indices[j+1], false);
            children.indices.push(nxt.child1);
            children.indices.push(nxt.child2);
            //TODO crossover booleans (currently just copies parent)
            //TODO check whether both should be crossed
            children.include.push(combine.include[j]);
            children.include.push(combine.include[j+1]);


        }
        //TODO implement mutation
        //TODO implement elitism?
        //TODO cull children?
        indices = children.indices;
        inclusions = children.include;
    }

    //dummy line to keep jshint happy
    //TODO remove once function is used
    weightedRandom([{value:2}]);

    return findBest(indices, inclusions, this.list, this.fitness);
};

/**
 * Select the parents to be combined
 * @param indices the population in the indices representation
 * @param include the population in the boolean representation
 * @returns {{indices: Array, include: Array}} The sets of parents to be combined. Parents will be
 *  combined in order of array, 0 with 1, 2 with 3, etc...
 */
function selectParents(indices, include){
    //TODO implement function
    return {indices: indices, include: include};
}

/**
 * Given all members of the population, finds the most fit
 * @param indices the list of orderings
 * @param include the list of whether or not an index is included
 * @param list all pieces in the game
 * @param fitfunc the fitness function to run on each answer
 * @returns {*[]} The best solution in the population
 */
function findBest(indices, include, list, fitfunc){
    var fitness = 0;
    var index = 0;
    for(var i = 0; i < indices.length; i++){
        var compare = reconstitute(indices[i], include[i], list);
        var val = fitfunc(compare);
        if (val > fitness){
            fitness = val;
            index = i;
        }
    }
    return reconstitute(indices[index], include[index], list);
}

/**
 * Generates an array of trues for all elements in list
 * @returns {Array} An array of true the length of list
 */
function generateTrue(list){
    var arr = [];
    list.forEach(function(){
        arr.push(true);
    });
    return arr;
}

/**
 * Produces a list of incrementing numbers from 0 to num not including num
 * @param num The max number to loop to
 * @returns {Array} An array of numbers in increasing order
 */
function incrementingOrder(num){
    var arr = [];
    for(var i = 0; i < num; i++) {
        arr.push(i);
    }
    return arr;
}

/**
 * perform a shuffle on the indices to produce a candidate
 * @param num the number of indicies to shuffle
 * @return [] An array of indices in shuffled order
 */
function shuffleIndices(num){
    var arr = incrementingOrder(num);
    return shuffle(arr.slice(0));
}

/**
 * Generate a random array of booleans the length of the list
 * @param num number of booleans to generate
 * @return [] A list of boolean
 */
function booleanArrayGenerator(num){
    var arr = [];
    for (var i = 0; i < num; i++) arr.push(Math.random() > 0.5);
    return arr;
}

/**
 * Takes the internal array representations of the sorting and convert it into an array
 * @param order An array with indices of the list in the desired order
 * @param included An array of booleans corresponding to the indices in order
 *  indicates if that number should be included in the result
 * @param list the list of all pieces
 * @return [] An array containing objects from the list
 */
function reconstitute(order, included, list) {
    debug(order + ' ' + included);
    var arr = [];
    for (var i = 0; i < included.length; i++) {
        if (included[i]) {
            arr.push(list[order[i]]);
        }
    }
    return arr;
}

/**
 * Performs an order one crossover using given arrays
 * @param arr1 First parent array
 * @param arr2 Second parent array
 * @param switchedArrays Boolean if parent arrays should be switched
 *        when creating a child
 * @return Object containing child1 array and child2 array
 */
function orderOneCrossover(arr1, arr2, switchedArrays) {
    //debug('Array 1: ' + arr1.join(', '));
    //debug('Array 2: ' + arr2.join(', '));
    // Select a random starting point at least one away from the end
    var start = Math.floor(Math.random() * (arr1.length - 1));
    // Select a length to keep
    var len = Math.floor(Math.random() * (arr1.length - start));
    if (len === 0) {
        len = 1;
    }
    //debug('Start: ' + start + ', Length: ' + len);

    // Create child1 from that range
    var child1 = arr1.slice(start, start + len);
    //debug('Child 1: ' + child1.join(', '));
    var parent2 = [];
    var i;

    // Create a copy of arr2
    for (i = 0; i < arr2.length; i++){
        parent2.push(arr2[i]);
    }

    // and then remove values from the new child
    for (i = 0; i < child1.length; i++) {
        parent2.splice(parent2.indexOf(child1[i]), 1);
    }
    //debug('Updated array 2: ' + parent2.join(', '));
    // Copy values at right edge of array, - 1 because indexes aren't inclusive
    var rightCount = arr2.length - start - len;
    var leftCount = parent2.length - rightCount;
    for (i = rightCount; i > 0; i--) {
        child1.push(parent2[parent2.length - i]);
    }

    // Copy remaining values to left edge
    for (i = leftCount - 1; i >= 0; i--) {
        child1.splice(0, 0, parent2[i]);
    }
    //debug('Completed child 1: ' + child1.join(', '));

    //Either generate second child or return
    var child2;
    if (!switchedArrays) {
        child2 = orderOneCrossover(arr2, arr1, true);
    }
    else {
        return child1;
    }
    return {child1: child1, child2: child2};
}

/**
 * Picks a number from the list weighted by its probability
 * @param list An array of objects to pick from.
 *      Objects must have a field value containing their weight
 * @returns {*} The randomly selected item from the list
 */
function weightedRandom(list){
    var sum = 0;
    list.forEach(function (item){
       sum += item.value;
        item.range = sum;
    });
    var sel = Math.floor(Math.random() * (sum));
    for (var i = 0; i < list.length; i++){
        if (sel < list[i].range){
            return list[i];
        }
    }

    //If nothing is returned
    debug('Something went wrong! ' + sum + ' ' + sel);
    return list[list.length -1];
}

module.exports = GA;

