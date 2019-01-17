import { CommandDetailEmbed } from '@embeds/CommandDetailEmbed'
import { CommandListEmbed } from '@embeds/CommandListEmbed'
import { Command, Parameter } from '@models/Command'
import { Core } from '@src/Core'
import { Message, PermissionString, Permissions } from 'discord.js'
import { Arguments } from 'yargs-Parser'

class HelpCommand extends Command {
  public readonly id = 'help'
  public readonly namespace = 'General'
  public readonly desc = 'List commands or parameters for a specified command'
  public readonly neededPerms: PermissionString[] = []
  public readonly params: Parameter[] = [
    {
      name: 'command',
      required: false,
      description: 'Name of command.'
    }
  ]

  action = async (core: Core, message: Message, args: Arguments) => {
    if (!args['command'] && args._.length === 0) {
      const allowableCommands = Array.from(core.commandList.values())
        .filter(command => {
          return message.member.permissions.has(command.neededPerms)
        })
      const embed = new CommandListEmbed(allowableCommands)
      message.channel.send(embed)
      return
    }

    const commandName = args['command'] || args._[0]
    if (!core.commandList.has(commandName)) {
      message.reply(`\`${commandName}\` is not a recognized command.`)
      return
    }

    const command = core.commandList.get(commandName)
    const embed = new CommandDetailEmbed(command)
    message.channel.send(embed)

  }
}

export = HelpCommand
