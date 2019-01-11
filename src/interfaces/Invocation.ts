import { Message } from 'discord.js'
import { Arguments } from 'yargs-Parser'

export interface Invocation {
  command: string
  args: Arguments
  message: Message
}
