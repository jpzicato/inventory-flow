import setEnvVars from './config/envVars.js'
import { EnvError } from './config/errors.js'
import initializeLogger from './config/logger/index.js'

try {
  const envVars = await setEnvVars(EnvError)

  const logger = initializeLogger(envVars.NODE_ENV)

  logger.info('info')
  logger.error('error')
  logger.http('http')
} catch (error) {
  if (error instanceof EnvError) {
    console.error(`Error setting environment variables: ${error.message}`)
  }

  process.exit(1)
}
