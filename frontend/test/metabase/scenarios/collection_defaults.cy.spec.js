import { restore, signInAsAdmin } from "_support_/cypress"

describe("scenarios > collection_defaults", () => {
    before(restore)

    describe("for admins", () => {
        beforeEach(signInAsAdmin);
        
        describe("a new collection", () => {
            it("should be the parent collection", () => {
                cy.request(`/collection/${collection.id}/new_collection`);
                // *** make new collection and check that it's the parent
            });
        });

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