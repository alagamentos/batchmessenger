const getAllPhones = (db, cb) => {
  db.all('SELECT phone FROM contacts ORDER BY name', (err, rows) => {
    if (err) {
      cb && cb(err)
      return
    }

    cb && cb(null, rows)
  })
}

const getAllContacts = (db, cb) => {
  db.all('SELECT * FROM contacts ORDER BY name', (err, rows) => {
    if (err) {
      cb && cb(err)
      return
    }

    cb && cb(null, rows)
  })
}

const insertContact = (db, contact, cb) => {
  db.serialize(() => {
    const stmt = db.prepare('INSERT INTO contacts (name, phone) VALUES (?, ?)')

    stmt.run(contact.name, contact.phone, (err) => {
      if (err) {
        cb && cb(err)
        return
      }

      cb && cb()
    })

    stmt.finalize()
  })
}

const deleteContact = (db, contactId, cb) => {
  db.serialize(() => {
    const stmt = db.prepare('DELETE FROM contacts WHERE id = ?')

    stmt.run(contactId, (err) => {
      if (err) {
        cb && cb(err)
        return
      }

      cb && cb()
    })

    stmt.finalize()
  })
}

module.exports = {
  getAllPhones,
  getAllContacts,
  insertContact,
  deleteContact
}
