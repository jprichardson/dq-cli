var assert = require('assert')
var cp = require('child_process')
var dq = require('dq')
var path = require('path')

/* global beforeEach, describe, it */
// trinity: mocha

var TESTQ = 'testq'

describe('cmd: import', function () {
  var cmd = path.resolve(__dirname, '../../bin/dq-import')
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

  describe('> when no shuffle', function () {
    it('should import', function (done) {
      var data = ['a1', 'b1', 'c1']
      var args = ['-n', TESTQ]

      var prog = cp.spawn(cmd, args)

      prog.stdout.on('data', function (data) {
        console.log('stdout: ' + data)
      })

      prog.stderr.on('data', function (data) {
        console.error('stderr: ' + data)
      })

      data.forEach(function (item) {
        prog.stdin.write(item + '\n')
      })

      prog.on('close', function () {
        q.peak(0, 3, function (err, res) {
          assert.ifError(err)
          assert.strictEqual(data.join(','), res.join(','))
          done()
        })
      })

      prog.stdin.end()
    })
  })

  describe('> when shuffle', function () {
    it('should import shuffled', function (done) {
      var data = ['a1', 'b1', 'c1']
      var args = ['-n', TESTQ, '--shuffle']

      var prog = cp.spawn(cmd, args)

      prog.stdout.on('data', function (data) {
        console.log('stdout: ' + data)
      })

      data.forEach(function (item) {
        prog.stdin.write(item + '\n')
      })

      prog.on('close', function () {
        q.peak(0, 3, function (err, res) {
          assert.ifError(err)
          data.forEach(function (item) {
            assert(res.indexOf(item) >= 0)
          })
          assert.strictEqual(data.length, 3)
          done()
        })
      })

      prog.stdin.end()
    })
  })
})
