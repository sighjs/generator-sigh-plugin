<% if (deps.lodash) { %>import _ from 'lodash'
<% } if (deps.bluebird) { %>import Promise from 'bluebird'
<% } %>import { Bacon } from 'sigh-core'
import Event from 'sigh/lib/Event'

import template from '../'

require('source-map-support').install()
require('chai').should()

describe('sigh-template', () => {
  xit('TODO: should do something', () => {
    // TODO:
  })
})
