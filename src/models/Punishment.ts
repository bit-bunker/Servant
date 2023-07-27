import { PrismaClient } from '@prisma/client';
import { inject, singleton } from 'tsyringe';

@singleton()
export class Punishment {
    constructor(@inject('PrismaClient') private prismaClient: PrismaClient) {}

    add(data: { user: string; reason: string; punishment: number; duration: bigint }) {
        return this.prismaClient.punishments.create({ data });
    }

    find(where: object) {
        return this.prismaClient.punishments.findFirst({ where });
    }

    all() {
        return this.prismaClient.punishments.findMany();
    }
}
