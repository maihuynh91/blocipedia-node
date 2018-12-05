'use strict';

const faker = require("faker");
const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync();
let users = [];
//pass needs to be at least 10 chars
let password = "01233456789"
const hashedPassword = bcrypt.hashSync(password, salt);

for(let i = 1 ; i <= 15 ; i++){
 users.push({
   username: faker.internet.userName(),
   email: faker.internet.email(),
   password: hashedPassword,
   role: "standard",
   createdAt: new Date(),
   updatedAt: new Date(),
 });
}
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }


};
