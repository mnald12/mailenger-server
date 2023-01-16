const nodemailer = require('nodemailer')

export const sendMessage = async (req, res) => {
   const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
         type: 'OAuth2',
         user: req.body.from,
         clientId:
            '430037630460-8u0dbl0gpl1r4vttum7hi1ro7ckkub98.apps.googleusercontent.com',
         clientSecret: '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',
         accessToken: req.body.token,
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
