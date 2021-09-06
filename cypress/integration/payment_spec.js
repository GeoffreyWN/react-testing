// const { cy } = require("date-fns/locale");
const { v4: uuidv4 } = require("uuid");

describe("payment", () => {
  it("user can make payment", () => {
    //login user
    cy.visit("/");
    cy.findByRole("textbox", { name: /username/i }).type("johndoe");
    cy.findAllByLabelText(/password/i).type("s3cret");
    cy.findByRole("checkbox", { name: /remember me/i }).check();
    cy.findByRole("nutton", { name: /sign in/i }).click();

    //check account balance
    let oldBalance;
    cy.get("[data-test=sidenav-user-balance]").then(($balance) => (oldBalance = $balance.text()));
    //   .then((balance) => console.log(balance));

    // click on new button
    cy.findByRole("button", { name: /new/i }).click();

    // search for user
    cy.findByRole("textbox").type("devon becker");
    cy.findByText(/devon becker/i).click();

    //add amount and note and click payment
    const paymentAmount = "5.00";
    cy.findAllByPlaceholderText(/amount/i).type("5");
    const note = uuidv4();
    cy.findAllByPlaceholderText(/add a note/i).type(note);
    cy.findByRole("button", { name: /pay/i }).click();

    //return to transaction
    cy.findByRole("button", { name: /return to transactions/i }).click();

    //go to personal payments
    cy.findByRole("tab", { name: /mine/i }).click();

    //click on payment
    // cy.findByText(note).scrollIntoView();
    cy.findByText(note).click({ force: true });

    //verify if payment was made
    cy.findByText(`${paymentAmount}`).should("be.visible");
    cy.findByText(note).should("be.visible");

    // verify if payment was deducted
    cy.get("[data-test=sidenav-user-balance]").then(($balance) => {
      const convertedOldBalance = parseFloat(oldBalance.replace(/\$|,/g, ""));
      const convertedNewBalance = parseFloat($balance.text().replace(/\$|,/g, ""));
      expect(convertedOldBalance - convertedNewBalance).to.equal(parseFloat(paymentAmount));
    });
  });
});
