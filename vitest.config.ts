import { defineConfig, configDefaults } from 'vitest/config'

// config for vitest
export default defineConfig({
    test: {
        globals: true, // <-- reduces test file imports
        coverage: {
            exclude: [...configDefaults.exclude, 'build/*', 'tests/*'], // <-- exclude JS build
            reporter: ['text', 'html'] // <-- reports in text, html
        }
    }
})