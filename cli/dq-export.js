var dq = require('dq')
var program = require('commander')
var args = require('../lib/args')
var exit = require('../lib/exit')
var streams = require('../lib/streams')
var writeStream = require('../lib/write-stream')

function dqExport (/** process.argv **/) {
  args(program, arguments)
  var s = streams(program)

  // program contains config
  dq.connect(program, function (err, q) {
    if (err) exit(1, err)

    function again () {
      q.deq(function (err, item) {
        if (err) process.exit(1)
        if (item == null) process.exit(0)
        console.log(item)
        again()
      })
    }
    again()
  })
}

module.exports = dqExport
