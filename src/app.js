module.exports = async (contacts) => {

  const express = require('express')
  const { initDriver, isLogged, sendMessage } = require('./selenium')

  const app = express()
  const PORT = process.env.PORT || 4000
  const driver = await initDriver('chrome', 'https://web.whatsapp.com')

  app.use(express.static('public'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.post('/test', async (req, res) => {
    const { message, phones : strPhones } = req.body

    const phones = typeof strPhones === 'string' && strPhones.replace(/\s+/g, '').split(',')

    if (typeof message !== 'string' || !Array.isArray(phones) || !phones.every(phone => /^[0-9]{8,}$/.test(phone))) {
      return res.send(`
        <script>
          alert('Mensagem não informada e/ou formato(s) do(s) Telefone(s) inválido(s).')
          window.location.href = '/test.html'
        </script>
      `)
    }

    if (!await isLogged(driver)) {
      return res.send(`
        <script>
          alert('Você não está logado no WhatApp. Logue-se para poder enviar mensagens.')
          window.location.href = '/test.html'
        </script>
      `)
    }

    await sendMessage(driver, phones, message)

    res.status(200).send(`
      <script>
        alert('Mensagem enviada com sucesso.')
        window.location.href = '/test.html'
      </script>
    `)
  })

  app.post('/message', async (req, res) => {
    const { message } = req.body

    if (typeof message !== 'string') {
      return res.send(`
        <script>
          alert('Mensagem não informada.')
          window.location.href = '/'
        </script>
      `)
    }

    if (!await isLogged(driver)) {
      return res.send(`
        <script>
          alert('Você não está logado no WhatApp. Logue-se para poder enviar mensagens.')
          window.location.href = '/'
        </script>
      `)
    }

    const phones = contacts.map(({ phone }) => phone)
    await sendMessage(driver, phones, message)

    res.status(200).send(`
      <script>
        alert('Mensagem enviada com sucesso.')
        window.location.href = '/'
      </script>
    `)
  })

  app.get('/contacts', (req, res) => {
    res.status(200).json({ data: contacts })
  })

  app.delete('/contacts/:id', (req, res) => {
    const id = parseInt(req.params.id)

    if (!Number.isSafeInteger(id) || /^[0-9]+$/.test(id) === false) {
      return res.status(400).json({
        error: 'Contato inválido.'
      })
    }

    contacts.splice(id - 1, 1)

    res.status(200).json({
      data: 'Contato deletado com sucesso.'
    })
  })

  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}...`))

}
