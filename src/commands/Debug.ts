import { Command, Parameter } from '@models/Command'
import { Core } from '@src/Core'
import { Message, PermissionString } from 'discord.js'
import { Arguments } from 'yargs-Parser'

class DebugCommand extends Command {
  public readonly id = 'debug'
  public readonly namespace = 'Debug'
  public readonly desc = 'DEBUG COMMAND'
  public readonly permsNeeded: PermissionString[] = [
    'ADMINISTRATOR'
  ]
  readonly params: Parameter[] = []

  action = async (core: Core, message: Message, args: Arguments) => {
    const author = message.author
    const channel = message.channel
    const guild = message.guild

    return
  }
}

export = DebugCommand
