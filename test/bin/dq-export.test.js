var assert = require('assert')
var cp = require('child_process')
var dq = require('dq')
var path = require('path')

/* global beforeEach, describe, it */
// trinity: mocha

var TESTQ = 'testq'

describe('cmd: export', function () {
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

  it('should export', function (done) {
    var args = ['-n', TESTQ].join(' ')

    q.enq('hi', 0.1)
    q.enq('bye', 0.2)
    q.enq('hello', 0.3)
    q.quit(function (err) {
      assert.ifError(err)
      cp.exec(path.resolve(__dirname, '../../bin/dq-export ') + args, function (err, stdout, stderr) {
        assert.ifError(err)
        var data = stdout.trim()
        assert.strictEqual(data, 'hi\nbye\nhello')
        done()
      })
    })
  })
})
