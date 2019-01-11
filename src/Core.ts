import { Client, GuildChannel, Message } from 'discord.js'
import { EventEmitter } from 'events'
import { Invocation } from '@interfaces/Invocation'
import { Handler } from './Handler'
import { Loader } from './Loader'
import { Logger } from './Logger'
import { Command } from './models/Command'
import { Observer } from './Observer'
import { Parser } from './Parser'
import { Store } from './Store'

export class Core extends EventEmitter {
  // Bot config
  public commandSymbol: string
  public commandList: Map<string, Command>

  // Components
  private loader: Loader
  private observer: Observer
  private parser: Parser
  private handler: Handler

  constructor (public logger: Logger, public client: Client, private token: string) {
    super()

    this.commandSymbol = '!'
    this.commandList = new Map()

    this.loader = new Loader(this)
    this.observer = new Observer(this)
    this.parser = new Parser(this)
    this.handler = new Handler(this)

    this.setupListeners()
    this.setupClient()

    this.loader.loadCommands()
  }

  // register event handlers for Discord.js client
  private async setupClient () {
    this.client.on('channelCreate', (channel) => {
      // Ignore DM and group channels
      if (channel.type === 'dm' || channel.type === 'group') {
        return
      }
    })
    // this.client.on('channelDelete', () => {})
    // this.client.on('channelPinsUpdate', () => {})
    // this.client.on('channelUpdate', () => {})
    // this.client.on('clientUserGuildSettingsUpdate', () => {})
    // this.client.on('clientUserSettingsUpdate', () => {})
    // this.client.on('debug', () => {})
    // this.client.on('disconnect', () => {})
    // this.client.on('emojiCreate', () => {})
    // this.client.on('emojiDelete', () => {})
    // this.client.on('emojiUpdate', () => {})
    // this.client.on('error', () => {})
    // this.client.on('guildBanAdd', () => {})
    // this.client.on('guildBanRemove', () => {})
    // this.client.on('guildCreate', () => {})
    // this.client.on('guildDelete', () => {})
    // this.client.on('guildMemberAdd', () => {})
    // this.client.on('guildMemberAvailable', () => {})
    // this.client.on('guildMemberRemove', () => {})
    // this.client.on('guildMembersChunk', () => {})
    // this.client.on('guildMemberSpeaking', () => {})
    // this.client.on('guildMemberUpdate', () => {})
    // this.client.on('guildUnavailable', () => {})
    // this.client.on('guildUpdate', () => {})
    this.client.on('message', (message) => {
      this.observer.observe(message)
    })
    // this.client.on('messageDelete', () => {})
    // this.client.on('messageDeleteBulk', () => {})
    // this.client.on('messageReactionAdd', () => {})
    // this.client.on('messageReactionRemove', () => {})
    // this.client.on('messageReactionRemoveAll', () => {})
    // this.client.on('messageUpdate', () => {})
    this.client.on('presenceUpdate', (oldMember, newMember) => {
      console.log(oldMember.presence)
      console.log(newMember.presence)
    })
    // this.client.on('rateLimit', () => {})
    this.client.on('ready', () => {
      this.logger.info('Client', `Logged in as ${this.client.user.tag}`)
    })
    // this.client.on('reconnecting', () => {})
    // this.client.on('resume', () => {})
    // this.client.on('roleCreate', () => {})
    // this.client.on('roleDelete', () => {})
    // this.client.on('roleUpdate', () => {})
    // this.client.on('typingStart', () => {})
    // this.client.on('typingStop', () => {})
    // this.client.on('userNoteUpdate', () => {})
    // this.client.on('userUpdate', () => {})
    // this.client.on('voiceStateUpdate', () => {})
    this.client.on('warn', (info) => {
      this.logger.warn('Client', `${info}`)
    })

    try {
      await this.client.login(this.token)
    } catch (e) {
      const err = e as Error
      this.logger.error('Client', err.message)
    }
  }

  private setupListeners () {
    // Message observed
    this.on('messageFilter', (message: Message) => {
      this.logger.trace('Core', 'Message observed.')
      this.parser.parse(message)
    })

    // Message parsed and is invocation
    this.on('parseInvocation', (invocation: Invocation) => {
      this.logger.trace('Core', 'Invocation parsed.')
      this.handler.handle(invocation)
    })

    // Message parsed and is not invocation
    this.on('parseMessage', (message: Message) => {
      this.logger.trace('Core', 'Message parsed.')
    })
  }
}
