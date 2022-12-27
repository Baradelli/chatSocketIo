import { injectable } from 'tsyringe'
import { prisma } from '../database/prisma'

@injectable()
export class GetChatRoomByIdService {
  async execute(id_chat_room: string) {
    const room = await prisma.chatRoom.findFirst({
      where: {
        id: id_chat_room,
      },
      include: {
        users: true,
      },
    })

    return room
  }
}
