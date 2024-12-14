import { ChannelType } from 'discord.js'
import { UserMessage } from './index.js'

export interface UserConfiguration {
    'message-stream'?: boolean,
    'modify-capacity': number,
    'switch-model': string
}

export interface ServerConfiguration {
    'toggle-chat'?: boolean,
}

/**
 * Parent Configuration interface
 * 
 * @see ServerConfiguration server settings per guild
 * @see UserConfiguration user configurations (only for the user for any server)
 */
export interface Configuration {
    readonly name: string
    options: UserConfiguration | ServerConfiguration
}

/**
 * User config to use outside of this file
 */
export interface UserConfig {
    readonly name: string
    options: UserConfiguration
}

export interface ServerConfig {
    readonly name: string
    options: ServerConfiguration
}

export interface Channel {
    readonly id: string
    readonly name: string
    readonly user: string
    messages: UserMessage[]
}

/**
 * The following 2 types is allow for better readability in commands
 * Admin Command -> Don't run in Threads
 * User Command -> Used anywhere
 */
export const AdminCommand = [
    ChannelType.GuildText
]

export const UserCommand = [
    ChannelType.GuildText,
    ChannelType.PublicThread,
    ChannelType.PrivateThread
]

/**
 * Check if the configuration we are editing/taking from is a Server Config
 * @param key name of command we ran
 * @returns true if command is from Server Config, false otherwise
 */
export function isServerConfigurationKey(key: string): key is keyof ServerConfiguration {
    return ['toggle-chat'].includes(key);
}