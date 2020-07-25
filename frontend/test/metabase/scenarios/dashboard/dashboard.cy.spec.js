// *** What does this do? Is this covered in `parameters-embedded.cy.spec`?
// ("fetchDashboard(...)", () => {
//     ("should add the parameter values to state tree for public dashboards",
// *** below is in `parameters.cy.spec`
//     ("hides parameters named in 'hide_parameters' option",
//     ("shows previously added parameter",
import { restore, signInAsAdmin, popover } from "../../../__support__/cypress";

function saveDashboard() {
  cy.findByText("Save").click();
  cy.findByText("Saving…");
  cy.findByText("Saving…").should("not.exist");
}

describe("scenarios > dashboard", () => {
  beforeEach(() => {
    restore();
    signInAsAdmin();
  });

  it("should create new dashboard", () => {});

  it("should change title and description", () => {
    cy.visit("/dashboard/1");
    cy.get(".Icon-pencil").click();
    cy.get("input[value='Orders in a dashboard']")
      .clear()
      .type("Test Title");
    cy.findByPlaceholderText("No description yet")
      .clear()
      .type("Test description");

    cy.findByText("Save").click();
    cy.findByText("Test Title");
    cy.get(".Icon-info").click();
    cy.findByText("Test description");
  });

  it("should add a filter", () => {
    cy.visit("/dashboard/1");
    cy.get(".Icon-pencil").click();
    cy.get(".Icon-funnel_add").click();
    cy.findByText("Location").click();
    cy.findByText("State").click();
    cy.findByText("Select…").click();
    // *** having trouble actually selecting this item
    cy.get(".PopoverContainer .List-item")
      .invoke("trigger")
      .click();
    cy.pause();
    cy.findByText("Done").click();
    saveDashboard();

    cy.get(".DashCard").click();
  });

  it("should add a question", () => {
    cy.visit("/dashboard/1");
    cy.get(".QueryBuilder-section .Icon-add").click();
    cy.findByText("Orders, Count").click();
    saveDashboard();

    cy.findByText("Orders, Count");
  });

  it("should duplicate a dashboard", () => {
    cy.visit("/dashboard/1");
    cy.findByText("Orders in a dashboard");
    cy.get(".Icon-clone").click();
    cy.findByPlaceholderText("What is the name of your dashboard?")
      .clear()
      .type("Duplicate Dashboard");
    cy.findByText("Duplicate").click();

    cy.findByText("Orders in a dashboard").should("not.exist");
    cy.findByText("Duplicate Dashboard");
  });

  describe("revisions screen", () => {
    it("should open and close", () => {
      // open
      cy.visit("/dashboard/1");
      cy.get(".Icon-pencil").click();
      cy.get(".Icon-history").click();

      cy.findAllByText("Revision history");
      cy.findByText("When");
      cy.contains("Today");

      // close
      cy.get(".ModalContent .Icon-close").click();
      cy.findByText("Revision history").should("not.exist");
    });

    it("should open with url", () => {
      cy.visit("/dashboard/1/history");
      cy.findAllByText("Revision history");
    });
  });
});
