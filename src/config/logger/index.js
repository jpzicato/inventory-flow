import LoggerOptions from './LoggerOptions.js'
import { createLogger } from 'winston'

export default env => {
  const loggerOptions = new LoggerOptions(env)

  return createLogger(loggerOptions.createOptions())
}
