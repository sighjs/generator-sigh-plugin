<% if (deps.lodash) { %>import _ from 'lodash'
<% } if (deps.bluebird) { %>import Promise from 'bluebird'
<% } if (options.multiCpu) { %>import ProcessPool from 'process-pool'
<% } %>import { Bacon } from 'sigh-core'
import Event from 'sigh-core'

import <%= pluginNameCamelized %> from '../'

require('source-map-support').install()
require('chai').should()

describe('sigh-<%= pluginName %>', () => {<%
if (options.multiCpu) {%>
  var procPool
  beforeEach(() => { procPool = new ProcessPool() })
  afterEach(() => { procPool.destroy() })
<% } %>
  xit('TODO: should do something', () => {
    // TODO:
  })
})
