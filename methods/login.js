const Imap = require('imap')

const login = (req, res) => {
   const imap = new Imap({
      user: req.params.email,
      password: req.params.pwd,
      host: req.params.host,
      port: req.params.port,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
   })

   imap.once('ready', () => {
      res.json({
         success: true,
      })
   })

   imap.once('error', (err) => {
      res.json({
         success: false,
      })
   })

   imap.connect()
}

module.exports = { login }
