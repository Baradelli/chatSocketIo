import { injectable } from 'tsyringe'
import { prisma } from '../database/prisma'

interface CreateMessage {
  to: string
  text: string
  room_id: string
}

@injectable()
export class CreateMessageService {
  async execute({ to, text, room_id }: CreateMessage) {
    const message = await prisma.message.create({
      data: {
        to,
        text,
        room_id,
      },
    })

    return message
  }
}
