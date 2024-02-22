import Joi from "@hapi/joi";
import { config as envConfig } from "dotenv";
envConfig();

const envSchema = Joi.object({
  PORT: Joi.number().default(4040),
  JWT_SECRET: Joi.string().default("KIO"),
})
  .unknown()
  .required();

const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  socketport: envVars.SOCKET_PORT,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiry: parseInt(envVars.JWT_EXPIRY),
  psql_schema: envVars.DB_SCHEMA,

  postgresql: {
    host: envVars.DB_HOST,
    user: envVars.DB_USER,
    database: envVars.DB_DATABASE,
    password: envVars.DB_PASSWORD,
    port: envVars.DB_PORT,
  },

  email: envVars.EMAIL,
  password: envVars.PASSWORD,
  open_ai_key: envVars.OPENAI_KEY
  // redis: {
  //     url: envVars.RedisUrl,
  // },
};

export default config;
