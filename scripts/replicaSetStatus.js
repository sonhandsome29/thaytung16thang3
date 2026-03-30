var mongoose = require('mongoose');

async function run() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/admin?directConnection=true', {
      serverSelectionTimeoutMS: 5000
    });
    var admin = mongoose.connection.db.admin();
    var status = await admin.command({ replSetGetStatus: 1 });

    console.log('set:', status.set);
    console.log('myState:', status.myState);
    console.log('members:', status.members.map(function (member) {
      return member.name + ' ' + member.stateStr;
    }).join(', '));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(function () {});
  }
}

run();
