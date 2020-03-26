(async () => {

  const express = require('express')
  const { Database } = require('sqlite3')
  const { getAllPhones, getAllContacts, insertContact, deleteContact } = require('./database')
  const { initDriver, isLogged, sendMessage } = require('./selenium')

  const app = express()
  const PORT = process.env.PORT || 4000
  const db = new Database('app.db')
  const driver = await initDriver('chrome', 'https://web.whatsapp.com')

  app.use(express.static('public'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.post('/message', async (req, res) => {
    const { message } = req.body

    if (!await isLogged(driver)) {
      return res.send(
        `<script>
          alert('Você não está logado no WhatApp. Logue-se para poder enviar mensagens.')
          window.location.href = '/'
        </script>`
      )
    }

    getAllPhones(db, async (err, rows) => {
      if (err) {
        return res.status(500).send(
          `<script>
            alert('Não foi possível enviar sua mensagem. Por favor, tente enviá-la novamente.')
            window.location.href = '/'
          </script>`
        )
      }
  
      await sendMessage(driver, rows, message)

      res.status(200).send(
        `<script>
          alert('Mensagem enviada com sucesso.')
          window.location.href = '/'
        </script>`
      )
    })
  })

  app.get('/contacts', (req, res) => {
    getAllContacts(db, (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: 'Não foi possível carregar os contatos. Por favor, recarregue a página novamente.'
        })
      }

      res.status(200).json({ data: rows })
    })
  })

  app.post('/contacts', (req, res) => {
    const { name, phone } = req.body

    if (name == null || phone == null || /^[0-9]{8,}$/.test(phone) === false) {
      return res.status(400).send(
        `<script>
          alert('Nome e/ou Telefone inválido(s). Por favor, tente novamente com Nome e/ou Telefone no(s) formato(s) indicado(s).')
          window.location.href = '/'
        </script>`
      )
    }

    insertContact(db, { name, phone }, (err) => {
      if (err) {
        return res.status(500).send(
          `<script>
            alert('Não foi possível adicionar o contato. O motivo mais provável é que o número do contato já existe.')
            window.location.href = '/'
          </script>`
        )
      }

      res.status(201).send(
        `<script>
          alert('Contato adicionado com sucesso.')
          window.location.href = '/'
        </script>`
      )
    })
  })

  app.delete('/contacts/:id', (req, res) => {
    const { id } = req.params

    if (id == null || /^[0-9]+$/.test(id) === false) {
      return res.status(400).json({
        error: 'Contato inválido. Por favor, tente novamente com um contato válido.'
      })
    }

    deleteContact(db, id, (err) => {
      if (err) {
        return res.status(500).json({
          error: 'Não foi possível deletar o contato. Por favor, tente deletá-lo novamente.'
        })
      }

      res.status(200).json({ data: 'Contato deletado com sucesso.' })
    })
  })

  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}...`))

})()
