import { runTask, runValidation } from "../../support/commands";
const users = require("../../fixtures/users.json");

describe("user can authenticat with valid credentials", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.printKernelRegs()
    cy.then(() => runTask('performLogin', users.standardUser))
  });

  it('adds items from users.json', () => {
    cy.printKernelRegs()

    cy
      // Add items based on titles stored in the user fixture:
      .then(() => runTask('performAddItemsByTitle', {
        titles: users.standardUser.items,   // e.g., ['Sauce Labs Backpack', 'Sauce Labs Bike Light']
        storeAs: 'pickedItems'
      }))
      // Open cart
      .then(() => runTask('performOpenCart'))
      // Validate cart page contents vs. what we added
      .then(() => runValidation('validateCartItemsMatch', { expected: 'pickedItems' }))
      // Proceed
      .then(() => runTask('performCheckout'))
      .then(() => runTask('performFillCheckoutInfo', {
        fromFixture: { userKey: 'standardUser' }
      }))
      // ✅ compare UI "Item total" vs sum of @pickedItems
      .then(() => runValidation('validateCheckoutItemSubtotalMatches', { fromAlias: 'pickedItems' }))
      // finish
      .then(() => runTask('performFinishCheckout'))
      .then(() => runTask('performSelectMenuItem', { text: 'Logout' }))
  })
});