var cp = require('child_process')
var dq = require('dq')
require('terst')

/* global beforeEach, describe, EQ, F, it, T */
/* eslint-disable no-spaced-func */

var TESTQ = 'testq'

describe('cmd: import', function () {
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

  describe('> when no shuffle', function () {
    it('should import', function (done) {
      var data = ['a1', 'b1', 'c1']
      var args = ['-q', TESTQ]

      var prog = cp.spawn('./bin/dq-import', args)

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
          F (err)
          EQ (data.join(','), res.join(','))
          done()
        })
      })

      prog.stdin.end()
    })
  })

  describe('> when shuffle', function () {
    it('should import shuffled', function (done) {
      var data = ['a1', 'b1', 'c1']
      var args = ['-q', TESTQ, '--shuffle']

      var prog = cp.spawn('./bin/dq-import', args)

      prog.stdout.on('data', function (data) {
        console.log('stdout: ' + data)
      })

      data.forEach(function (item) {
        prog.stdin.write(item + '\n')
      })

      prog.on('close', function () {
        q.peak(0, 3, function (err, res) {
          F (err)
          data.forEach(function (item) {
            T (res.indexOf(item) >= 0)
          })
          EQ (data.length, 3)
          done()
        })
      })

      prog.stdin.end()
    })
  })
})
