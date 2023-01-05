const Imap = require('imap')

export const getMessages = (req, res) => {
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
      imap.openBox('INBOX', true, cb)
   }

   imap.once('ready', () => {
      openInbox((err, box) => {
         if (err) throw err
         var f = imap.seq.fetch('1:*', {
            bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
            struct: true,
         })

         f.on('message', (msg) => {
            msg.on('body', (stream) => {
               let buffer = ''

               stream.on('data', (chunk) => {
                  buffer += chunk.toString('utf8')
               })

               stream.once('end', () => {
                  messages.push(Imap.parseHeader(buffer))
               })
            })
         })

         f.once('error', (err) => {
            console.log('Fetch error: ' + err)
         })

         f.once('end', () => {
            imap.end()
         })
      })
   })

   imap.once('error', (err) => {
      console.log(err)
   })

   imap.once('end', () => {
      console.log('Connection ended')
      res.json(messages)
   })

   imap.connect()
}
