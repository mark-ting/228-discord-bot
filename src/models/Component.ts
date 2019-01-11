import { Core } from '@src/Core'
import { Logger } from '@src/Logger'

export abstract class Component {
  protected logger: Logger

  constructor (protected core: Core) {
    this.logger = core.logger
  }
}
