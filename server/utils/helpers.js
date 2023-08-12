function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateUserData() {
  return {
    name: getRandomInt(1, 5),
    role: 'editor',
    login_ts: Date.now(),
  };
}

module.exports = {
  generateUserData,
};
