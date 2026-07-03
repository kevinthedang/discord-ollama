import { defineConfig, configDefaults } from 'vitest/config'

// config for vitest
export default defineConfig({
    test: {
        globals: true, // <-- reduces test file imports
        reporters: ['verbose'], // <-- verbose output
        coverage: {
            include: ['src/**/*.ts'],
            reporter: 'lcov',
            reportsDirectory: './coverage'
        }
    }
})