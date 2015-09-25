var fs = require('fs');

/**
 * Constructs an empty number packer object (using title from assignment)
 */
function Packer() {
    this.goal = 0;
    this.list = [];
    this.permutate = false;
    this.include = true;
}

/**
 * Loads a set of numbers from a given file
 * @param file String representing file to load
 * @param callback Function to run after loading the file
 */
Packer.prototype.loadFile = function(file, callback) {
    var _this = this;
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.log('Error opening file: ', err);
            process.exit(2);
        }
        data = data.split('\n');
        _this.setGoal(parseInt(data[0]));
        var i;
        for (i = 1; i < data.length; i++) {
            if (data[i] === '') continue;
            _this.list.push(parseInt(data[i]));
        }

        callback();
    });
};

/**
 * Sets goal
 * @param goal value to set goal to
 */
Packer.prototype.setGoal = function(goal) {
    this.goal = goal;
};

/**
 * Calculates fitness via sum, if greater than goal returns 0
 * @param numbers to use in calculating sum
 * @returns integer representing sum, 0 if above goal
 */
Packer.prototype.fitness = function(numbers) {
    var sum = 0;
    for (var i = 0; i < numbers.length; i++) {
        sum += numbers[i];
        if (sum > this.goal) return 0;
    }
    return sum;
};

/**
 * Formats the print string
 * @param values an array of values
 * @returns {string}
 */
Packer.prototype.printResults = function(values){
    return values.join(', ');
};

module.exports = Packer;
