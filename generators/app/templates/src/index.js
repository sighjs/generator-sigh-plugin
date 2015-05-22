<% if (deps.lodash) { %>import _ from 'lodash'
<% } if (deps.bluebird) { %>import Promise from 'bluebird'
<% } if (deps['sigh-core']) { %>import { Bacon } from 'sigh-core'
<% } if (options.oneToOne) { %>import { mapEvents } from 'sigh-core/lib/stream'
<% } if (options.multiCpu) { if (options.oneToOne) { %>
function <%= pluginNameCamelized %>Task(opts) {
  // this function is called once for each subprocess in order to cache state,
  // it is not a closure and does not have access to the surrounding state, use
  // `require` to include any modules you need, for further info see
  // https://github.com/ohjames/process-pool
  var log = require('sigh-core').log

  // this task runs inside the subprocess to transform each event
  return event => {
    var data, sourceMap
    // TODO: data = compile(event.data) etc.

    return { data, sourceMap }
  }
}

function adaptEvent(compiler) {
  // data sent to/received from the subprocess has to be serialised/deserialised
  return event => {
    if (event.type !== 'add' && event.type !== 'change')
      return event

    var { fileType } = event
    // if (fileType !== 'relevantType') return event

    return compiler(_.pick(event, 'type', 'data', 'path', 'projectPath')).then(result => {
      event.data = result.data

      if (result.sourceMap)
        event.applySourceMap(JSON.parse(result.sourceMap))

      // event.changeFileSuffix('newSuffix')
      return event
    })
  }
}
<% } %>
var pooledProc
<% } %>
export default function(op, opts = {}) {
<% if (options.multiCpu) { %>  if (! pooledProc)
    pooledProc = op.procPool.prepare(<%= pluginNameCamelized %>Task, opts, { module })
<% if (options.oneToOne) { %>
  return mapEvents(op.stream, adaptEvent(pooledProc))<% } else { %>
  // TODO: plugin code goes here<% }
} else if (options.oneToOne) { %>  return mapEvents(op.stream, function(event) {
    if (event.type !== 'add' && event.type !== 'change')
      return event

    var { fileType } = event
    // if (fileType !== 'relevantType') return event

    // TODO: alter event here or return a new event

    // event.changeFileSuffix('newSuffix')
    return event
  })<% } else { %>  // TODO: plugin code goes here<% } %>
}
