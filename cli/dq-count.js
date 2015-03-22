var dq = require('dq')
var program = require('commander')
var args = require('../lib/args')

function count (/** process.argv **/) {
  args(program, arguments)

  dq.create(program, function (err, q) {
    if (err) {
      console.error('Error: ' + err.message)
      process.exit(1)
    }

    q.count(function (err, count) {
      if (err) console.error(err)
      console.log(count)
      q.quit()
    })
  })
}

module.exports = count
