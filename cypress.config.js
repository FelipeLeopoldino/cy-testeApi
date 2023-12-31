const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://api.typeform.com",
    env: {
      API_BASE_URL: "https://api.typeform.com",
    },
  },
});
