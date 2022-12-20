import { injectable } from 'tsyringe'
import { prisma } from '../database/prisma'

@injectable()
export class GetUserBySocketIdService {
  async execute(socket_id: string) {
    const user = await prisma.user.findFirst({
      where: {
        socket_id,
      },
    })

    return user
  }
}
