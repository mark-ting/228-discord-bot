import { Callable } from '@interfaces/Callable'
import { Core } from '@src/Core'
import { Logger } from '@src/Logger'

export abstract class Task implements Callable {
  id: string
  namespace: string
  desc: string
  repeat: boolean
  interval?: number

  constructor (protected logger: Logger) {}

  abstract setup: (core: Core) => Promise<void>
  abstract action: (core: Core) => Promise<void>
  abstract cleanup: (core: Core) => Promise<void>

  public uid (): string {
    return `${this.namespace}::${this.id}`
  }
}
