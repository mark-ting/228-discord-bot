import { Message } from 'discord.js'
import { Arguments } from 'yargs-parser'

export interface Invocation {
  command: string
  args: Arguments
  message: Message
}
