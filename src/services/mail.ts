import { nodemailerTransporter } from "../lib/nodemailer";

async function sendOTP({
  to,
  code,
}: {
  to: string;
  code: string;
}) {
  nodemailerTransporter.sendMail(
    {
      from: {
        name: "Eco Built",
        address: "support@ecobuilt.com",
      },
      to,
      subject: "Verify Your Email",
      text: `Your OTP Code is: ${code}`,
    },
    (err) => {
      if (err) {
        console.error(err);
      }
    },
  );
}

export { sendOTP };
