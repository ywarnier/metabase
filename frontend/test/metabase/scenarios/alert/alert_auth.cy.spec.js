import {
  restore,
  signInAsAdmin,
  signInAsNormalUser,
  setupLocalHostEmail,
  createBasicAlert,
} from "../../../__support__/cypress";
// Port from alert.e2e.spec.js

describe("scenarios > alert > auth for alerts", () => {
  before(() => {
    restore();
    signInAsAdmin();

    // Setup email
    // NOTE: Must run `python -m smtpd -n -c DebuggingServer localhost:1025` before these tests
    signInAsAdmin();
    cy.visit("/admin/settings/email");
    setupLocalHostEmail();

    // Create alert as admin
    cy.visit("/question/1");
    createBasicAlert("first alert");

    // Create alert as admin that user can see
    cy.visit("/question/2");
    createBasicAlert("include normal");

    // Create alert as normal user
    signInAsNormalUser();
    cy.visit("/question/3");
    createBasicAlert();
  });

  describe("as an admin", () => {
    beforeEach(signInAsAdmin);

    it("should let you see all created alerts", () => {
      // Check that both alerts are there
      // **** Still needs to happen
      cy.visit("/");
    });

    it("should let you edit an alert", () => {
      // Change alert
      cy.visit(`/question/1`);
      cy.get(".Icon-bell").click();
      cy.findByText("Edit").click();
      cy.findByText("Daily").click();
      cy.findByText("Weekly").click();
      cy.findByText("Save changes").click();

      // Check that changes stuck
      cy.wait(1000);
      // *** code here

      // Change alert back
      cy.get(".Icon-bell").click();
      cy.findByText("Edit").click();
      cy.findByText("Weekly").click();
      cy.findByText("Daily").click();
    });
  });
  describe("as a non-admin / normal user", () => {
    beforeEach(signInAsNormalUser);

    it("should not let you see other people's alerts", () => {
      cy.visit("/question/1");
      cy.get(".Icon-bell").click();
      cy.findByText("Unsubscribe").should("not.exist");
      cy.findByText("Set up an alert");
    });

    it("should let you see other alerts where you are a recipient", () => {
      cy.visit("/question/2");
      cy.get(".Icon-bell").click();
      cy.findByText("You're receiving Bobby's alerts");
      cy.findByText("Set up your own alert");
    });

    it("should let you see your own alerts", () => {
      cy.visit("/question/3");
      cy.get(".Icon-bell").click();
      cy.findByText("You set up an alert");
    });

    it("should let you unsubscribe from both your own and others' alerts", () => {
      // Unsubscribe from your own alert
      cy.visit("/question/3");
      cy.get(".Icon-bell").click();
      cy.findByText("Unsubscribe").click();

      cy.findByText("Okay, you're unsubscribed");

      // Unsubscribe from others' alerts
      cy.visit("/question/2");
      cy.get(".Icon-bell").click();
      cy.findByText("Unsubscribe").click();

      cy.findByText("Okay, you're unsubscribed");
    });
  });
});
