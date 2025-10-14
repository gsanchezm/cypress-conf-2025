const { defineConfig } = require("cypress");
const path = require('path')
const pino = require('pino')
const { LocatorService } = require('./common/locator/locatorService.js')
const { RegisterGenerator } = require('./common/tools/registerGenerator.js')
require('dotenv').config()

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: { target: 'pino-pretty', options: { translateTime: 'SYS:standard', colorize: true } },
});

function buildRegistrars() {
  const gen = new RegisterGenerator({
    extensions: ['.js'],
    // pick one:
    // keyStrategy: 'exportName',
    keyStrategy: 'fileName',
  })

  const outDir = path.resolve('cypress/.generated')
  gen.generate({
    globRoot: path.resolve('cypress/e2e/testTasks'),
    outFile: path.join(outDir, 'tasks.generated.js'),
    exportFnName: 'registerAllTestTasks',
  })
  gen.generate({
    globRoot: path.resolve('cypress/e2e/testValidations'),
    outFile: path.join(outDir, 'validations.generated.js'),
    exportFnName: 'registerAllTestValidations',
  })
  logger.info('Registers generated')
}

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    setupNodeEvents(on, config) {
      buildRegistrars()
      // normalize env
      config.env = {
        ...config.env,
        PLATFORM: (process.env.PLATFORM || config.env.PLATFORM || 'DESKTOP').toUpperCase(),
        LOG_LEVEL: process.env.LOG_LEVEL || config.env.LOG_LEVEL || 'info',
      }

      logger.info({ platform: config.env.PLATFORM }, 'Cypress boot')

      // Instantiate service once; reused by tasks
      const locatorService = new LocatorService({
        locatorsDir: './locators',
        logger,
      })

      on('task', {
        // Resolve a single selector when requested by the browser
        'loc:resolve'(payload) {
          try {
            return locatorService.resolveSelector(payload) // returns string
          } catch (err) {
            logger.error({ err: String(err), payload }, 'loc:resolve failed')
            throw err
          }
        },

        // Optional utilities:
        'loc:clearCache'() {
          locatorService.clearCache()
          logger.info('Locator cache cleared')
          return null
        },
      })

      return config
    },
  },
});