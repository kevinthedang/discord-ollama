import 'dotenv/config'
import pino, { type Logger as PinoLogger } from 'pino'
import { pinoCaller } from 'pino-caller'

const rootLogger = pino({
    level: process.env.LOG_LEVEL ?? 'info'
})

export function createLogger(bindings: pino.Bindings, parent: PinoLogger = rootLogger): PinoLogger {
    const childLogger = parent.child(bindings)

    return process.env.NODE_ENV === 'production'
        ? childLogger
        : pinoCaller(childLogger, { relativeTo: process.cwd() })
}
