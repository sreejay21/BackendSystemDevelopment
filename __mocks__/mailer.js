// __mocks__/mailer.js
module.exports = {
  sendMail: jest.fn().mockResolvedValue(true) // pretend emails were sent
};
