    import { faker } from '@faker-js/faker'

const randomName = faker.name.findName() ;
const randomEmail = faker.internet.email();
const randomCard = faker.helpers.createCard();

console.log(`Name ${randomName}`)
console.log(`email ${randomEmail}`)
console.log("Creating a card...");

console.log(faker.helpers.createCard());