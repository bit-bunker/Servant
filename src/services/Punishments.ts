import { PrismaClient } from "@prisma/client";
import { inject, singleton } from "tsyringe";

export enum Punishment {
    WARNING,
    TIMEOUT,
    BANISHMENT
}

@singleton()
export class Punishments {
    constructor(@inject("PrismaClient") private prismaClient: PrismaClient) {
        console.log("Infractions service loaded");
    }

    add({ infractions, punishment, duration }: { infractions: number, punishment: Punishment, duration: number }) {
        return this.prismaClient.punishments.create({
            data: {
                infractions,
                punishment,
                duration,
            },
        });
    }

    remove(infractions: number) {
        return this.prismaClient.punishments.delete({
            where: {
                infractions,
            },
        });
    }

    update({ infractions, punishment, duration } : { infractions: number, punishment: Punishment, duration: number }) {
        return this.prismaClient.punishments.update({
            where: {
                infractions,
            },
            data: {
                punishment,
                duration,
            },
        });
    }

    lookup(where: {}) {
        return this.prismaClient.punishments.findFirst({ where });
    }

    all() {
        return this.prismaClient.punishments.findMany();
    }
}
