var _ = require('underscore');
var async = require('async');
var ENDSYM = '$$$END$$$';

module.exports = function() {
    return {
        addTransition: function(from, to) {
            to = to === null ? ENDSYM: to;
            var fromObj = null;
            if (from === null) {
                fromObj = this.beginnings;
            }
            else {
                if (!this.data.hasOwnProperty(from)) {
                    this.data[from] = {
                        transitions: {},
                        totalTransitions: 0
                    };
                }
                fromObj = this.data[from];
            }
            if (!fromObj.transitions.hasOwnProperty(to)) {
                fromObj.transitions[to] = 0;
            }
            fromObj.transitions[to]++;
            fromObj.totalTransitions++;
        },
        data: {},
        beginnings: {
            transitions: {},
            totalTransitions: 0
        },
        learn: function(sample) {
            sample = sample.split(' ');
            for (var i = 0; i < sample.length; i++) {
                var prev = i === 0 ? null : sample[i-1].toLowerCase();
                var cur = sample[i].toLowerCase();
                var atEnd = i + 1 >= sample.length;
                this.addTransition(prev,cur);
                if (atEnd) {
                    this.addTransition(cur, null);
                }
            }
        },
        getNext: function(state, cb) {
            var fromObj;
            if (state === null) {
                fromObj = this.beginnings;
            }
            else {
                fromObj = this.data[state];
            }
            var num = parseInt(Math.random() * fromObj.totalTransitions) + 1;
            var next = null;
            async.eachSeries(_.keys(fromObj.transitions), function(key, callback) {
                if (num <= 0) {
                    callback();
                    return;
                }
                next = key;
                num -= fromObj.transitions[key];
                callback();
            }, function() {
                cb(next);
            });
        },
        display: function(callback) {
            var word = null;
            var str = '';
            async.doWhilst(function(cb) {
                this.getNext(word, function(next) {
                    if (next === ENDSYM) {
                        word = null;
                        cb();
                        return;
                    }
                    word = next;
                    str += next + ' ';
                    cb();
                });
            }.bind(this),
            function() {
                return word !== null;
            },function() {
                callback(str);
            });
        }
    };
};
