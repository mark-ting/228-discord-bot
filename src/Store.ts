import pg = require('pg-promise')
import { createConfig, flattenConfig, inflateConfig, ServerConfig } from '@interfaces/ServerConfig'
import { Component } from '@models/Component'
import { Guild, Snowflake } from 'discord.js'
import { Core } from './Core'

export type Database = pg.IDatabase<{}>
export type CacheStore = Map<string, Cache>
export type DbStore = Map<string, Database>

export class Store extends Component {
  private cache: CacheStore = new Map<string, Cache>()
  private db: Database
  private configs: Map<Snowflake, ServerConfig>

  constructor (core: Core) {
    super(core)

    // PG root
    const initOptions = {}
    const conn = {
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    }
    const pgp: pg.IMain = pg(initOptions)
    this.db = pgp(conn)

    this.cache = new Map()
    this.configs = new Map()
    this.loadConfigs()
  }

  public async updateGuildConfig (guild: Guild) {
    this.configs.set(guild.id, await createConfig(guild))
    this.saveConfig(guild.id)
  }

  public async removeGuildConfig (guildID: Snowflake, purge: boolean = false) {
    if (purge) {
      try {
        const values = {
          schema: 'discord',
          table: 'configuration'
        }
        const deleteQuery = 'DELETE FROM ${schema:name}.${table:name} WHERE id = ${guildID};'
        const data = await this.db.oneOrNone(deleteQuery, values)
        if (data) {
          return
        }
      } catch (err) {
        this.logger.error('Store', 'Error deleting server configuration')
      }
    }
    this.configs.delete(guildID)
  }

  public async loadConfigs () {
    try {
      const values = {
        schema: 'discord',
        table: 'configuration'
      }
      const loadQuery = 'SELECT * FROM ${schema:name}.${table:name};'
      const data = await this.db.manyOrNone(loadQuery, values)
      if (data) {
        const configs = data.map(inflateConfig)
        console.log(configs)
        return
      }
    } catch (err) {
      this.logger.error('Store', err.message)
    }
  }

  public async saveConfigs () {
    this.configs.forEach((config, id) => {
      this.saveConfig(id)
    })
  }

  private async saveConfig (guildID: Snowflake) {
    let update = false
    try {
      const values = {
        schema: 'discord',
        table: 'configuration',
        guildID: guildID
      }
      const loadQuery = 'SELECT * FROM ${schema:name}.${table:name} WHERE guild_id = ${guildID};'
      const data = await this.db.oneOrNone(loadQuery, values)
      if (data) {
        update = true
      }
    } catch (err) {
      this.logger.error('Store', 'Error checking server configuration data for update.')
      this.logger.error('Store', err.message)
    }

    try {
      // TODO: proper update logic
      const values = {
        schema: 'discord',
        table: 'configuration',
        guildID: guildID,
        config: flattenConfig(this.configs.get(guildID))
      }

      const query = update
        ? 'UPDATE ${schema:name}.${table:name} SET config = ${config} WHERE guild_id = ${guildID} RETURNING *;'
        : 'INSERT INTO ${schema:name}.${table:name} (guild_id, config) VALUES (${guildID}, ${config}) RETURNING *;'

      await this.db.oneOrNone(query, values)
    } catch (err) {
      this.logger.error('Store', 'Error updating server configuration data.')
      this.logger.error('Store', err.message)
    }
  }
}
