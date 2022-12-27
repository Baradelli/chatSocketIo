import { container } from 'tsyringe'
import { io } from '../http'
import { CreateChatRoomService } from '../services/CreateChatRoomService'
import { CreateMessageService } from '../services/CreateMessageService'
import { CreateUserService } from '../services/CreateUserService'
import { GetAllUsersService } from '../services/GetAllUsersService'
import { GetChatRoomByIdService } from '../services/GetChatRoomByIdService'
import { GetChatRoomByUsersService } from '../services/GetChatRoomByUsersService'
import { GetMessagesByChatRoomService } from '../services/GetMessagesByChatRoomService'
import { GetUserByIdService } from '../services/GetUserByIdService'
import { GetUserBySocketIdService } from '../services/GetUserBySocketIdService'

io.on('connect', (socket) => {
  socket.on('start', async (data) => {
    const { name, email, avatar } = data
    const createuserService = container.resolve(CreateUserService)

    const user = await createuserService.execute({
      name,
      email,
      avatar,
      socket_id: socket.id,
    })

    socket.broadcast.emit('new_users', user)
  })

  socket.on('get_users', async (callback) => {
    const getAllUsersService = container.resolve(GetAllUsersService)
    const users = await getAllUsersService.execute()

    callback(users)
  })

  socket.on('start_chat', async (data, callback) => {
    const createChatRoomService = container.resolve(CreateChatRoomService)
    const getChatRoomByUsersService = container.resolve(
      GetChatRoomByUsersService
    )
    const getUserBySocketIdService = container.resolve(GetUserBySocketIdService)
    const getMessagesByChatRoomService = container.resolve(
      GetMessagesByChatRoomService
    )

    const userLogged = await getUserBySocketIdService.execute(socket.id)

    let room = await getChatRoomByUsersService.execute([
      data.id_user,
      userLogged.id,
    ])

    if (!room) {
      room = await createChatRoomService.execute([data.id_user, userLogged.id])
    }

    const messages = await getMessagesByChatRoomService.execute(room.id)

    callback({ room, messages })
    socket.join(room.id)
  })

  socket.on('message', async (data) => {
    const getUserBySocketIdService = container.resolve(GetUserBySocketIdService)
    const createMessageService = container.resolve(CreateMessageService)
    const getChatRoomByIdService = container.resolve(GetChatRoomByIdService)
    const getUserByIdService = container.resolve(GetUserByIdService)

    const user = await getUserBySocketIdService.execute(socket.id)

    const message = await createMessageService.execute({
      to: user.id,
      text: data.message,
      room_id: data.room_id,
    })

    io.to(data.room_id).emit('message', {
      message,
      user,
    })

    const room = await getChatRoomByIdService.execute(data.room_id)

    const idUserFrom = room.id_users
      .split(',')
      .find((id) => String(id) !== String(user.id))

    const userFrom = await getUserByIdService.execute(idUserFrom)

    io.to(userFrom.socket_id).emit('notification', {
      newMessage: true,
      room_id: data.room_id,
      from: user,
    })
  })
})
