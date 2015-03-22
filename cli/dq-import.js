var byline = require('byline')
var dq = require('dq')
var program = require('commander')
var args = require('../lib/args')
var exit = require('../lib/exit')
var streams = require('../lib/streams')

function dqImport (/** process.argv **/) {
  program.option('-s, --shuffle', 'insert in random order')
  args(program, arguments)
  var s = streams(program)

  var count = 0

  // program contains config
  dq.connect(program, function (err, q) {
    if (err) exit(1, err)

    var lineStream = byline(s.input)
    lineStream.on('data', function (line) {
      if (program.shuffle) {
        q.enq(line, Math.random())
      } else {
        q.enq(line, count)
      }
      count += 1
    })

    lineStream.on('end', function () {
      setImmediate(function () {
        q.quit()
      })
    })
  })
}

module.exports = dqImport
