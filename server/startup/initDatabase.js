// нужно проверить что в БД есть mock data
const departsMock = require('../mockData/departs.json');
const reportsMock = require('../mockData/reports.json');
const usersMock = require('../mockData/users.json');
const Depart = require('../model/Depart.js');
const Report = require('../model/Report.js');
const User = require('../model/User.js');
const bcrypt = require('bcryptjs');

module.exports = async () => {
  const departs = await Depart.find();
  if (departs.length !== departsMock.length) {
    await createInitEntity(Depart, departsMock);
  }

  const reports = await Report.find();
  if (reports.length !== reportsMock.length) {
    await createInitEntity(Report, reportsMock);
  }

  const users = await User.find();
  if (users.length !== usersMock.length) {
    await createInitEntity(User, usersMock);
  }
};

async function createInitEntity(Model, data) {
  await Model.collection.drop();
  return Promise.all(
    data.map(async (item) => {
      try {
        //delete item._id;
        if (item.password) {
          const hashPass = await bcrypt.hash(item.password, 10);
          item.password = hashPass;
        }
        const newItem = new Model(item);
        await newItem.save();
        return newItem;
      } catch (e) {
        console.log(e);
        return e;
      }
    })
  );
}
