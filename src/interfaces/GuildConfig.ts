import { Guild, Snowflake } from 'discord.js'

export interface GuildConfig {
  guildID: Snowflake
  ownerID: Snowflake
  blacklist: Set<Snowflake>
  whitelist: Set<Snowflake>
  channelIDs: {
    stream?: Snowflake
    logging?: Snowflake
  }
}

export interface FlattenedConfig {
  guildID: Snowflake
  ownerID: Snowflake
  blacklist: Snowflake[]
  whitelist: Snowflake[]
  channelIDs: {
    stream?: Snowflake
    logging?: Snowflake
  }
}

// Config inflate/deflate needed for de/serialization of Sets
export function deflateConfig (c: GuildConfig): FlattenedConfig {
  return Object.assign(c, {
    blacklist: Array.from(c.blacklist),
    whitelist: Array.from(c.whitelist)
  })
}

export function inflateConfig (f: FlattenedConfig): GuildConfig {
  return Object.assign(f, {
    blacklist: new Set(f.blacklist),
    whitelist: new Set(f.whitelist)
  })
}

export async function createConfig (guild: Guild): Promise<GuildConfig> {
  const bans = (await guild.fetchBans()).keyArray()

  return {
    guildID: guild.id,
    ownerID: guild.ownerID,
    blacklist: new Set(bans),
    whitelist: new Set(),
    channelIDs: {
      stream: '',
      logging: ''
    }
  }
}
