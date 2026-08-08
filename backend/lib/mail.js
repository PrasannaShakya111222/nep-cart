import nodemailer from "nodemailer";

let etherealTransporter = null;

const getTransporter = async () => {
	const user = process.env.EMAIL_USER || process.env.SMTP_USER;
	const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

	if (user && pass) {
		const host = process.env.SMTP_HOST || "smtp.gmail.com";
		const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;

		const config = {
			host,
			port,
			secure: port === 465,
			auth: {
				user: user.trim(),
				pass: pass.trim(),
			},
			tls: {
				rejectUnauthorized: false,
			},
		};

		return { transporter: nodemailer.createTransport(config), isEthereal: false };
	}

	// Create Ethereal test account if real credentials are not in .env yet
	if (!etherealTransporter) {
		try {
			const testAccount = await nodemailer.createTestAccount();
			etherealTransporter = nodemailer.createTransport({
				host: "smtp.ethereal.email",
				port: 587,
				secure: false,
				auth: {
					user: testAccount.user,
					pass: testAccount.pass,
				},
			});
			console.log(`[EMAIL SERVICE] Created Ethereal Test Email account: ${testAccount.user}`);
		} catch (err) {
			console.log("[EMAIL SERVICE] Ethereal account creation skipped:", err.message);
		}
	}

	return { transporter: etherealTransporter, isEthereal: true };
};

export const sendVerificationEmail = async (toEmail, verificationCode) => {
	const senderEmail = process.env.EMAIL_USER || "no-reply@nepcart.com";
	const mailOptions = {
		from: process.env.EMAIL_FROM || `"NepCart" <${senderEmail}>`,
		to: toEmail,
		subject: "NepCart - Your 6-Digit Email Verification Code",
		html: `
			<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
				<div style="text-align: center; margin-bottom: 24px;">
					<h1 style="color: #059669; margin: 0; font-size: 28px; font-weight: 800;">Nep<span style="color: #10b981;">Cart</span></h1>
					<p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Nepal's Modern E-Commerce Platform</p>
				</div>

				<div style="background-color: #f0fdf4; border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
					<p style="margin: 0 0 10px 0; font-size: 15px; color: #065f46; font-weight: 600;">Your Email Verification Code</p>
					<div style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #047857; margin: 10px 0;">
						${verificationCode}
					</div>
					<p style="margin: 10px 0 0 0; font-size: 12px; color: #047857;">Enter this 6-digit code on the verification screen.</p>
				</div>

				<p style="font-size: 14px; color: #4b5563; line-height: 1.5; margin-bottom: 20px;">
					If you did not request this code, please ignore this email or contact support.
				</p>

				<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
				
				<p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
					© ${new Date().getFullYear()} NepCart. All rights reserved.
				</p>
			</div>
		`,
	};

	try {
		const { transporter, isEthereal } = await getTransporter();
		if (!transporter) return;

		const info = await transporter.sendMail(mailOptions);
		console.log(`[EMAIL SERVICE SUCCESS] Verification email successfully delivered to ${toEmail}`);

		if (isEthereal) {
			const previewUrl = nodemailer.getTestMessageUrl(info);
			if (previewUrl) {
				console.log(`\n📬 [TEST EMAIL PREVIEW LINK] View sent email online:\n${previewUrl}\n`);
			}
		}
	} catch (error) {
		console.log(`\n❌ [EMAIL SERVICE ERROR] Primary SMTP failed for ${toEmail}: ${error.message}`);
		if (error.message.includes("535") || error.message.includes("Username and Password not accepted")) {
			console.log(`   💡 NOTE: Gmail requires a 16-letter App Password (generated at https://myaccount.google.com/apppasswords).`);
		}

		// Automatic fallback to test email transporter so email can still be inspected online!
		try {
			const testAccount = await nodemailer.createTestAccount();
			const fallbackTransporter = nodemailer.createTransport({
				host: "smtp.ethereal.email",
				port: 587,
				secure: false,
				auth: { user: testAccount.user, pass: testAccount.pass },
			});
			const info = await fallbackTransporter.sendMail(mailOptions);
			const previewUrl = nodemailer.getTestMessageUrl(info);
			console.log(`\n📬 [TEST EMAIL PREVIEW LINK] Sent via Test Mailer! View received email here:\n${previewUrl}\n`);
		} catch (fallbackErr) {
			console.log("[EMAIL SERVICE] Fallback mailer error:", fallbackErr.message);
		}
	}
};
