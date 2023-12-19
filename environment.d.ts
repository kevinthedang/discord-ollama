declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            guildId: string;
            environment: 'dev' | 'prod' | 'debug';
        }
    }
}

// prevents issues with typescript compiler errors, basically shorthand
export {}