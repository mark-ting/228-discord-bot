import { Task } from '@models/Task'
import { StreamManagerService } from '@services/StreamManagerService'
import { Core } from '@src/Core'
import { Logger } from '@src/Logger'

class StreamTrackerTask extends Task {
  public readonly id = 'stream-tracker'
  public readonly namespace = 'Twitch'
  public readonly desc = 'Stream state tracker task.'
  public readonly repeat = true
  public readonly interval = 10 * 1000
  private service: StreamManagerService

  constructor (logger: Logger) {
    super(logger)
  }

  setup = async (core: Core) => {
    this.service = new StreamManagerService(core)
    core.serviceList.set(this.id, this.service)

    // TODO: handle changing usernames (update)
    const streamers = [
      ''
    ]

    streamers.forEach(streamer => {
      // TODO: add Sandbox server ID for testing
      this.service.trackUser('TODO: FILL IN ID', streamer)
    })
  }

  action = async (core: Core) => {
    this.service.update()
  }

  cleanup = async (core: Core) => {
    core.serviceList.delete(this.id)
  }
}

export = StreamTrackerTask
