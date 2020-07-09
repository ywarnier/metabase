import { restore, signInAsAdmin } from "__support__/cypress";
// Ported from initial_collection.e2e.spec.js

// Z because the api lists them alphabetically by name, so it makes it easier to check
const collection_name = "Z Collection"
const sub_collection_name = "ZZ Sub-Collection"

describe("scenarios > collection_defaults", () => {
    before(() => {
        restore();
        cy.server()
    });

    describe("for admins", () => {
        beforeEach(signInAsAdmin);
        
        describe("a new collection", () => {
            it("should be the parent collection", () => {
                // Make new collection
                cy.request("POST", "api/collection/", {
                    name: collection_name,
                    color: "#ff9a9a",
                    personal_owner_id: 1,
                });

                // Check that it has no parent
                let length = 7
                cy.request("api/collection").then((response) => {
                    expect(response.body).to.have.length(length);
                    expect(response.body[length - 1].name).to.equal(collection_name);
                    expect(response.body[length - 1].location).to.equal("/")
                });
            });

            it("should be a sub collection", () => {
                // Make new sub collection
                cy.request("POST", "api/collection/", {
                    name: sub_collection_name,
                    color: "#ff9a9a",
                    personal_owner_id: 1,
                    parent_id: 1
                });

                // Check that it has a parent
                let length = 8
                cy.request("api/collection").then((response) => {
                    expect(response.body).to.have.length(length);
                    expect(response.body[length - 1].name).to.equal(sub_collection_name);
                    expect(response.body[length - 1].location).to.equal("/1/")
                });
            });
        });

        describe("a new pulse", () => {
            it("should be the root collection", () => {
                // Create new pulse
                cy.request("POST", "/api/pulse", {
                    name: pulse_name,
                    cards: [],
                    chanels: [],
                });
                cy.visit("/")
                cy.pause()
                cy.request("/api/pulse")
                // *** check the root collection name
            });
        });

        describe("a new dashboard", () => {
            it("should be the root collection", () => {
                cy.pause()
                // *** create new dashboard and check the root collection name
            });
        });
    });

    describe("for users", () => {
        describe("a new pulse", () => {
            it("should be the root collection", () => {
                cy.request("/pulse/create");
                // *** check the root collection name
            });
        });

        describe("a new dashboard", () => {
            it("should be the root collection", () => {
                // *** create new dashboard and check the root collection name
            });
        });
    });
});