var mongoose = require('mongoose');

async function run() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/admin?directConnection=true', {
      serverSelectionTimeoutMS: 5000
    });
    var admin = mongoose.connection.db.admin();

    try {
      var status = await admin.command({ replSetGetStatus: 1 });
      console.log('Replica set already configured:', status.set);
      return;
    } catch (statusError) {
      var message = String(statusError.message);
      if (!message.includes('not running with --replSet') && !message.includes('no replset config has been received')) {
        throw statusError;
      }
    }

    var result = await admin.command({
      replSetInitiate: {
        _id: 'rs0',
        members: [
          { _id: 0, host: '127.0.0.1:27017' }
        ]
      }
    });

    console.log('Replica set initiated:', result.ok === 1 ? 'ok' : result);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(function () {});
  }
}

run();
