
const { connectToDatabase } = require('./lib/db/connect');
const { User } = require('./lib/db/models/User');

async function debug() {
  await connectToDatabase();
  const users = await User.find({}).select('displayName email memberStatus secretariatRole year').lean();
  console.log('--- ALL USERS ---');
  users.forEach(u => {
    console.log(`- ${u.displayName || u.email}: status=${u.memberStatus}, role=${u.secretariatRole}, year=${u.year}`);
  });
  console.log('--- END ---');
  process.exit(0);
}

debug();
