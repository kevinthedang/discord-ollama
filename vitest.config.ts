import { defineConfig } from 'vitest/config'

// config for vitest
export default defineConfig({
    test: {
        globals: true, // <-- reduces test file imports
        reporters: ['verbose'], // <-- verbose output
        coverage: {
            include: ['src/**/*.ts'],
            reporter: 'json-summary'
        }
    }
})