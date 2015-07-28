var assert = require('assert')
var cp = require('child_process')
var dq = require('dq')
var path = require('path')

/* global beforeEach, describe, it */
// trinity: mocha

var TESTQ = 'testq'

describe('cmd: count', function () {
  var q

  beforeEach(function (done) {
    dq.delete({name: TESTQ}, function (err) {
      assert.ifError(err)
      dq.connect({name: TESTQ}, function (err, _q) {
        assert.ifError(err)
        q = _q
        done()
      })
    })
  })

  it('should return the count', function (done) {
    var args = ['-n', TESTQ].join(' ')

    q.enq('a')
    q.enq('b')
    q.enq('c')
    q.quit(function (err) {
      assert.ifError(err)
      cp.exec(path.resolve(__dirname, '../../bin/dq-count ') + args, function (err, stdout, stderr) {
        assert.ifError(err)
        assert.strictEqual(stdout.trim(), '3')
        done()
      })
    })
  })
})
