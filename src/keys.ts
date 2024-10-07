import { getEnvVar } from './utils/index.js'

export const Keys = {
    clientToken: getEnvVar('CLIENT_TOKEN'),
    model: getEnvVar('MODEL'),
    ipAddress: getEnvVar('OLLAMA_IP'),
    portAddress: getEnvVar('OLLAMA_PORT'),
} as const // readonly keys

export default Keys