
const mongoose = require('mongoose');

async function promote() {
  const uri = "mongodb+srv://secmun2024_db_user:0b8uwFntO1R5id7Q@s3cnscluster0.2d2tyly.mongodb.net/?appName=s3cnsCluster0";
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Promote ShwetVeer Vrish to Admin
    const adminUid = "nGzuWSERcXhivZvtwXBt6PjTBaf2";
    const resAdmin = await mongoose.connection.collection('users').updateOne(
      { uid: adminUid },
      {
        $set: {
          role: 'ADMIN',
          secretariatRole: 'SECRETARY_GENERAL',
          memberStatus: 'ACTIVE',
          canManageMembers: true,
          canApproveUSG: true,
          canManageFinance: true,
          canManageEvents: true
        }
      }
    );
    console.log("Admin Promotion result:", resAdmin);

    // Promote USG Upasana Sarma
    const usgUid = "oXi5E0er9uQx06qVc8ljQNFofev1";
    const resUsg = await mongoose.connection.collection('users').updateOne(
      { uid: usgUid },
      {
        $set: {
          role: 'OFFICE_BEARER',
          secretariatRole: 'USG',
          memberStatus: 'APPLICANT' // Keep as applicant for now so admin can verify them
        }
      }
    );
    console.log("USG Promotion result:", resUsg);

  } catch (err) {
    console.error("Operation failed:", err);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
}

promote();
