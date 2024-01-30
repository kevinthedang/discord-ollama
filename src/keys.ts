import { getEnvVar } from './utils/env.js'

export const Keys = {
    clientToken: getEnvVar('CLIENT_TOKEN'),
    channel: getEnvVar('CHANNEL_ID'),
    model: getEnvVar('MODEL'),
    botUid: getEnvVar('BOT_UID')
} as const // readonly keys

export default Keys