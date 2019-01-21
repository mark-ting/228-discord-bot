import * as fs from 'fs'
import * as path from 'path'
import { Core } from './Core'
import { Command } from './models/Command'
import { Component } from './models/Component'
import { Task } from './models/Task'

export class Loader extends Component {
  constructor (core: Core) {
    super(core)
  }

  public loadCommands () {
    const commandDir = path.resolve(path.join('src', 'commands'))
    const files = fs.readdirSync(commandDir)
    this.logger.trace('Loader', `Looking for commands in: '${commandDir}'`)

    files.forEach((file) => {
      if (path.extname(file) !== '.js' && path.extname(file) !== '.ts') {
        this.logger.trace('Loader', `Invalid command file extension ignored: '${file}'`)
        return
      }

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

  public loadTasks () {
    const taskDir = path.resolve(path.join('src', 'tasks'))
    const files = fs.readdirSync(taskDir)
    this.logger.trace('Loader', `Looking for tasks in: '${taskDir}'`)

    files.forEach((file) => {
      if (path.extname(file) !== '.js' && path.extname(file) !== '.ts') {
        this.logger.trace('Loader', `Invalid task file extension ignored: '${file}'`)
        return
      }

      const taskInstance = require(path.join(taskDir, file))
      if (taskInstance instanceof Function === false) {
        this.logger.error('Loader', `Invalid task file: '${file}'`)
        return
      }

      const task: Task = new taskInstance(this.core)
      if (task instanceof Task === false) {
        this.logger.error('Loader', `Task initialization failed: '${file}'`)
        return
      }

      if (this.core.taskList.has(task.id)) {
        this.logger.warn('Loader', `Duplicate task '${task.uid()}' Some tasks may not work as expected until resolved.`)
      } else {
        this.core.taskList.set(task.id, task)
        this.logger.info('Loader', `Loaded task: '${task.uid()}'`)
      }
    })
  }
}
