import { defineConfig, configDefaults } from 'vitest/config'

// config for vitest
export default defineConfig({
    test: {
        globals: true, // <-- reduces test file imports
        reporters: ['verbose'], // <-- verbose output
        coverage: {
            exclude: [...configDefaults.exclude, 'build/*', 'tests/*'], // <-- exclude JS build
            reporter: ['text-summary'] // <-- report in text-summary
        }
    }
})