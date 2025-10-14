import { runTask, runValidation } from '../../support/commands.js'
const invalids = require('../../fixtures/invalidUsers.json')

describe('USer can not authenticate using invalid credentials (data-driven)', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  Object.entries(invalids).forEach(([name, data]) => {
    it(`shows correct error for ${name}`, () => {
      cy.then(() => runTask('performLogin', data))
        .then(() => runValidation('validateSignInErrorText', { expected: data.error }))
    })
  })
})