import { PrismaClient } from '@prisma/client';
import { inject, singleton } from 'tsyringe';

@singleton()
export class User {
    constructor(@inject('PrismaClient') private prismaClient: PrismaClient) {}

    add(data: object) {
        return this.prismaClient.users.create({ data });
    }

    del(id: string) {
        return this.prismaClient.users.delete({ where: { id } });
    }

    update(id: string, data: object) {
        return this.prismaClient.users.update({
            where: { id },
            data
        });
    }

    find(where: object) {
        return this.prismaClient.users.findFirst({ where });
    }

    all() {
        return this.prismaClient.users.findMany();
    }
}
