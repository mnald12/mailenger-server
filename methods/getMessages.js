const Imap = require('imap')
const MailParser = require('mailparser')
const moment = require('moment')

const getMessages = (req, res) => {
   let totals
   const fetchMessage = () =>
      new Promise((resolve) => {
         const imap = new Imap({
            user: req.params.email,
            password: req.params.pwd,
            host: req.params.host,
            port: req.params.port,
            tls: true,
            tlsOptions: { rejectUnauthorized: false },
         })

         let messages = []

         const openInbox = (cb) => {
            imap.openBox('[Gmail]/All Mail', true, cb)
         }

         const emailListParser = []

         imap.once('ready', () => {
            openInbox((err, box) => {
               if (err) throw err
               totals = box.messages.total
               var f = imap.seq.fetch(`${req.params.init}:${req.params.end}`, {
                  bodies: '',
                  struct: true,
               })

               f.on('message', (msg) => {
                  msg.on('body', (stream) => {
                     emailListParser.push(MailParser.simpleParser(stream))
                  })
               })

               f.once('error', (err) => {
                  console.log('Fetch error: ' + err)
               })

               f.once('end', () => {
                  Promise.all(emailListParser)
                     .then((result) => {
                        for (let email of result) {
                           const data = {
                              name: email.from.value[0].name,
                              from: email.from.value[0].address,
                              to: email.to.value[0].address,
                              date: moment(email.date).format(
                                 'MMMM DD, YYYY hh:mm:ss a'
                              ),
                              subject: email.subject,
                              text: email.text,
                              html: email.html,
                           }
                           messages.push(data)
                        }
                     })
                     .then(() => resolve(messages))
                  imap.end()
               })
            })
         })

         imap.once('error', (err) => {
            console.log(err)
         })

         imap.connect()
      })
   fetchMessage().then((messages) =>
      res.json({ messages: messages, total: totals })
   )
}

module.exports = { getMessages }
