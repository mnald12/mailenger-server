const nodemailer = require('nodemailer')

const sendMessage = async (req, res) => {
   const transport = nodemailer.createTransport({
      host: req.body.host,
      port: req.body.port,
      auth: {
         user: req.body.from,
         pass: req.body.pwd,
      },
   })

   const result = await transport.sendMail({
      from: req.body.from,
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text,
      html: req.body.html,
   })

   if (result) {
      res.json(result)
   }
}

module.exports = { sendMessage }
