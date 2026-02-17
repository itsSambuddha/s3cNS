"use server";

import nodemailer from "nodemailer";

export async function sendDeveloperEmail(prevState: any, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !subject || !message) {
        return { success: false, message: "Please fill in all fields." };
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: Number(process.env.SMTP_PORT) || 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"s3cNS Contact Form" <${process.env.SMTP_USER}>`,
            to: "sidhusamsk@gmail.com", // Developer email
            replyTo: email,
            subject: `[s3cNS Developer Contact] ${subject}`,
            text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
            `,
            html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>New Message from s3cNS Developer Page</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <hr />
    <h3>Message:</h3>
    <p style="white-space: pre-wrap;">${message}</p>
</div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return { success: true, message: "Message sent successfully!" };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, message: "Failed to send message. Please try again later." };
    }
}
