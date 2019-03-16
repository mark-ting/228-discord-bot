import { Service } from '@models/Service'
import { Logger } from '@src/Logger'

// Supported locale codes
export type LocaleCode =
  'en'

type TranslationSet = Map<LocaleCode, string>

export class TranslationService extends Service {
  private activeLocale: LocaleCode
  private localeStore: Map<string, TranslationSet>

  public availableLocales: Set<LocaleCode>

  constructor (logger: Logger) {
    super(logger)
  }

  private loadLocale (code: LocaleCode) {
    const locale = ''
    const localeData = new Map()

    this.localeStore.set(locale, localeData)
  }

  private setActiveLocale (locale: LocaleCode) {
    this.activeLocale = locale
    this.logger.info('TranSvc', `Now using locale: ${locale}`)
  }

  private translate (locStr: string) {
    if (!this.localeStore.has(locStr)) {
      this.logger.warn('TranSvc', `Unidentified locale string: "${locStr}"`)
      return locStr
    }

    const trans = this.localeStore.get(locStr)
    if (!trans.has(this.activeLocale)) {
      this.logger.warn('TranSvc', `Missing translation for locale "${this.activeLocale}" and locale string: "${locStr}"`)
      return locStr
    }

    return trans.get(this.activeLocale)
  }
}
