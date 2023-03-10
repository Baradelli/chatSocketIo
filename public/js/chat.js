const socket = io('http://localhost:3000')

let room_id

function onLoad() {
  const urlParams = new URLSearchParams(window.location.search)

  const name = urlParams.get('name')
  const email = urlParams.get('email')
  const avatar = urlParams.get('avatar')

  document.querySelector('.user_logged').innerHTML += `
  <img
    class="avatar_user_logged"
    src=${avatar}
  />
  <strong id="user_logged">${name}</strong>
  `

  socket.emit('start', {
    name,
    email,
    avatar,
  })

  socket.on('new_users', (data) => {
    const existInDiv = document.getElementById(`user_${data.id}`)

    if (!existInDiv) {
      addUser(data)
    }
  })

  socket.emit('get_users', (users) => {
    users.forEach((user) => {
      if (user.email !== email) {
        addUser(user)
      }
    })
  })

  socket.on('message', (data) => {
    if (data.message.room_id === room_id) {
      addMessage(data)
    }
  })

  socket.on('notification', (data) => {
    if (data.room_id !== room_id) {
      const user = document.getElementById(`user_${data.from.id}`)

      user.insertAdjacentHTML('afterbegin', `<div class="notification"></div>`)
    }
  })
}

function addMessage(data) {
  const divMessageUser = document.getElementById('message_user')

  divMessageUser.innerHTML += `
    <span class="user_name user_name_date">
      <img
        class="img_user"
        src=${data.user.avatar}
      />
      <strong>${data.user.name}</strong>
      &nbsp;
      <span>${dayjs(data.message.created_at).format('DD/MM/YYYY HH:mm')}</span>
    </span>
    <div class="messages">
      <span class="chat_message"> ${data.message.text}</span>
    </div>
  `
}

function addUser(user) {
  const usersList = document.getElementById('users_list')
  usersList.innerHTML += `
  <li
    class="user_name_list"
    id="user_${user.id}"
    idUser="${user.id}"
  >
    <img
      class="nav_avatar"
      src=${user.avatar}
    />
    ${user.name}
  </li>
  `
}

document.getElementById('users_list').addEventListener('click', (e) => {
  const inputMessage = document.getElementById('user_message')
  inputMessage.classList.remove('hidden')

  document.getElementById('message_user').innerHTML = ''
  document
    .querySelectorAll('li.user_name_list')
    .forEach((item) => item.classList.remove('user_in_focus'))

  if (e.target && e.target.matches('li.user_name_list')) {
    const id_user = e.target.getAttribute('idUser')

    e.target.classList.add('user_in_focus')

    const notification = document.querySelector(
      `#user_${id_user} .notification`
    )

    if (notification) {
      notification.remove()
    }

    socket.emit('start_chat', { id_user }, (response) => {
      room_id = response.room.id

      response.messages.forEach((message) => {
        const data = {
          message: message,
          user: message.to_user,
        }

        addMessage(data)
      })
    })
  }
})

document.getElementById('user_message').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const message = e.target.value

    e.target.value = ''

    const data = {
      room_id,
      message,
    }

    socket.emit('message', data)
  }
})

onLoad()
