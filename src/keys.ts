import { getEnvVar } from './utils/env.js'

export const Keys = {
    clientToken: getEnvVar('CLIENT_TOKEN'),
    channel: getEnvVar('CHANNEL_ID'),
    model: getEnvVar('MODEL'),
    clientUid: getEnvVar('CLIENT_UID'),
    guildId: getEnvVar('GUILD_ID')
} as const // readonly keys

export default Keys