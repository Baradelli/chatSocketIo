import { injectable } from 'tsyringe'
import { prisma } from '../database/prisma'

@injectable()
export class GetAllUsersService {
  async execute() {
    const users = await prisma.user.findMany()

    return users
  }
}
