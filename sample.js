var markov = require('./index.js');
var fs = require('fs');

var m = new markov;

var verse = /^([A-Z][a-z][a-z])\|(\d+)\|(\d+)\|\W(.+)~$/;


var bookRegex = /Gen/;

fs.readFile('kjvdat.txt', 'ascii', function(err, data) {
    data = data.split("\r\n");
    for (var i = 0; i < data.length; i++) {
        var res = data[i].match(verse);
        if (res) {
            if (res[1].match(bookRegex)) {
                m.learn(res[4]);
            }
        }
    }
    fs.readFile('lilwayne.txt', 'utf8', function(err, data) {
        data = data.split("\n");
        for (var i = 0; i < data.length; i++) {
            if (data[i] !== '') {
                m.learn(data[i]);
            }
        }
        m.display(function(str) {
            console.log(str);
        });
    });
});

