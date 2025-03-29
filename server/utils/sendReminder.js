const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password"
    }
});

const sendReminder = async (email, assignmentTitle, deadline) => {
    const mailOptions = {
        from: "your-email@gmail.com",
        to: email,
        subject: "Assignment Deadline Reminder",
        text: `Reminder: Your assignment "${assignmentTitle}" is due on ${new Date(deadline).toLocaleString()}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reminder sent to ${email}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendReminder;
