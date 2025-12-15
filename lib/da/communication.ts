/* =========================
   DA COMMUNICATION CONFIG
========================= */

export const DA_COMMUNICATION = {
  senderName: "SECMUN",
  replyTo: "shwetwondergeeks@gmail.com",

  email: {
    subject: "SECMUN Registration Received",
    interestText: (name: string, eventType: string) => `
Dear ${name},

Thank you for registering your interest in ${eventType}.
Delegate Affairs will reach out within 48 hours.

— SECMUN
`,
  },

  whatsapp: {
    interestText: (name: string, eventType: string) =>
      `Dear ${name}, thank you for registering for ${eventType}. Delegate Affairs will contact you within 48 hours. — SECMUN`,
  },
}
