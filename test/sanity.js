const { test } = require('tape')

test('Instantiation', t => {
  let db = require('../index')

  t.ok(db !== undefined, 'Instantiated DB Client.')
  t.end()
})
