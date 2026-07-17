import { defineConfig } from 'vitest/config'

// config for vitest
export default defineConfig({
    test: {
        globals: true, // <-- reduces test file imports
        reporters: ['verbose'] // <-- verbose output
    }
})