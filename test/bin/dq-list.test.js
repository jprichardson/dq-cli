var assert = require('assert')
var cp = require('child_process')
var async = require('async')
var dq = require('dq')
require('terst')

/* global beforeEach, describe, EQ, F, it */
/* eslint-disable no-spaced-func */

describe('cmd: list', function () {
  it('should the list', function (done) {
    var names = ['testq1', 'testq2', 'testq3']
    function create (name, done) {
      var q = dq.connect({name: name})
      q.enq('data')
      q.quit(done)
    }

    async.forEach(names, create, function (err) {
      cp.exec('./bin/dq-list', function (err, stdout, stderr) {
        F (err)
        F (stderr)

        var actualNames = stdout.trim().split('\n')
        T (names.length >= 3)
        names.forEach(function (name) {
          T (actualNames.indexOf(name) >= 0)
        })

        done()
      })
    })
  })
})
