import {
  restore,
  signInAsAdmin,
  setupLocalHostEmail,
  openPeopleTable,
} from "__support__/cypress";
import { signInAsNormalUser, popover } from "../../../__support__/cypress";
// Ported from alert.e2e.spec.js
// *** We should also check that alerts can be set up through slack

const raw_q_id = 1;
const timeseries_q_id = 3;
function deleteAlert(id) {
  cy.request("DELETE", `/api/alert/${id}`);
}
function createBasicAlert() {
  cy.get(".Icon-bell").click();
  cy.findByText("Set up an alert").click();
  cy.findByText("Done").click();
  cy.findByText("Let's set up your alert").should("not.exist");
}

describe("scenarios > alert", () => {
  before(restore);
  beforeEach(signInAsAdmin);

  describe("with nothing set", () => {
    it("should prompt you to add email/slack credentials", () => {
      cy.visit("/question/1");
      cy.get(".Icon-bell").click();
      cy.findByText(
        "To send alerts, you'll need to set up email or Slack integration.",
      );
    });
    it("should say to non-admins that admin must add email credentials", () => {
      signInAsNormalUser();
      cy.visit("/question/1");
      cy.get(".Icon-bell").click();
      cy.findByText(
        "To send alerts, an admin needs to set up email integration.",
      );
    });
  });

  describe("with only email set", () => {
    before(() => {
      // NOTE: Must run `python -m smtpd -n -c DebuggingServer localhost:1025` before this test
      signInAsAdmin();
      cy.visit("/admin/settings/email");
      setupLocalHostEmail();
      cy.server();

      // *** Check creation of api
      // cy.route("POST", "/api/alert").as("alertCreation");
    });

    it("should let admins create alerts", () => {
      // Use api call here
    });

    describe("educational screen", () => {
      it("should show for the first alert, but not the second", () => {
        // Create first alert
        cy.visit("/question/1");
        cy.get(".Icon-bell").click();

        cy.findByText("The wide world of alerts");
        cy.contains("When a raw data question returns any results");

        cy.findByText("Set up an alert").click();
        cy.findByText("Done").click();

        // Create second alert
        cy.visit("/question/1");
        cy.get(".Icon-bell").click();

        cy.findByText("The wide world of alerts").should("not.exist");

        deleteAlert(1);
      });
    });

    describe("types of alerts", () => {
      it("should support 'rows present' alert for raw data questions", () => {
        cy.visit(`/question/${raw_q_id}`);
        cy.get(".Icon-table");

        createBasicAlert();

        cy.request("/api/alert/").then(({ request }) => {
          console.log("***request:", request);
          expect(request.body[0].alert_condition).to.have.value("rows");
        });
        deleteAlert(1);
      });
      it("should support 'rows present' alert for timeseries questions without a goal", () => {
        cy.visit(`/question/${timeseries_q_id}`);
        cy.get(".Icon-line");

        createBasicAlert();

        cy.request("/api/alert").then(({ request }) => {
          expect(request.body[0].alert_condition).to.have.value("rows");
        });
        deleteAlert(1);
      });
      it("should work for timeseries questions with a set goal", () => {
        // Set goal on timeseries
        cy.visit(`/question/${timeseries_q_id}`);
        cy.findByText("Settings").click();
        cy.findByText("Line options");

        cy.findByText("Goal line")
          .next()
          .click();
        cy.get("input[value='0']")
          .clear()
          .type("7000");
        cy.findByText("Done").click();

        // Save question
        cy.findByText("Save").click();
        cy.findAllByText("Save")
          .last()
          .click();

        // Create alert
        cy.get(".Icon-bell").click();
        cy.findByText("Set up an alert").click();
        cy.findByText("Goes above the goal line").click();
        cy.findByText("Every time").click();
        cy.findByText("Done").click();

        cy.request("/api/alert/").then(({ request }) => {
          expect(request.body[0].alert_condition).to.have.value("goal");
        });
        deleteAlert(1);
      });
      it.only("should fall back to raw data alert and show a warning for time-multiseries questions with a set goal", () => {
        // Create a time-multiseries q
        openPeopleTable();
        cy.findByText("Summarize").click();
        cy.findByText("Source").click();
        popover()
          .find("Created At")
          .trigger("mouseover");
        popover.get(".Icon-close").click();
        // Make alert
        // Set a goal
        // Check that alert has changed to raw data/ is no longer 'goal'
      });
    });

    describe("alert list for a question", () => {
      describe("as an admin", () => {
        it("should let you see all created alerts", () => {});
        it("should let you edit an alert", () => {});
      });
      describe("as a non-admin / normal user", () => {
        it("should let you see your own alerts", () => {});
        it("should let you see also other alerts where you are a recipient", () => {});
        it("should let you unsubscribe from both your own and others' alerts", () => {});
      });
    });
  });
});
