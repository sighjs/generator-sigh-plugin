<% if (deps.lodash) { %>import _ from 'lodash'
<% } if (deps.bluebird) { %>import Promise from 'bluebird'
<% } if (deps['sigh-core']) { %>import { Bacon } from 'sigh-core'
<% } if (options.oneToOne) { %>import { mapEvents } from 'sigh-core/lib/stream'
<% } %>
export default function(op, opts = {}) {
  <% if (options.oneToOne) { %>return mapEvents(op.stream, function(event) {
    if (event.type !== 'add' && event.type !== 'change')
      return event

    // TODO: alter event here or return a new event
    return event
  })<% } else { %>// plugin code goes here<% } %>
}
