const API_URL = Cypress.env("API_BASE_URL");
const authorization = `Bearer ${Cypress.env("TYPEFORM_ACCESS_TOKEN")}`;

import sampleForm, {
  title as _title,
  fields as _fields,
  type as _type,
} from "../fixtures/sampleForm.json";

describe("Typeform API tests", () => {
  it("retrieves my user information", () => {
    cy.request({
      method: "GET",
      url: `${API_URL}/me`,
      headers: { authorization },
    }).should(({ status, body }) => {
      const { alias, email, language } = body;

      expect(status).to.eq(200);
      expect(alias).to.eq(Cypress.env("userAlias"));
      expect(email).to.eq(Cypress.env("email"));
      expect(language).to.eq("en");
    });
  });

  it("retrives form responses", () => {
    cy.request({
      method: "GET",
      url: `${API_URL}/forms/${Cypress.env("formId")}/responses`,
      headers: { authorization },
    }).should(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.total_items).to.eq(body.items.length);
    });
  });

  context("Cleanup before start", () => {
    beforeEach(() => {
      cy.request({
        method: "GET",
        url: `${API_URL}/forms`,
        headers: { authorization },
      }).then((response) => {
        expect(response.status).to.eq(200);

        response.body.items.forEach((item) => {
          if (item.title === _title) {
            cy.request({
              method: "DELETE",
              url: `${API_URL}/forms/${item.id}`,
              headers: { authorization },
            }).then((deleteResponse) => {
              expect(deleteResponse.status).to.eq(204);
            });
          }
        });
      });
    });
    it.only("creates a sample form", () => {
      cy.request({
        method: "POST",
        url: `${API_URL}/forms`,
        headers: { authorization },
        body: sampleForm,
      }).should(({ status, body }) => {
        const { fields, title, type } = body;
        expect(status).to.eq(201);
        expect(fields.length).to.eq(_fields.length);
        expect(title).to.eq(_title);
        expect(type).to.eq(_type);
      });
    });
  });
});
