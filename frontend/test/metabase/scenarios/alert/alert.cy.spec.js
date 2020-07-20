import {
  restore,
  signInAsAdmin,
  setupLocalHostEmail,
  openPeopleTable,
  signInAsNormalUser,
  deleteAlert,
  createBasicAlert,
} from "__support__/cypress";
// Ported from alert.e2e.spec.js
// *** We should also check that alerts can be set up through slack

const raw_q_id = 1;
const timeseries_q_id = 3;

export function setGoal(number) {
  cy.findByText("Settings").click();
  cy.findByText("Line options");

  cy.findByText("Goal line")
    .next()
    .click();
  cy.get("input[value='0']")
    .clear()
    .type(number);
  cy.findByText("Done").click();
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
      // NOTE: Must run `python -m smtpd -n -c DebuggingServer localhost:1025` before these tests
      signInAsAdmin();
      cy.visit("/admin/settings/email");
      setupLocalHostEmail();
      cy.server();
    });

    it("should let admins create alerts", () => {
      // *** Use api call here
      // cy.request("POST", "api/alert", {
      //   alert_condition: "rows",
      //   card: {
      //     id: 1,
      //     include_csv: true,
      //     include_xls: false,
      //   },
      //   channels: [{
      //     schedule_type: "daily",
      //     channel_type: "email",
      //     recipients: [{
      //       id: 1,
      //       email: "admin@metabase.com",
      //       first_name: "Bobby",
      //       last_name: "Tables",
      //       common_name: "Bobby Tables"
      //     }],
      //   }],
      //   alert_first_only: "false",
      // });
      // cy.visit("/question/1");
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
      });
    });
  });

  describe("types of alerts", () => {
    before(() => {
      restore();
      signInAsAdmin();
      cy.visit("/admin/settings/email");
      setupLocalHostEmail();
      cy.server();
    });

    describe("'rows present' alert", () => {
      it("should be supported for raw data questions ", () => {
        cy.visit(`/question/${raw_q_id}`);
        cy.get(".Icon-table");

        createBasicAlert("first alert");

        cy.request("/api/alert/").then(response => {
          expect(response.body[0].alert_condition).to.equal("rows");
        });
      });

      it("should be supported for timeseries questions without a goal", () => {
        cy.visit(`/question/${timeseries_q_id}`);
        cy.get(".Icon-line");

        createBasicAlert("first alert");

        cy.request("api/alert").then(response => {
          expect(response.body[1].alert_condition).to.equal("rows");
        });
      });
    });

    describe("'goal' alert", () => {
      it("should work for timeseries questions with a set goal", () => {
        // Set goal on timeseries
        cy.visit(`/question/${timeseries_q_id}`);
        setGoal("7000");

        // Save question
        cy.findByText("Save").click();
        cy.findAllByText("Save")
          .last()
          .click();
        cy.findByText("Save question").should("not.exist");

        // Create alert
        cy.get(".Icon-bell").click();
        cy.findByText("Edit").click();
        cy.findByText("Goes above the goal line").click();
        cy.findByText("Every time").click();
        cy.findByText("Save changes").click();

        // Check api call
        cy.request("/api/alert/").then(response => {
          expect(response.body[1].alert_condition).to.equal("goal");
        });
      });
    });

    describe("time-multiseries questions with a set goal", () => {
      it("should fall back to raw data alert and show a warning", () => {
        // Create a time-multiseries q
        openPeopleTable();
        cy.findByText("Summarize").click();
        cy.findByText("Group by");
        // cy.contains("Doing science").then(() => {
        cy.findByText("Doing science")
          .should("not.exist")
          .then(() => {
            cy.findByText("Person");
            cy.findByText("Summarize by")
              .parent()
              .parent()
              .get(".Icon-calendar")
              .last()
              .scrollIntoView()
              .then(() => {
                cy.findByText("Source").click();
                cy.findByText("Created At")
                  .parent()
                  .parent()
                  .parent()
                  .within(() => {
                    cy.get(".Icon-add").click({ force: true });
                  });
              });
            // });
          });
        cy.findByText("Done").click();

        // Set a goal
        setGoal("35");
        cy.findByText("Save").click();
        cy.findAllByText("Save")
          .last()
          .click();
        cy.findByText("Not now").click();

        // Create Alert
        cy.get(".Icon-bell").click();
        cy.findByText("Set up an alert").click();
        cy.findByText("Goes above the goal line").click();
        cy.findByText("Every time").click();
        cy.findByText("Done").click();
        cy.findByText("Your alert is all set up.")
          .parent()
          .find(".Icon-close")
          .click();

        // Check that alert has changed to raw data/ is not 'goal'
        cy.request("/api/alert/").then(response => {
          expect(response.body[0].alert_condition).to.equal("rows");
        });
      });
    });
  });
});
