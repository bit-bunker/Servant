const userMentionRegExp = new RegExp('<@!*([0-9]+)>');
const snowflakeRegExp = new RegExp('([0-9]+)');

export function memberIdsFromString(members: string): string[] {
    return members.split(' ').map((member: string) => {
        const mentionMatch = userMentionRegExp.exec(member);
        if (mentionMatch) return mentionMatch[1];
        const snowflakeMatch = snowflakeRegExp.exec(member);
        if (snowflakeMatch) return snowflakeMatch[1];
    });
}
