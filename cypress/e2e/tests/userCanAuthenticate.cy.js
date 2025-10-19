import { runTask, runValidation } from '../../support/commands.js'
const users = require('../../fixtures/users.json')

describe('user can authenticat with valid credentials', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('logs in and lands on dashboard', () => {
    cy.then(() =>
      runTask('performLogin', users.standardUser)
    ).then(() =>
      runValidation('validateInventoryIsVisible')
    )
  })
})