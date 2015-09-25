var fs = require('fs');

/**
 * Constructs an empty bin object
 */
function Bin() {
    this.list = [];
    this.permutate = true;
    this.include = false;
}

/**
 * Creates bins from specified file then calls callback
 * @param file File to load data from
 * @param callback Function to call on complete
 */
Bin.prototype.loadFile = function(file, callback) {
    var _this = this;
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.log('Error opening file: ' + err);
            process.exit(2);
        }

        data = data.split('\n');
        for (var i = 0; i < data.length; i++) {
            if (data[i] === '') continue;
            _this.list.push(parseFloat(data[i]));
        }

        callback();
    });
};
/**
 * Fitness function for Bin
 * Multiplies Bin 1 numbers and adds Bin 2
 * @param numbers Numbers in bins
 * @returns number score of configuration
 */
Bin.prototype.fitness = function(numbers) {
    // Multiplication, so default value is 1 not 0
    var score = 1;
    var score2 = 0;
    var i = 0;
    for (i; i < 10; i++)
        score *= numbers[i];
    for (i; i < 20; i++) {
        score2 += numbers[i];
    }
    return (score + score2) / 2;
};

module.exports = Bin;
