import { PrismaClient } from '@prisma/client';
import { inject, singleton } from 'tsyringe';

export enum Punishment {
    WARNING,
    TIMEOUT,
    BANISHMENT
}

@singleton()
export class Infraction {
    constructor(@inject('PrismaClient') private prismaClient: PrismaClient) {}

    add({ points, punishment, duration }: { points: number; punishment: Punishment; duration: number }) {
        return this.prismaClient.infractions.create({ data: { points, punishment, duration } });
    }

    del(points: number) {
        return this.prismaClient.infractions.delete({ where: { points } });
    }

    update(data: { points: number; punishment: Punishment; duration: number }) {
        return this.prismaClient.infractions.update({
            where: { points: data.points },
            data
        });
    }

    find(where: object) {
        return this.prismaClient.infractions.findFirst({ where });
    }

    all() {
        return this.prismaClient.infractions.findMany();
    }
}
