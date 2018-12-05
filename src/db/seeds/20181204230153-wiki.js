'use strict';

const faker = require("faker");

let wiki = [];

for(let i = 1; i<=15; i++){
  wiki.push({
    title: faker.hacker.noun(),
    body: faker.hacker.phrase(),
    private: false,
    userId: i,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {

    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert("Wikis", wiki, {});
        },

    down: (queryInterface, Sequelize) => {

      return queryInterface.bulkDelete("Wikis", null, {});

    }
  };
