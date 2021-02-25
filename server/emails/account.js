const sgMail = require('@sendgrid/mail')

//const sendgridAPIKey = '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'
const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, userPhone) => {
    sgMail.send({
        to: email,
        from: 'bobachandra@gmail.com',
        subject: 'welcome to Temple managment',
        html: ` <h4>Hi ${userPhone} </h4>
                <h4>Welcome to the Temple management application</h4>
                <table width="100%" border=".5" cellspacing="0" cellpadding="0">
                 <tbody>
                    <tr>
                        <td width="40%" style="font:14px Arial,Helvetica,sans-serif;font-weight:bold;padding:13px 0px 13px 13px">User ID:</td>
                        <td align="left" style="padding:13px 0px 13px 13px">${userPhone}</td>
                    </tr>
                 </tbody>
                </table>
                <br></br>
                    <span>Thanks & Regards</span><br></br>
                    <span>Temple Management Team</span>`
//         text: `Hi ${userID},
        
//         Welcome to the Temple management application. Your userID to login is : ${userID} .
 
// Thanks & Regards,
// Fitness Team` 
    })
}

const sendCancelationEmail = (email, userPhone) => {
    sgMail.send({
        to: email,
        from: 'bobachandra@gmail.com',
        subject: 'sorry to see you go!!',
        text: `Googbye , ${userPhone}. I hope to see you back sometime soon!!!.`
    })
}

module.exports={
    sendWelcomeEmail,
    sendCancelationEmail
}