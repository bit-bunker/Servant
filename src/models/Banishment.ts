import { PrismaClient } from "@prisma/client";
import { inject, singleton } from "tsyringe";

@singleton()
export class Banishment {
    constructor(@inject('PrismaClient') private prismaClient: PrismaClient) {}

    add(data: { user: string, until: Date }) {
        return this.prismaClient.banishments.create({ data });
    }

    del(where: object) {
        return this.prismaClient.banishments.delete({ where });
    }

    find(where: object) {
        return this.prismaClient.banishments.findFirst({ where });
    }

    all() {
        return this.prismaClient.banishments.findMany();
    }
}
