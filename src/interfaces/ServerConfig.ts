import { Snowflake, Guild } from 'discord.js'

export interface ServerConfig {
  id: Snowflake
  ownerID: Snowflake
  blacklist: Set<Snowflake>
  whitelist: Set<Snowflake>
  channels: {
    stream?: Snowflake
    logging?: Snowflake
  }
}

export interface FlattenedConfig {
  id: Snowflake
  ownerID: Snowflake
  blacklist: Snowflake[]
  whitelist: Snowflake[]
  channels: {
    stream?: Snowflake
    logging?: Snowflake
  }
}

export function flattenConfig (c: ServerConfig): FlattenedConfig {
  return Object.assign(c, {
    blacklist: Array.from(c.blacklist),
    whitelist: Array.from(c.whitelist)
  })
}

export function inflateConfig (f: FlattenedConfig): ServerConfig {
  return Object.assign(f, {
    blacklist: new Set(f.blacklist),
    whitelist: new Set(f.whitelist)
  })
}

export async function createConfig (guild: Guild) {
  const bans = (await guild.fetchBans()).keyArray()

  return {
    id: guild.id,
    ownerID: guild.ownerID,
    blacklist: new Set(bans),
    whitelist: new Set(),
    channels: {
      stream: '',
      logging: ''
    }
  }
}
