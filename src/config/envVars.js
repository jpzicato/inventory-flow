import { config } from 'dotenv'
import { join } from 'node:path'
import Joi from 'joi'

// Load environment variables from the .env file located in the project's root directory.
config({ path: join(import.meta.dirname, '../../.env') })

const envVarsSchema = Joi.object({
  NODE_ENV: Joi
    .string()
    .valid('production', 'development')
    .required()
})
  .options({
    allowUnknown: true,
    stripUnknown: true
  })

export default EnvError => {
  return envVarsSchema
    .validateAsync(process.env)
    .catch(error => {
      throw new EnvError(error.message)
    })
}
