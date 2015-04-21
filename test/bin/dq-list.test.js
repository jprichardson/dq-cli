var cp = require('child_process')
var async = require('async')
var dq = require('dq')
require('terst')

/* global describe, F, it, T */
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
      F (err)
      cp.exec('./bin/dq-list', function (err, stdout, stderr) {
        F (err)
        F (stderr)

        var actualNames = stdout.trim().split('\n')
        T (names.length >= 3)
        names.forEach(function (name) {
          T (actualNames.some(function (n) {
            return (n.indexOf(name) === 0)
          }))
        })

        done()
      })
    })
  })
})
