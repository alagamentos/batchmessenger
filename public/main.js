fetch('/contacts')
  .then(response => {
    if (response.status >= 400) {
      return response.json().then(({ error }) => {
        alert(error)
      })
    }

    return response.json()
  })
  .then(({ data }) => {
    const $tbody = document.querySelector('table tbody')

    data.forEach(({ id, name, phone }) => {
      const $template = document.querySelector('template')
      const $clone = $template.content.cloneNode(true)
      const $row = $clone.querySelector('tr')
      const $columns = $row.querySelectorAll('td')

      $row.setAttribute('id', id)
      $columns[0].innerText = name
      $columns[1].innerText = phone

      $tbody.append($clone)
    })

    const $buttons = $tbody.querySelectorAll('tr td span')

    $buttons.forEach($button => {
      $button.addEventListener('click', (evt) => {
        const { id } = evt.target.parentElement.parentElement

        fetch(`/contacts/${id}`, { method: 'DELETE' })
          .then(response => {
            if (response.status >= 400) {
              return response.json().then(({ error }) => {
                alert(error)
                window.location.href = '/'
              })
            }

            return response.json()
          })
          .then(({ data }) => {
            alert(data)
            window.location.href = '/'
          })
      })
    })
  })
