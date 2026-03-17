const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function SendOTP(email, otp) {
  await transporter.sendMail({
    from: `"Gup Sup" <${process.env.EMAIL_USER}>`, //meri email se otp jayegi
    to: email,
    subject: "Your OTP Code",
   html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="420" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.08);padding:30px;">
          
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h2 style="margin:0;color:#075e54;">Gup-Sup</h2>
            </td>
          </tr>

          <tr>
            <td style="color:#333;font-size:16px;padding-bottom:15px;">
              Hello,
            </td>
          </tr>

          <tr>
            <td style="color:#333;font-size:16px;padding-bottom:25px;">
              Use the following OTP to verify your email address.
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px 0;">
              <div style="display:inline-block;background:#e6f7f5;color:#075e54;
                          font-size:32px;font-weight:bold;letter-spacing:6px;
                          padding:15px 30px;border-radius:8px;">
                ${otp}
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="color:#888;font-size:14px;padding-top:10px;">
              This OTP is valid for 5 minutes.
            </td>
          </tr>

          <tr>
            <td style="padding-top:30px;color:#666;font-size:13px;text-align:center;">
              If you didn’t request this, you can safely ignore this email.
            </td>
          </tr>

          <tr>
            <td style="padding-top:25px;color:#aaa;font-size:12px;text-align:center;">
              © ${new Date().getFullYear()} chat with krashan
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
  });
}

module.exports = SendOTP;