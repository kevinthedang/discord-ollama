import { getEnvVar } from './utils/index.js'

export const Keys = {
    clientToken: getEnvVar('CLIENT_TOKEN'),
    ipAddress: getEnvVar('OLLAMA_IP', '127.0.0.1'), // default ollama ip if none
    portAddress: getEnvVar('OLLAMA_PORT', '11434'), // default ollama port if none
    defaultModel: getEnvVar('MODEL', 'llama3.2'),
    redisHost: getEnvVar('REDIS_HOST', '172.18.0.4'), // default redis host if none
    redisPort: parseInt(getEnvVar('REDIS_PORT', '6379')) // default redis port if none
} as const // readonly keys

export default Keys