var dq = require('dq')
var program = require('commander')

function count (/** process.argv **/) {
  program
    .version(require('../package.json').version)
    .option('-h, --host [host]', 'host of redis server, the default is localhost')
    .option('-a, --auth [password]', 'password of redis server')
    .option('-p, --port [number]', 'port of redis server, the default is 6379')
    .option('-q, --queue <queueName>', 'name of the queue')
    .parse(process.argv)

  program.name = program.queue
  program.password = program.auth

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
