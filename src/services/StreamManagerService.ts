import { TwitchStreamEmbed } from '@embeds/TwitchStreamEmbed'
import { Service } from '@models/Service'
import { Core } from '@src/Core'
import { Message, Snowflake, TextChannel } from 'discord.js'
import { TwitchAPIService, TwitchGame, TwitchStream, TwitchUser } from './TwitchAPIService'

interface TrackerState {
  trackedUserLogins: Set<string>
  activeUserLogins: Set<string>
  activeEmbeds: Map<string, Message>
  embedChannel: TextChannel
}

export class StreamManagerService extends Service {
  private trackedStates: Map<Snowflake, TrackerState>
  private Twitch: TwitchAPIService

  constructor (core: Core) {
    super(core.logger)

    this.trackedStates = new Map()
    core.store.configs.forEach((config, id) => {
      try {
        const guild = core.client.guilds.get(id)
        const embedChannel = guild.channels.get(config.channelIDs.stream) as TextChannel

        this.trackedStates.set(id, {
          trackedUserLogins: new Set(),
          activeUserLogins: new Set(),
          activeEmbeds: new Map(),
          embedChannel: embedChannel
        })
      } catch (e) {
        const err = e as Error
        this.logger.error('StreamManagerSvc', `Unable to set tracker state for Guild ID ${id}`)
      }
    })

    // TODO: add guild identifier
    this.Twitch = new TwitchAPIService(core.logger, process.env.TWITCH_CLIENT_ID)
  }

  public trackUser (guildID: Snowflake, userLogin: string) {
    const state = this.trackedStates.get(guildID)
    userLogin = userLogin.toLowerCase()
    state.trackedUserLogins.add(userLogin)
  }

  public untrackUser (guildID: Snowflake, userLogin: string) {
    const state = this.trackedStates.get(guildID)
    userLogin = userLogin.toLowerCase()
    state.trackedUserLogins.delete(userLogin.toLowerCase())
  }

  public update () {
    this.trackedStates.forEach((state, guildID) => {
      this.logger.debug('StreamManagerSvc', `Updating stream tracker state for guild #${guildID}.`)
      this.updateState(state)
    })
  }

  public async updateState (state: TrackerState) {
    const liveStreams = await this.Twitch.Streams.getByUserLogin([...state.trackedUserLogins])

    // clear out if no active streams
    if (liveStreams.length < 1) {
      state.activeEmbeds.forEach(message => {
        message.delete()
      })
      state.activeUserLogins.clear()
      return
    }

    const liveStreamsByUserID = liveStreams.reduce((map, liveStream) => {
      map[liveStream.user_name.toLowerCase()] = liveStream
      return map
    }, {} as { [key: string]: TwitchStream })

    const liveUsernames = liveStreams.map(stream => stream.user_name)
    const liveUsers = await this.Twitch.Users.getByLogin(liveUsernames)
    const liveUsersByLogin = liveUsers.reduce((map, user) => {
      map[user.login.toLowerCase()] = user
      return map
    }, {} as { [key: string]: TwitchUser })

    const liveUserLogins = new Set(liveUsers.map(tu => tu.login))

    // remove embeds for users that went offline
    const offlineUserIDs = Array.from(state.trackedUserLogins).filter(id => !liveUserLogins.has(id))
    offlineUserIDs.forEach(userID => {
      state.activeUserLogins.delete(userID)
      this.removeEmbed(state, userID)
    })

    // add embeds for users that came online
    const newUserLogins = Array.from(liveUserLogins).filter(id => !state.activeUserLogins.has(id))
    newUserLogins.forEach(async (login: string) => {
      const user = liveUsersByLogin[login]
      const stream = liveStreamsByUserID[login]
      const game = await this.Twitch.Games.getByID([stream.game_id])
      state.activeUserLogins.add(login)
      this.addEmbed(state, user, stream, game[0])
    })
  }

  private async addEmbed (state: TrackerState, user: TwitchUser, stream: TwitchStream, game: TwitchGame) {
    const embed = new TwitchStreamEmbed(user, stream, game)
    const embedMessage = await state.embedChannel.send(embed) as Message
    state.activeEmbeds.set(user.login, embedMessage)
  }

  private async removeEmbed (state: TrackerState, userLogin: string) {
    userLogin = userLogin.toLowerCase()
    if (state.activeEmbeds.has(userLogin)) {
      await state.activeEmbeds.get(userLogin).delete()
      state.activeEmbeds.delete(userLogin)
    }
  }
}
