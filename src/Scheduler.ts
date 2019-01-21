import { Core } from './Core'
import { Component } from './models/Component'

export class Scheduler extends Component {
  constructor (core: Core) {
    super(core)
  }

  public scheduleTasks () {
    this.core.taskList.forEach((task) => {
      // Run setup and then schedule task loop
      task.setup(this.core)
      this.logger.info('Scheduler', `Task '${task.uid()}' setup complete.`)

      if (!task.repeat) { return }
      task.action(this.core)
      setInterval(task.action, task.interval, this.core)
      this.logger.info('Scheduler', `Task '${task.uid()}' scheduled to run every ${task.interval} ms.`)
    })
  }

  public cleanupTasks () {
    this.core.taskList.forEach((task) => {
      task.cleanup(this.core)
      this.logger.info('Scheduler', `Task '${task.uid()}' cleaned up.`)
    })
  }
}
