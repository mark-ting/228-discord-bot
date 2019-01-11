import { Command, Parameter } from '@models/Command'
import { Core } from '@src/Core'
import { Message, PermissionString } from 'discord.js'
import { Arguments } from 'yargs-Parser'

class HelloCommand extends Command {
  public readonly id = 'hello'
  public readonly namespace = 'General'
  public readonly desc = 'Says hello'
  public readonly permsNeeded: PermissionString[] = []
  public readonly params: Parameter[] = []

  public readonly action = async (core: Core, message: Message, args: Arguments) => {
    message.reply('Hello!')
    return
  }
}

export = HelloCommand
