var assert = require('assert')
var async = require('async')
var cp = require('child_process')
var dq = require('dq')
var path = require('path')

/* global describe, it */
// trinity: mocha

describe('cmd: delete', function () {
  it('should delete the list', function (done) {
    var args = ['-n', 'testq2'].join(' ')
    var names = ['testq1', 'testq2', 'testq3']
    function create (name, done) {
      var q = dq.connect({name: name})
      q.enq('data')
      q.quit(done)
    }

    async.forEach(names, create, function (err) {
      assert.ifError(err)
      dq.list({}, function (err, list) {
        assert.ifError(err)
        names.forEach(function (name) {
          assert(list.indexOf(name) >= 0)
        })

        cp.exec(path.resolve(__dirname, '../../bin/dq-delete ') + args, function (err, stdout, stderr) {
          assert.ifError(err)
          console.error(stderr)
          assert(!stderr)

          dq.list({}, function (err, list) {
            assert.ifError(err)

            assert(list.indexOf('testq1') >= 0)
            assert(list.indexOf('testq2') === -1)
            assert(list.indexOf('testq3') >= 0)
            done()
          })
        })
      })
    })
  })
})
