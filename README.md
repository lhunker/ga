# ga (Genetic Algorithm) [![Build Status](https://magnum.travis-ci.com/lhunker/ga.svg?token=qwSLr6vz4Z85Dh9xqDjB&branch=master)](https://magnum.travis-ci.com/lhunker/ga)
Genetic algorithms project for AI

#Running

The project is written in javascript and can be run using node.js which is available at
https://nodejs.org/en/

`npm install   //Install Dependencies

 node src/app.js <puzzle> <source_data> <seconds_runtime>`


(Note on some operating systems node is in the nodejs package due to a naming conflict)
where puzzle is 1-3, source_data is the file to use to populate tests, and the final arguments is seconds to run.
To run with mutation set the environment variable MUTATION equal to the number of mutations
To run with elitism set the environment variable ELITE equal to the number of parents to keep
To run with culling set the environment variable CULL equal to the number of children to cull

#Idea Sources

Culling: http://watchmaker.uncommons.org/manual/ch03.html
Order One Crossover: http://www.rubicite.com/Tutorials/GeneticAlgorithms/CrossoverOperators/Order1CrossoverOperator.aspx

#Authors
Lukas Hunker, Brett Ammeson, Dan Murray
