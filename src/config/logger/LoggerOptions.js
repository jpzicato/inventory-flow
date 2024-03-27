import { format, transports } from 'winston'
import { join } from 'node:path'

const { combine, errors, timestamp, json, colorize, align, printf } = format
const { File, Console } = transports

export default class {
  _optionsLevel = 'http'

  constructor (env) {
    this._env = env
  }

  createOptions () {
    switch (this._env) {
      case 'production':
        return this._createProductionOptions()
      case 'development':
        return this._createDevelopmentOptions()
    }
  }

  _createProductionOptions = () => {
    const COMBINED_LOGS_FILENAME = 'combined.log'
    const ERROR_LOGS_FILENAME = 'error.log'
    const INFO_LOGS_FILENAME = 'info.log'
    const HTTP_LOGS_FILENAME = 'http.log'

    return {
      level: this._optionsLevel,
      format: this._createCombinedFormat(),
      transports: [
        this._createLogFile(COMBINED_LOGS_FILENAME),
        this._createLogFile(ERROR_LOGS_FILENAME, 'error'),
        this._createLogFile(INFO_LOGS_FILENAME, 'info'),
        this._createLogFile(HTTP_LOGS_FILENAME, 'http')
      ]
    }
  }

  _createDevelopmentOptions () {
    const formatsToCombine = [
      colorize(),
      align(),
      printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
    ]

    return {
      level: this._optionsLevel,
      format: this._createCombinedFormat(formatsToCombine),
      transports: [new Console()]
    }
  }

  _createCombinedFormat (formats) {
    const DATE_FORMAT = 'YYYY-MM-DD hh:mm:ss.SSS A'

    const baseFormats = [
      errors(),
      timestamp({ format: DATE_FORMAT })
    ]

    return formats ? combine(...baseFormats, ...formats) : combine(...baseFormats, json())
  }

  _createLogFile (filename, level) {
    const LOGS_FOLDER_PATH = 'logs'

    const fileOptions = { filename: join(LOGS_FOLDER_PATH, filename) }

    if (level) {
      fileOptions.level = level

      fileOptions.format = this._createLevelFilter(level)
    }

    return new File(fileOptions)
  }

  _createLevelFilter (level) {
    return format(info => info.level === level ? info : false)()
  }
}
