import { Command } from '@models/Command'
import { Embed } from '@models/Embed'

export class CommandListEmbed extends Embed {
  constructor (commands: Command[]) {
    super()

    this.setTitle('Available Commands')
    this.setDescription('List of valid bot commands.')

    commands.forEach(command => {
      this.addField(`\`${command.id}\``, command.desc)
    })
  }
}
