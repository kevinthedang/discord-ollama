import { getEnvVar } from './utils/index.js'

export const Keys = {
    clientToken: getEnvVar('CLIENT_TOKEN'),
    ipAddress: getEnvVar('LLM_ENDPOINT', process.env.OLLAMA_IP ?? '127.0.0.1'), // OLLAMA_IP is a deprecated alias
    portAddress: getEnvVar('LLM_PORT', process.env.OLLAMA_PORT ?? '11434'), // OLLAMA_PORT is a deprecated alias
    defaultModel: getEnvVar('MODEL', 'llama3.2')
} as const // readonly keys

export default Keys