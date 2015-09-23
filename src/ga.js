/**
 * Created by lhunker on 9/17/15.
 * ga.js
 * The base Genetic Algorithm class
 */
var debug = require('debug')('ga');
var _ = require('underscore');
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
    var generations = 0;
    while (moment().isBefore(end)) {
        generations++;
        // TODO update the last argument to reflect true number of parents to return
        var combine = selectParents(indices, inclusions, this.fitness, this.list, population);
        var children = {indices: [], include: []};
        for(var j = 0; j < combine.indices.length; j += 2) {
            var nxt = orderOneCrossover(combine.indices[j], combine.indices[j+1], false);
            children.indices.push(nxt.child1);
            children.indices.push(nxt.child2);

            //Perform boolean crossover
            var boolChld = orderOneCrossover(combine.include[j], combine.include[j + 1], false);
            //TODO check whether both should be crossed
            children.include.push(boolChld.child1);
            children.include.push(boolChld.child2);

            //TODO make conditional
            //children = mutate(children.indices, children.include, 2);
        }
        //TODO implement elitism option
        //TODO make conditional, this also won't do anything since being reassigned right below
        //cull(createScoredArray(indices, inclusions, this.fitness, this.list));
        indices = children.indices;
        inclusions = children.include;
    }

    console.log('Generations: ' + generations); //TODO move to app
    best = findBest(indices, inclusions, this.list, this.fitness);
    return best.toString() + ", score: " + this.fitness(best).toString();
};

/**
 * Selects array members to kill using tournament selection
 * Therefore, 50% of the list will be culled each iteration
 * @param pieces a list of objects created by createScoredArray
 * @returns {} containing indices and inclusions
 */
function cull(pieces) {
    var indices = [];
    var inclusions = [];
    for (var i = 0; i < pieces.length; i += 2) {
        var obj1 = pieces[i];
        var obj2 = pieces[i + 1];

        var maxObject = obj1.value > obj2.value ? obj1 : obj2;
        var minObject = obj1.value < obj2.value ? obj1 : obj2;
        if (Math.random() * (obj1.value + obj2.value) < maxObject.value) {
            indices.push(maxObject.indices);
            inclusions.push(maxObject.include);
        } else {
            indices.push(minObject.indices);
            inclusions.push(minObject.include);
        }
    }
    return {indices: indices, inclusions: inclusions};
}

/**
 * Converts index/include arrays to object including score
 * @param indices the population in the indices representation
 * @param include the population in the boolean representation
 * @param fitFunc the fitness function to use to evaluate options
 * @param list the list of all pieces for this puzzle
 * @returns [{*}] containing indices, include, and score
 */
function createScoredArray(indices, include, fitFunc, list) {
    var arrs = [];
    for (var i = 0; i < indices.length; i++) {
        var score = fitFunc(reconstitute(indices[i], include[i], list));
        var o = {value: score, indices: indices[i], include: include[i]};
        arrs.push(o);
    }
    return arrs;
}

/**
 * Select the parents to be combined
 * @param indices the population in the indices representation
 * @param include the population in the boolean representation
 * @param fitFunc the fitness function to use to evaluate options
 * @param list the list of all pieces for this puzzle
 * @param returnNo number of parents to return
 * @returns {{indices: Array, include: Array}} The sets of parents to be combined. Parents will be
 *  combined in order of array, 0 with 1, 2 with 3, etc...
 */
function selectParents(indices, include, fitFunc, list, returnNo){
    var arrs = createScoredArray(indices, include, fitFunc, list); 

    var parentLists = [];
    var parentIncludes = [];
    // Get weighted random two at a time to ensure they are not the same
    for (var i = 0; i < returnNo; i += 2) {
        var j = weightedRandom(arrs);
        var jScore = arrs[j].value;
        arrs[j].value = 0;
        //arrs[j].value -= 2;
        //if (arrs[j].value <= 0)
            //arrs[j].value = 1;
        var j2 = weightedRandom(arrs);
        while (j === j2)
            j2 = weightedRandom(arrs);
        arrs[j].value = jScore;
        //arrs[j2].value -= 2;
        //if (arrs[j2].value <= 0)
            //arrs[j2].value = 1;
        parentLists.push(arrs[j].indices);
        parentLists.push(arrs[j2].indices);
        parentIncludes.push(arrs[j].include);
        parentIncludes.push(arrs[j2].include);
    }
    return {indices: parentLists, include: parentIncludes};
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
    return _.shuffle(arr.slice(0));
}

/**
 * Generate a random array of booleans the length of the list
 * @param num number of booleans to generate
 * @return [] A list of boolean
 */
function booleanArrayGenerator(num){
    var arr = [];
    for (var i = 0; i < num; i++) {
        arr.push(Math.random() > 0.5);
    }
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
    //debug(order + ' ' + included);
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
    var start = _.random(0, arr1.length - 1);
    // Select a length to keep
    var len = _.random(0, arr1.length - start);
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
 * @returns number index of selected item
 */
function weightedRandom(list){
    var sum = 0;
    list.forEach(function (item){
       sum += item.value;
        item.range = sum;
    });
    var sel = _.random(0, sum - 1);
    for (var i = 0; i < list.length; i++){
        if (sel < list[i].range){
            return i;
        }
    }

    //If nothing is returned
    debug('Something went wrong! ' + sum + ' ' + sel);
    return _.random(list.length - 1);
}

/**
 * Performs num random mutations on the population
 * Each mutation consists of swapping 2 indices and flipping one include
 * @param indices the population as indices
 * @param include the population in boolean include representation
 * @param num The number of mutations to perform
 * @returns {{indices: *, include: *}} The population with mutants
 */
function mutate(indices, include, num) {
    //Do num random mutation pairs
    for (var i = 0; i < num; i++) {
        //Pick member
        var member = _.random(0, indices.length - 1);
        //Pick two indexes to swap
        var pos1 = _.random(0, indices[member].length - 1);  //The first position to switch
        var pos2 = pos1;
        //Keep picking until they are differant numbers
        while (pos2 === pos1) {
            pos2 = _.random(0, indices[member].length - 1);
        }

        //Perform swap
        var tmp = indices[member][pos1];
        indices[member][pos1] = indices[member][pos2];
        indices[member][pos2] = tmp;

        //Randomly flip an include
        var flip = _.random(0, include[member].length - 1);
        include[member][flip] = !include[member][flip];
        //debug('Flipping ' + member + ' ' + flip);
    }

    return {indices: indices, include: include};
}

module.exports = GA;

