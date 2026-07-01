const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/smart_vault').then(async () => {
  const res = await mongoose.connection.db.collection('users').updateOne(
    { email: 'mani1417ma@gmail.com' },
    { $set: { role: 'superadmin' } }
  );
  console.log('Updated user count:', res.modifiedCount);
  process.exit(0);
});
