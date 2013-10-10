#!/usr/bin/env node

var argv = require('optimist').argv;
var through = require('through');

var term = [argv.t || argv.term].concat(argv._).join(' ').trim();

var filterEmpty = function (f) { return !!f.length; };

var extractData = function (val) {
  return val.toString()
            .split('\n')
            .filter(filterEmpty)
};

var jsonParse = function (str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return '{}';
  }
};

process.stdin.pipe(through(function (flannelOutput) {

  extractData(flannelOutput)
    .map(jsonParse)
    .forEach(function (data) {
      this.queue(require('util').inspect(data, { depth: null, colors: true }) + '\n\n');
    }.bind(this));

})).pipe(process.stdout);