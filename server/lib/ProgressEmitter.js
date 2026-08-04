const EventEmitter = require('node:events');

class ProgressEmitter extends EventEmitter {};

const progressEmitter = new ProgressEmitter();

module.exports = {
  progressEmitter
}