import { injectable } from 'tsyringe'
import { prisma } from '../database/prisma'

interface CreateUser {
  email: string
  socket_id: string
  avatar: string
  name: string
}

@injectable()
export class CreateUserService {
  async execute({ email, socket_id, avatar, name }: CreateUser) {
    const userAlreadyExists = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (userAlreadyExists) {
      const user = await prisma.user.update({
        where: {
          id: userAlreadyExists.id,
        },
        data: {
          socket_id,
          avatar,
          name,
        },
      })

      return user
    }
    const user = await prisma.user.create({
      data: {
        email,
        socket_id,
        avatar,
        name,
      },
    })

    return user
  }
}
