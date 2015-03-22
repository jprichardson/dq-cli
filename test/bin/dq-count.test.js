var cp = require('child_process')
var dq = require('dq')
require('terst')

/* global beforeEach, describe, EQ, F, it */
/* eslint-disable no-spaced-func */

var TESTQ = 'testq'

describe('cmd: count', function () {
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

  it('should return the count', function (done) {
    var args = ['-n', TESTQ]

    q.enq('a')
    q.enq('b')
    q.enq('c')
    q.quit(function (err) {
      F (err)
      cp.exec('./bin/dq-count ' + args.join(' '), function (err, stdout, stderr) {
        F (err)
        EQ (stdout.trim(), '3')
        done()
      })
    })
  })
})
