import { Command, Parameter } from '@models/Command'
import { Embed } from '@models/Embed'

function prettyParamName (param: Parameter) {
  return param.required ? `<${param.name}>` : `[${param.name}]`
}

function prettyParamDesc (param: Parameter) {
  const reqText = param.required ? ' <required>' : ' [optional]'
  return param.name + reqText + '\n\t' + param.description + '\n'
}

export class CommandDetailEmbed extends Embed {
  constructor (command: Command) {
    super()

    this.setTitle(`About: \`${command.id}\``)
    this.setDescription(command.desc)

    const usageArr = [command.id]
    for (let i = 0; i < command.params.length; i++) {
      const param = command.params[i]
      usageArr.push(prettyParamName(param))
    }
    const usage = '`' + usageArr.join(' ') + '`'
    this.addField('Usage', usage)

    const paramText = command.params.length > 0
      ? command.params.map(prettyParamDesc).join('')
      : 'No parameters.'

    this.addField('Parameters', paramText)
  }
}
