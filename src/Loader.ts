import * as fs from 'fs'
import * as path from 'path'
import { Core } from './Core'
import { Command } from './models/Command'
import { Component } from './models/Component'

export class Loader extends Component {
  constructor (core: Core) {
    super(core)
  }

  public loadCommands () {
    const commandDir = path.resolve(path.join('src', 'commands'))
    const files = fs.readdirSync(commandDir)
    this.logger.trace('Loader', `Looking for commands in: '${commandDir}'`)

    files.forEach((file) => {
      if (path.extname(file) !== '.js' && path.extname(file) !== '.ts') { return }

      const commandInstance = require(path.join(commandDir, file))
      if (commandInstance instanceof Function === false) {
        this.logger.error('Loader', `Invalid command file: '${file}'`)
        return
      }

      const command: Command = new commandInstance(this.core)
      if (command instanceof Command === false) {
        this.logger.error('Loader', `Command initialization failed: '${file}'`)
        return
      }

      if (this.core.commandList.has(command.id)) {
        this.logger.warn('Loader', `Duplicate command '${command.uid()}' Some commands may not work as expected until resolved.`)
      } else {
        this.core.commandList.set(command.id, command)
        this.logger.info('Loader', `Loaded command: '${command.uid()}'`)
      }
    })
  }
}
