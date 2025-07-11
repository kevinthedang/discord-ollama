
/**
 * @class Logger
 * @description A class to handle logging messages
 * @method log
 */
export class Logger {
    private logPrefix: string = ''
    private type: string = 'log'

    private constructPrefix(component?: string, method?: string): string {
        let prefix = this.type.toUpperCase()

        if (component) {
            prefix += ` [${component}`
            if (method) prefix += `: ${method}`
            prefix += ']'
        }

        return prefix
    }

    public bind(component?: string, method?: string): CallableFunction {
        let tempPrefix = this.constructPrefix(component, method)

        if (tempPrefix !== this.logPrefix) this.logPrefix = tempPrefix

        switch (this.type) {
            case 'warn':
                return console.warn.bind(console, this.logPrefix)
            case 'error':
                return console.error.bind(console, this.logPrefix)
            case 'log':
            default:
                return console.log.bind(console, this.logPrefix)
        }
    }

    public log(type: string, message: unknown, component?: string, method?: string): void {
        if (type && type !== this.type) this.type = type

        let log = this.bind(component, method)

        log(message)
    }
}
