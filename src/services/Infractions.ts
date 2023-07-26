import { delay, inject, singleton } from 'tsyringe';
import { Infraction, Punishment as PunishmentEnum } from '../models/Infraction';
import { User } from '../models/User';
import { Client } from 'discordx';
import { EmbedBuilder, Guild } from 'discord.js';
import { Punishment } from '../models/Punishment';
import { Banishment } from '../models/Banishment';

const punishmentText = ['warn', 'mute', 'ban'];

export enum Severity {
    LOW,
    MEDIUM,
    HIGH,
    EXTREME
}

@singleton()
export class Infractions {
    constructor(
        @inject(delay(() => Infraction)) private infractionModel: Infraction,
        @inject(delay(() => Punishment)) private punishmentModel: Punishment,
        @inject(delay(() => Banishment)) private banishmentModel: Banishment,
        @inject(delay(() => User)) private userModel: User
    ) {}

    severityToPoints(severity: Severity) {
        return [1, 2, 4, 8][severity];
    }

    async applyInfraction({
        userId,
        severity,
        reason,
        guild
    }: {
        userId: string;
        severity: Severity;
        reason: string;
        guild: Guild;
    }) {
        const existingUser = await this.userModel.find({ id: userId });
        if (!existingUser) await this.userModel.add({ id: userId });
        const severityPoints = this.severityToPoints(severity);
        const points = existingUser ? severityPoints + existingUser.infractions : severityPoints;
        const infraction = await this.infractionModel.find({ points });
        if (!infraction) return;

        const userPunished = await this.applyPunishment({
            userId: userId,
            punishment: infraction.punishment,
            duration: infraction.duration,
            reason,
            guild
        });

        if (!userPunished) return;

        return this.userModel.update(userId, { infractions: { increment: severityPoints } });
    }

    async applyPunishment({
        userId,
        punishment,
        duration,
        reason,
        guild
    }: {
        userId: string;
        punishment: number;
        duration: bigint;
        reason: string;
        guild: Guild;
    }) {
        const punished =
            punishment === PunishmentEnum.WARNING
                ? await this.warningPunish({ userId, reason, guild })
                : punishment === PunishmentEnum.TIMEOUT
                ? await this.timeoutPunish({ userId, duration, reason, guild })
                : punishment === PunishmentEnum.BANISHMENT
                ? await this.banPunish({ userId, duration, reason, guild })
                : null;

        console.log('HELLO');

        if (!punished) return;


        const punishmentData = await this.punishmentModel.add({
            user: userId,
            punishment,
            duration,
            reason
        });

        const modlogsChannel = await guild.channels.fetch(process.env.MODLOGS_CHANNEL_ID || "");

        if (modlogsChannel) {
            if (modlogsChannel.isTextBased()) {
                const embed = new EmbedBuilder().addFields(
                    { name: 'ID', value: `${punishmentData.case}` },
                    { name: 'Target', value: `<@${punishmentData.user}>` },
                    { name: 'Punishment', value: `${punishmentText[punishmentData.punishment]}` },
                    { name: 'Reason', value: `${punishmentData.reason}` },
                    { name: 'Date', value: `<t:${Math.floor(punishmentData.when.getTime() / 1000)}:F>` },
                );
                await modlogsChannel.send({
                    embeds: [embed]
                });
            }
        }

        return punishmentData;
    }

    async timeoutPunish({
        userId,
        duration,
        reason,
        guild
    }: {
        userId: string;
        duration: bigint;
        reason: string;
        guild: Guild;
    }) {
        const member = await guild.members.fetch(userId);
        return member.timeout(Number(duration), reason);
    }

    async warningPunish({ userId, reason, guild }: { userId: string; reason: string; guild: Guild }) {
        const member = await guild.members.fetch(userId);
        const dm = member.dmChannel || (await member.createDM());

        return dm.send({
            content: `Você está sendo advertido pelo seguinte motivo: ${reason}`
        });
    }

    async banPunish({
        userId,
        duration,
        reason,
        guild
    }: {
        userId: string;
        duration: bigint;
        reason: string;
        guild: Guild;
    }) {
        const member = await guild.members.fetch(userId);
        if (duration === BigInt(0)) {
            return member.ban({ reason });
        } else {
            await member.ban({ reason });
            const until = new Date(Number((BigInt(Date.now()) + duration) / BigInt(1000)));
            await this.banishmentModel.add({ user: userId, until: until });
            return setTimeout(() => this.unbanTask(userId, guild), Number(duration));
        }
    }

    async unbanTask(userId: string, guild: Guild) {
        await this.banishmentModel.del({ user: userId });
        await guild.bans.remove(userId);
    }
}
