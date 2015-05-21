<% if (deps.lodash) { %>import _ from 'lodash'
<% } if (deps.bluebird) { %>import Promise from 'bluebird'
<% } %>import { Bacon } from 'sigh-core'
import Event from 'sigh/lib/Event'

import <%= pluginNameCamelized %> from '../'

require('source-map-support').install()
require('chai').should()

describe('sigh-<%= pluginName %>', () => {
  xit('TODO: should do something', () => {
    // TODO:
  })
})
