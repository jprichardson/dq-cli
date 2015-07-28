var assert = require('assert')
var cp = require('child_process')
var async = require('async')
var dq = require('dq')
var path = require('path')

/* global describe, it */
// trinity: mocha

describe('cmd: list', function () {
  it('should the list', function (done) {
    var names = ['testq1', 'testq2', 'testq3']
    function create (name, done) {
      var q = dq.connect({name: name})
      q.enq('data')
      q.quit(done)
    }

    async.forEach(names, create, function (err) {
      assert.ifError(err)
      cp.exec(path.resolve(__dirname, '../../bin/dq-list'), function (err, stdout, stderr) {
        assert.ifError(err)
        assert(!stderr)

        var actualNames = stdout.trim().split('\n')
        assert(names.length >= 3)
        names.forEach(function (name) {
          assert(actualNames.some(function (n) {
            return (n.indexOf(name) === 0)
          }))
        })

        done()
      })
    })
  })
})
