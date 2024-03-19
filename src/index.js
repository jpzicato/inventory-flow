import setEnvVars from './config/envVars.js'
import { EnvError } from './config/errors.js'

try {
  const envVars = await setEnvVars(EnvError)

  console.log(envVars)
} catch (error) {
  if (error instanceof EnvError) {
    console.error(`Error setting environment variables: ${error.message}`)
  }

  process.exit(1)
}
