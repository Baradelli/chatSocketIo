import { injectable } from 'tsyringe'
import { prisma } from '../database/prisma'

@injectable()
export class GetMessagesByChatRoomService {
  async execute(room_id: string) {
    const messages = await prisma.message.findMany({
      where: {
        room_id,
      },
      include: {
        to_user: true,
      },
    })

    console.log('mensagens ', messages)

    return messages
  }
}
