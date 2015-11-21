var xbrz = require('node-xbrz/build/Release/xbrz.node'),
  clint = require('clint')(),
  glob = require('glob'),
  fs = require('fs'),
  path = require('path'),
  mkdirp = require('mkdirp');

clint.command('--help', '-h', 'General usage information')
clint.command('--input', '-i', 'glob pattern matching files')
clint.command('--output', '-o', 'the output folder')

var input = [], output;
clint.on('command', function(name, value) {
  switch (name) {
    case '--input':
	input.push(value);
        break;
    case '--output':
      output = value;
    break
  }
})

clint.on('complete', function() {
  if (input.length === 0 || !output){
    console.log('syntax: node index.js --input "glob path" --output outputpath')
    return
  }
  [].concat.apply([], input.map(function(p){
    return fs.exists(p) ? p : glob.sync(p)
  })).forEach(function(image){
    var outputPath = path.normalize(path.join(output, path.dirname(image)))
    mkdirp.sync(outputPath)
    var outputFile = path.normalize(path.join(output, image))
    if (outputFile.charAt(0) !== '/') {
      outputFile = './'+outputFile
    }
    console.log('resizing ' + image + ' into ' + outputFile)
    xbrz.resize(image, outputFile, '1.5')
  })
})

clint.parse(process.argv.slice(2))
