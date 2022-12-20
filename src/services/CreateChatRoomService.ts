import { injectable } from 'tsyringe'
import { prisma } from '../database/prisma'

@injectable()
export class CreateChatRoomService {
  async execute(id_users: string[]) {
    const room = await prisma.chatRoom.create({
      data: {
        id_users: String(id_users),
      },
    })

    return room
  }
}
