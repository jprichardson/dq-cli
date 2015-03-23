var assert = require('assert')
var cp = require('child_process')
var async = require('async')
var dq = require('dq')
require('terst')

/* global beforeEach, describe, EQ, F, it */
/* eslint-disable no-spaced-func */

describe('cmd: delete', function () {
  it('should delete the list', function (done) {
    var names = ['testq1', 'testq2', 'testq3']
    function create (name, done) {
      var q = dq.connect({name: name})
      q.enq('data')
      q.quit(done)
    }

    async.forEach(names, create, function (err) {
      dq.list({}, function (err, list) {
        names.forEach(function (name) {
          T (list.indexOf(name) >= 0)
        })

        cp.exec('./bin/dq-delete ' + ['-n', 'testq2'].join(' '), function (err, stdout, stderr) {
          F (err)
          F (stderr)

          dq.list({}, function (err, list) {
            F (err)

            T (list.indexOf('testq1') >= 0)
            F (list.indexOf('testq2') >= 0)
            T (list.indexOf('testq3') >= 0)
            done()
          })
        })
      })
    })
  })
})
