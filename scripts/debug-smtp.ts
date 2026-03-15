import nodemailer from "nodemailer";

async function testSmtp() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;

  console.log("Diagnostics:");
  console.log(`- Host: ${host}`);
  console.log(`- Port: ${port}`);
  console.log(`- User: ${user}`);
  console.log(`- Pass length: ${pass?.length}`);
  
  if (pass && pass.includes(" ")) {
    console.log("- Note: Password contains spaces. Gmail App Passwords usually don't need them.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user: user?.trim(),
      pass: pass?.trim(),
    },
  });

  try {
    console.log("Verifying connection...");
    await transporter.verify();
    console.log("✅ Success! Connection verified.");
  } catch (error: any) {
    console.error("❌ Failed!");
    console.error(`- Code: ${error.code}`);
    console.error(`- Error: ${error.message}`);

    if (pass && host.includes("gmail")) {
        console.log("\nAttempting with spaces removed from password...");
        const altTransporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: {
              user: user?.trim(),
              pass: pass?.replace(/\s/g, ""),
            },
        });
        try {
            await altTransporter.verify();
            console.log("✅ SUCCESS with spaces removed!");
        } catch (e: any) {
            console.log("❌ Still failed with spaces removed.");
        }
    }
  }
}

testSmtp();
