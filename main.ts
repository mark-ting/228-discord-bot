import { Core } from '@src/Core'
import { Logger } from '@src/Logger'
import { Client } from 'discord.js'
import 'dotenv/config' // this import is mandatory
import * as readline from 'readline'

const logToConsole = process.env.LOG_TO_CONSOLE === '1'
const logLevel = parseInt(process.env.LOG_LEVEL, 10)
const logger = new Logger(new Date(), logToConsole, logLevel)

const configSet = process.env.ENV_CONFIG_SET === '1'
if (!configSet) {
  logger.fatal('main', 'Please confgure the .env file!')
  process.exit()
}

// Handle SIGINT on Windows arch
if (process.platform === 'win32') {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.on('SIGINT', () => {
    process.emit('disconnect')
  })
}

// Gracefully exit
process.on('disconnect', () => {
  core.emit('shutdown')
  logger.info('main', 'Bot shutting down.')
  process.exit()
})

const client = new Client()
const token = process.env.BOT_TOKEN
const core = new Core(logger, client, token)
