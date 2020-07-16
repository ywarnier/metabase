import { restore, signInAsAdmin, setupLocalHostEmail } from "__support__/cypress"
import { signInAsNormalUser } from "../../../__support__/cypress";
// Ported from alert.e2e.spec.js
// *** We should also check that alerts can be set up through slack

function deleteAlert(id) {
    cy.request("DELETE", `/api/alert/${id}`)
}
function createBasicAlert() {
    cy.get(".Icon-bell").click();
    cy.findByText("Set up an alert").click();
    cy.findByText("Done").click();
}

describe("scenarios > alert", () => {
    before(restore);
    beforeEach(signInAsAdmin);
    
    describe("with nothing set", () => {
        it("should prompt you to add email/slack credentials", () => {
            cy.visit("/question/1");
            cy.get(".Icon-bell").click();
            cy.findByText("To send alerts, you'll need to set up email or Slack integration.");
        });
        it("should say to non-admins that admin must add email credentials", () => {
            signInAsNormalUser();
            cy.visit("/question/1");
            cy.get(".Icon-bell").click();
            cy.findByText("To send alerts, an admin needs to set up email integration.");
        });
    });
    
    describe("with only email set", () => {
        before(() => {
            // NOTE: Must run `python -m smtpd -n -c DebuggingServer localhost:1025` before this test
            signInAsAdmin();
            cy.visit("/admin/settings/email");
            setupLocalHostEmail();
            cy.server();
        });
        beforeEach(() => {
            cy.request("/api/alert").then(({ request }) => { 
                if (request != undefined ) {
                    deleteAlert(id_num);
                }
            });
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
            });
        });

        describe.only("types of alerts", () => {
            it("should support 'rows present' alert for raw data questions", () => {
                cy.visit("/question/1");
                cy.get(".Icon-table");

                createBasicAlert();
                
                cy.request("/api/alert").then(({ request }) => {
                    expect(request.body[0].alert_condition).to.have.value("rows");
                });
            });
            it("should support 'rows present' alert for timeseries questions without a goal", () => {
                cy.visit("/question/3");
                cy.get(".Icon-line")

                createBasicAlert();

                cy.request("/api/alert").then(({ request }) => {
                    expect(request.body[1].alert_condition).to.have.value("rows");
                });
            });
            it("should work for timeseries questions with a set goal", () => {
                // Set goal on timeseries

                // Create alert
            });
            it("should fall back to raw data alert and show a warning for time-multiseries questions with a set goal", () => {
                
            });
        });
        
        describe("alert list for a question", () => {
            describe("as an admin", () => {
                it("should let you see all created alerts", () => {
                    
                });
                it("should let you edit an alert", () => {
                    
                });
            });
            describe("as a non-admin / normal user", () => {
                it("should let you see your own alerts", () => {
                    
                });
                it("should let you see also other alerts where you are a recipient", () => {
                    
                });
                it("should let you unsubscribe from both your own and others' alerts", () => {
                    
                });
            });
        });
    });
});