import { resolve } from 'path'
import { config } from 'dotenv'

// resolve config file
const envFilePath = resolve(process.cwd(), '.env')

// set current environment variable file
config({ path: envFilePath })

/**
 * Method to validate if environment variables found in file utils/env.ts
 * 
 * @param name Name of the environment variable in .env
 * @param fallback fallback value to set if environment variable is not set (used manually in src/keys.ts)
 * @returns environment variable value
 */
export function getEnvVar(name: string, fallback?: string): string {
    const value = process.env[name] ?? fallback
    if (!value)
        throw new Error(`Environment variable ${name} is not set.`)

    // validate User-Generated Discord Application Tokens 
    if (name === "CLIENT_TOKEN")
        if (value.length < 72) throw new Error(`The "CLIENT_TOKEN" provided is not of at least length 72. 
            This is probably an invalid token unless Discord updated their token policy. Please provide a valid token.`)

    // return env variable
    return value
}