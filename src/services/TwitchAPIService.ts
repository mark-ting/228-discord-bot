import { Service } from '@models/Service'
import { Logger } from '@src/Logger'
import axios, { AxiosInstance } from 'axios'

const twitchBaseURL = 'https://api.twitch.tv/helix/'

export interface TwitchStream {
  community_ids: string[]
  game_id: string
  id: string
  language: string
  started_at: string
  title: string
  type: string
  thumbnail_url: string
  user_id: string
  user_name: string
  viewer_count: number
}

export interface TwitchUser {
  broadcaster_type: string
  description: string
  display_name: string
  email?: string
  id: string
  login: string
  offline_image_url: string
  profile_image_url: string
  type: string
  view_count: number
}

export interface TwitchGame {
  box_art_url: string
  id: string
  name: string
}

export interface TwitchGameResponse {
  data: TwitchGame[]
}

export interface TwitchStreamResponse {
  data: TwitchStream[]
  // assuming < 20 results, pagination is not needed
  pagination?: string
}

export interface TwitchUserResponse {
  data: TwitchUser[]
}

// TODO: add rate-limiting
// TODO: short-circuit game_id=0
export class TwitchAPIService extends Service {
  private instance: AxiosInstance

  public Games: TwitchGamesAPI
  public Streams: TwitchStreamsAPI
  public Users: TwitchUsersAPI

  constructor (logger: Logger, clientID: string) {
    super(logger)

    this.instance = axios.create({
      baseURL: twitchBaseURL,
      headers: {
        'Client-ID': clientID
      }
    })

    this.Games = new TwitchGamesAPI(this.instance)
    this.Streams = new TwitchStreamsAPI(this.instance)
    this.Users = new TwitchUsersAPI(this.instance)
  }

  static arrToSearchParams (name: string, vals: any[]): URLSearchParams {
    const params = new URLSearchParams()
    for (let i = 0; i < vals.length; i++) {
      params.append(name, vals[i])
    }
    return params
  }
}

class TwitchGamesAPI {
  private readonly endpoint = 'games'
  constructor (private instance: AxiosInstance) {}

  async getByID (IDs: string[]): Promise<TwitchGame[]> {
    // remove null game ID
    IDs = IDs.filter(id => id !== '0')

    if (IDs.length < 1) {
      throw new Error('Games.getByID requires at least one game ID.')
    }

    const params = TwitchAPIService.arrToSearchParams('id', IDs)
    const req = this.instance.get(this.endpoint, {
      params: params
    })
    const res = (await req).data as TwitchGameResponse
    return res.data
  }
}

class TwitchUsersAPI {
  private readonly endpoint = 'users'
  constructor (private instance: AxiosInstance) {}

  async getByID (IDs: string[]): Promise<TwitchUser[]> {
    const params = TwitchAPIService.arrToSearchParams('id', IDs)
    const req = this.instance.get(this.endpoint, {
      params: params
    })
    const res = (await req).data as TwitchUserResponse
    return res.data
  }

  async getByLogin (logins: string[]): Promise<TwitchUser[]> {
    const params = TwitchAPIService.arrToSearchParams('login', logins)
    const req = this.instance.get(this.endpoint, {
      params: params
    })
    const res = (await req).data as TwitchUserResponse
    return res.data
  }
}

class TwitchStreamsAPI {
  private readonly endpoint = 'streams'
  constructor (private instance: AxiosInstance) {}

  async getByUserID (userIDs: string[]): Promise<TwitchStream[]> {
    const params = TwitchAPIService.arrToSearchParams('user_id', userIDs)
    const req = this.instance.get(this.endpoint, {
      params: params
    })
    const res = (await req).data as TwitchStreamResponse
    return res.data
  }

  async getByUserLogin (userLogins: string[]): Promise<TwitchStream[]> {
    const params = TwitchAPIService.arrToSearchParams('user_login', userLogins)
    const req = this.instance.get(this.endpoint, {
      params: params
    })
    const res = (await req).data as TwitchStreamResponse
    return res.data
  }
}
