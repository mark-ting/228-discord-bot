import { Message } from 'discord.js'
import { Invocation } from './interfaces/Invocation'
import { Component } from './models/Component'
import { Core } from './Core'

export class Handler extends Component {
  constructor (core: Core) {
    super(core)
  }

  public async handle (invocation: Invocation) {
    const commandName = invocation.command
    const message = invocation.message

    if (!this.core.commandList.has(commandName)) {
      this.reactInvalid(message)
      this.logger.debug('Handler', `Unrecognized command: '${commandName}'`)
      return
    }

    const command = this.core.commandList.get(commandName)

    const permitted = message.member.hasPermission(command.neededPerms)
    if (!permitted) {
      this.reactProhibited(message)
      return
    }

    try {
      this.reactValid(message)
      command.action(this.core, message, invocation.args)
      this.logger.debug('Handler', `Command executed: '${command.uid()}'`)
    } catch (e) {
      const err = e as Error
      this.logger.error('Handler', `Command failed: ${command.uid()}`)
      this.logger.error('Handler', err.message)
    }
  }

  /**
   * React to valid command message with a checkmark.
   */
  private reactValid (message: Message) {
    return message.react(String.fromCodePoint(0x2705))
  }

  /**
   * React to valid but unauthorized command message with a no-entry sign.
   */
  private reactProhibited (message: Message) {
    return message.react(String.fromCodePoint(0x1F6AB))
  }

  /**s
   * React to invalid command message with a cross.
   */
  private reactInvalid (message: Message) {
    return message.react(String.fromCodePoint(0x274c))
  }
}
