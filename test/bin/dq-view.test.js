var cp = require('child_process')
var dq = require('dq')
require('terst')

/* global beforeEach, describe, EQ, F, it */
/* eslint-disable no-spaced-func */

var TESTQ = 'testq'

describe('cmd: view', function () {
  var q

  beforeEach(function (done) {
    dq.delete({name: TESTQ}, function (err) {
      F (err)
      dq.connect({name: TESTQ}, function (err, _q) {
        F (err)
        q = _q
        done()
      })
    })
  })

  it('should export', function (done) {
    var args = ['-q', TESTQ]

    q.enq('hi', 0.1)
    q.enq('bye', 0.2)
    q.enq('hello', 0.3)
    q.quit(function (err) {
      F (err)
      cp.exec('./bin/dq-view ' + args.join(' '), function (err, stdout, stderr) {
        F (err)
        var data = stdout.trim()
        EQ (data, 'hi\nbye\nhello')
        done()
      })
    })
  })
})
