import { Message } from 'discord.js'
import { Component } from './models/Component'
import { Core } from './Core'

// Filter functions act non-destructively on messages and return if the message
// should continue to propogate through the chain
export type FilterFunction = (message: Message) => boolean
export type FilterChain = FilterFunction[]

export class Observer extends Component {
  private filterChain: FilterChain

  constructor (core: Core) {
    super(core)
    this.filterChain = [() => true]
  }

  public observe (message: Message) {
    try {
      this.filterChain.reduce((a, b) => a && b(message), true)
      this.core.emit('messageFilter', message)
    } catch (e) {
      const err = e as Error
      this.logger.error('Observer', err.message)
    }
  }
}
