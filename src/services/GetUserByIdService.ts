import { injectable } from 'tsyringe'
import { prisma } from '../database/prisma'

@injectable()
export class GetUserByIdService {
  async execute(user_id: string) {
    const user = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
    })

    return user
  }
}
