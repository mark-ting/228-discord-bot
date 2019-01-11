import * as fs from 'fs'
import * as moment from 'moment'
import * as path from 'path'

interface LogLine {
  time: string
  severity: string
  source: string
  message: string
}

export class Logger {
  private initMoment: moment.Moment
  private logDir: string
  private logPath: string

  constructor (initTime: Date, private logToConsole: boolean = false, private logLevel: number = 1) {
    this.initMoment = moment(initTime)
    this.logDir = path.resolve('logs')
    const logName = this.initMoment.format('YYYY-MM-DD_HHmmss,SSS[.log]')
    this.logPath = path.join(this.logDir, logName)

    if (!fs.existsSync(this.logDir)) {
      multiMkdirSync(this.logDir)
    }

    try {
      fs.closeSync(fs.openSync(this.logPath, 'w'))
    } catch (err) {
      console.error(`Unable to create logfile. ${err}`)
    }
  }

  public fatal (source: string, message: string) {
    this.log(source, 'FATAL', message)
  }

  public error (source: string, message: string) {
    this.log(source, 'ERROR', message)
  }

  public warn (source: string, message: string) {
    this.log(source, 'WARN', message)
  }

  public info (source: string, message: string) {
    if (this.logLevel < 1) { return }
    this.log(source, 'INFO', message)
  }

  public debug (source: string, message: string) {
    if (this.logLevel < 2) { return }
    this.log(source, 'DEBUG', message)
  }

  public trace (source: string, message: string) {
    if (this.logLevel < 3) { return }
    this.log(source, 'TRACE', message)
  }

  private log (source: string, severity: string, message: string) {
    if (this.logToConsole) {
      const consoleStr = `[${severity}]\t[${source}]: ${message}`
      console.log(consoleStr)
    }

    const line: LogLine = {
      time: this.timestamp(),
      severity: severity,
      source: source,
      message: message
    }

    const lineStr = JSON.stringify(line) + '\r\n'

    try {
      fs.appendFileSync(this.logPath, lineStr)
    } catch (err) {
      console.error(err)
    }
  }

  private timestamp (): string {
    return moment().format('YYYY-MM-DD HH:mm:ss,SSSS')
  }
}

/**
 * @param {string} dir
 * @param {boolean} [useCwd=false] whether dir is relative to calling script or Node working dir
 */
function multiMkdirSync (dir: string, useCwd: boolean = false) {
  const sep = path.sep
  const initDir = path.isAbsolute(dir) ? sep : ''
  const baseDir = useCwd ? '.' : __dirname

  dir.split(sep).reduce((parentDir: string, childDir: string) => {
    const curDir = path.resolve(baseDir, parentDir, childDir)

    if (!fs.existsSync(curDir)) {
      fs.mkdirSync(curDir)
    }
    return curDir
  }, initDir)
}
