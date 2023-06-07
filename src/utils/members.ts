const userMentionRegExp = new RegExp('<@!*([0-9]+)>');
const snowflakeRegExp = new RegExp('([0-9]+)');

export function memberIdsFromString(members: string): string[] {
    return members.split(' ').filter((member: string) =>
        userMentionRegExp.exec(member)?.at(1) ?? snowflakeRegExp.exec(member)?.at(1)
    );
}