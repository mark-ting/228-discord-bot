import { Message } from 'discord.js'
import { Core } from './Core'
import { Component } from './models/Component'
import xregexp = require('xregexp')
import yargsParser = require('yargs-parser')

export class Parser extends Component {
  constructor (core: Core) {
    super(core)
  }

  public parse (message: Message) {
    const commandSymbol = this.core.commandSymbol
    const invoking = message.content.startsWith(commandSymbol)

    if (!invoking) {
      this.core.emit('parseMessage')
      return
    }

    const tokens = this.tokenize(message.content)

    try {
      this.core.emit('parseInvocation', {
        command: tokens.shift().slice(commandSymbol.length),
        args: yargsParser(tokens),
        message: message
      })
    } catch (e) {
      this.logger.error('Parser', `Error parsing message: << ${message.content} >>`)
    }
  }

  private tokenize (content: string) {
    // tokens separated by whitespace and contained by matched pairs of quote chars
    const argExp = /("[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S)+)/g
    const tokens = xregexp.match(content, argExp)

    // remove surrounding quote characters
    const strippedTokens = tokens.map((token) => {
      const prunable = (
        (token.startsWith(`'`) && token.endsWith(`'`)) ||
        (token.startsWith(`"`) && token.endsWith(`"`))
      )
      return prunable ? token.slice(1, token.length - 1) : token
    })

    return strippedTokens
  }
}
