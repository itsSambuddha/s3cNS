
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found");
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB");

    const usersCol = mongoose.connection.collection('users');

    // Admin: ShwetVeer Vrish
    const adminRes = await usersCol.updateOne(
      { uid: "nGzuWSERcXhivZvtwXBt6PjTBaf2" },
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
    console.log("Admin update:", adminRes);

    // USG: Upasana Sarma
    const usgRes = await usersCol.updateOne(
      { uid: "oXi5E0er9uQx06qVc8ljQNFofev1" },
      {
        $set: {
          role: 'OFFICE_BEARER',
          secretariatRole: 'USG',
          memberStatus: 'APPLICANT'
        }
      }
    );
    console.log("USG update:", usgRes);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
