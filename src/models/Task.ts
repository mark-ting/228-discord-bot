import { Callable } from '@interfaces/Callable'
import { Core } from '@src/Core'

export abstract class Task implements Callable {
  id: string
  namespace: string
  desc: string
  repeat: boolean
  interval?: number

  constructor (protected core: Core) {}

  abstract setup: (core: Core) => Promise<void>
  abstract action: (core: Core) => Promise<void>
  abstract cleanup: (core: Core) => Promise<void>

  public uid () {
    return `${this.namespace}::${this.id}`
  }
}
