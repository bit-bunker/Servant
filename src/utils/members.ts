import { Guild, Role } from 'discord.js';

const userMentionRegExp = new RegExp('<@!*([0-9]+)>');
const snowflakeRegExp = new RegExp('([0-9]+)');

export function memberIdsFromString(members: string): string[] {
    const memberIds: string[] = [];
    members.split(' ').forEach((member: string) => {
        const mentionMatch = userMentionRegExp.exec(member);
        if (mentionMatch) memberIds.push(mentionMatch[1]);
        const snowflakeMatch = snowflakeRegExp.exec(member);
        if (snowflakeMatch) memberIds.push(snowflakeMatch[1]);
    });

    return memberIds;
}
