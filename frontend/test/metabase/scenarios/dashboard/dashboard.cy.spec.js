// *** What does this do? Is this covered in `parameters-embedded.cy.spec`?
// ("fetchDashboard(...)", () => {
//     ("should add the parameter values to state tree for public dashboards",
// *** below is in `parameters.cy.spec`
//     ("hides parameters named in 'hide_parameters' option",
//     ("shows previously added parameter",
import { restore, signInAsAdmin, popover } from "../../../__support__/cypress";

describe("scenarios > dashboard", () => {
  before(restore);
  beforeEach(signInAsAdmin);

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
    popover().within(() => {
      cy.findByText("State").click();
    });
    cy.findByText("Done").click();
    cy.findByText("Save").click();
    cy.pause();
    cy.findByText("You are editing a dashboard").should("not.exist");

    cy.get(".DashCard").click();
    cy.pause();
  });
  it("should add a question", () => {});
  it("should add a card", () => {});
  it("should duplicate a dashboard", () => {});
  describe("revisions screen", () => {
    it("should open and close", () => {});
    it("should open with url", () => {});
  });
});
