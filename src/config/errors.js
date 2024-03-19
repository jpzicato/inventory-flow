function createErrorFactory (name) {
  return class extends Error {
    constructor (message) {
      super(message)
      this.name = name
    }
  }
}

export const EnvError = createErrorFactory('EnvError')
