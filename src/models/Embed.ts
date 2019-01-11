import { RichEmbed, RichEmbedOptions } from 'discord.js'

export abstract class Embed extends RichEmbed {
  constructor (options?: RichEmbedOptions) {
    super(options)
    this.setColor(0xdd0000)
    this.setTimestamp(new Date())
  }
}
