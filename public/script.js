const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

if (messageForm != null) {
  const name = prompt('What is your name?')
  appendMessage('You joined', 'notice')
  socket.emit('new-user', roomName, name)

  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`, 'self');
    socket.emit('send-chat-message', roomName, message)
    messageInput.value = ''
  })
}

socket.on('room-created', room => {
  const roomElement = document.createElement('div')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}`
  roomLink.innerText = 'join'
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`, '')
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`, 'notice')
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`,'notice')
})

function appendMessage(message, className='') {
  const messageElement = document.createElement('div')
  messageElement.innerText = message;
  messageElement.classList.add('message-bubble');
  if(className != '') {
    messageElement.classList.add(className);
  }
  messageContainer.append(messageElement)
}