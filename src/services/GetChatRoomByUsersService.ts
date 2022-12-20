import { injectable } from 'tsyringe'
import { prisma } from '../database/prisma'

@injectable()
export class GetChatRoomByUsersService {
  async execute(id_users: string[]) {
    const room = await prisma.chatRoom.findFirst({
      where: {
        id_users: {
          contains: id_users[0],
        },
        AND: {
          id_users: {
            contains: id_users[1],
          },
        },
      },
    })

    return room
  }
}
