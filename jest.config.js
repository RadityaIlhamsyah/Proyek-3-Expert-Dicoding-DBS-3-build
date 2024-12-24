/**
 * Jest Configuration
 * For detailed options, visit: https://jestjs.io/docs/configuration
 */

const config = {
  // File pattern untuk menemukan file test
  testMatch: [
    '**/tests/**/*.test.[jt]s?(x)', // Menggunakan pola pencarian test file
  ],

  // Modul untuk mengonfigurasi atau menyiapkan lingkungan pengujian sebelum setiap pengujian
  setupFiles: [
    'fake-indexeddb/auto', // Untuk IndexedDB palsu
  ],

  // Lingkungan test
  testEnvironment: 'jsdom',

  // Pemetaan nama modul (untuk alias dan file CSS/SCSS)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Alias untuk folder src
    '\\.(css|scss)$': 'identity-obj-proxy', // Mock untuk file gaya
  },

  // Aturan untuk transformasi file
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Untuk file JS/TS dengan Babel
  },
};

module.exports = config;
