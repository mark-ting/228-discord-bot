import { Callable } from '@interfaces/Callable'
import { Core } from '@src/Core'
import { Message, PermissionString } from 'discord.js'
import { Arguments } from 'yargs-Parser'

export abstract class Command implements Callable, CommandObject {
  public id: string
  public namespace: string
  public desc: string
  public neededPerms: PermissionString[]
  public params: Parameter[]
  public action: CommandAction

  constructor (commandObject: CommandObject) {
    Object.assign(this, commandObject)
  }

  public uid (): string {
    return `${this.namespace}::${this.id}`
  }
}

export interface CommandObject {
  id: string
  namespace: string
  desc: string
  neededPerms: PermissionString[]
  params: Parameter[]
  action: CommandAction
}

export interface Parameter {
  name: string
  required: boolean
  description: string
}

export type CommandAction = (core: Core, message: Message, args: Arguments) => Promise<void>
