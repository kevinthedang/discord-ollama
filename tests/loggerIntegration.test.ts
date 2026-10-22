import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Writable } from 'node:stream'
import { ChannelType, type ChatInputCommandInteraction, type Client, type TextChannel } from 'discord.js'
import pino from 'pino'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createLogger } from '../src/components/logger.js'
import { Capacity } from '../src/commands/capacity.js'
import { openChannelInfo } from '../src/utils/handlers/chatHistoryHandler.js'
import { registerCommands, type SlashCommand } from '../src/utils/commands.js'

describe('logger context integration', () => {
    let output = ''
    const destination = new Writable({
        write(chunk, _encoding, callback) {
            output += chunk.toString()
            callback()
        }
    })
    const parentLogger = pino({ level: 'trace' }, destination)
    let workingDirectory: string
    let tempDirectory: string | undefined

    beforeEach(() => {
        output = ''
        workingDirectory = process.cwd()
        vi.stubEnv('NODE_ENV', 'test')
    })

    afterEach(() => {
        process.chdir(workingDirectory)
        if (tempDirectory)
            rmSync(tempDirectory, { recursive: true, force: true })
        vi.unstubAllEnvs()
    })

    it('retains event and command context in registration and handler logs', async () => {
        const readyLogger = createLogger({
            component: 'event',
            event: 'ClientReady'
        }, parentLogger)
        const commandsApi = {
            fetch: vi.fn().mockResolvedValue(new Map()),
            cache: { clear: vi.fn() },
            create: vi.fn(async (command: SlashCommand) => ({
                name: command.name,
                options: []
            }))
        }
        const client = {
            application: { commands: commandsApi }
        } as unknown as Client
        const mockCommand = {
            name: 'test-command',
            description: 'test command',
            run: vi.fn()
        } as unknown as SlashCommand

        registerCommands(client, [mockCommand], readyLogger)

        const commandLogger = createLogger({
            component: 'command',
            command: 'modify-capacity'
        }, createLogger({
            component: 'event',
            event: 'InteractionCreate'
        }, parentLogger))
        const interaction = {
            channelId: 'test-channel',
            commandName: 'modify-capacity',
            user: { username: 'test-user' },
            options: {
                getNumber: () => 8,
                get: () => ({ value: 8 })
            },
            reply: vi.fn()
        } as unknown as ChatInputCommandInteraction
        const commandClient = {
            channels: {
                fetch: vi.fn().mockResolvedValue({ type: ChannelType.GuildText })
            }
        } as unknown as Client

        tempDirectory = mkdtempSync(join(tmpdir(), 'discord-ollama-logger-'))
        process.chdir(tempDirectory)

        await Capacity.run(commandClient, interaction, commandLogger)
        await openChannelInfo(commandLogger, 'test-channel', {
            id: 'test-channel',
            name: 'test'
        } as TextChannel, 'test-user')

        await new Promise(resolve => setImmediate(resolve))
        const entries = output.trim().split('\n').map(line => JSON.parse(line))

        const registration = entries.find(entry => entry.msg === 'Registered command on Discord')
        expect(registration).toMatchObject({
            event: 'ClientReady',
            command: 'test-command',
            msg: 'Registered command on Discord'
        })

        const configuration = entries.find(entry => entry.msg === 'Created configuration file')
        expect(configuration).toMatchObject({
            event: 'InteractionCreate',
            component: 'command',
            command: 'modify-capacity',
            msg: 'Created configuration file'
        })
        expect(configuration.caller).toMatch(/configHandler\.ts:\d+:\d+/)

        const history = entries.find(entry => entry.msg === 'Created channel history')
        expect(history).toMatchObject({
            event: 'InteractionCreate',
            component: 'command',
            command: 'modify-capacity',
            msg: 'Created channel history'
        })
        expect(history.caller).toMatch(/chatHistoryHandler\.ts:\d+:\d+/)

    })
})
