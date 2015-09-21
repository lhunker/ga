var fs = require('fs');

/**
 * Constructs an empty number packer object (using title from assignment)
 */
function Packer() {
    this.goal = 0;
    this.options = [];
}

/**
 * Loads a set of numbers from a given file
 * @param file String representing file to load
 */
Packer.prototype.load = function(file) {
    var _this = this;
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.log('Error opening file: ', err);
            process.exit(2);
        }
        data = data.split('\n');
        _this.goal = parseInt(data[0]);
        var i;
        for (i = 1; i < data.length; i++)
            _this.options.push(parseInt(data[i]));
    });
}

module.exports = Packer;
