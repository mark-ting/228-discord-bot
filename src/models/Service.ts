import { Logger } from '@src/Logger'

export abstract class Service {
  constructor (protected logger: Logger) {
  }
}
