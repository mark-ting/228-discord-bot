import { Task } from '@models/Task'
import { StreamManagerService } from '@services/StreamManagerService'
import { Core } from '@src/Core'
import { Logger } from '@src/Logger'

class TestTask extends Task {
  public readonly id = 'test'
  public readonly namespace = 'Debug'
  public readonly desc = 'Test task.'
  public readonly repeat = false
  public readonly interval = 10 * 1000
  private service: StreamManagerService

  constructor (logger: Logger) {
    super(logger)
  }
  public setup = async (core: Core) => { return }
  public action = async (core: Core) => { return }
  public cleanup = async (core: Core) => { return }
}

export = TestTask
