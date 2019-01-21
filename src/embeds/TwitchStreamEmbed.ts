import { Embed } from '@models/Embed'
import { TwitchGame, TwitchStream, TwitchUser } from '@src/services/TwitchAPIService'

export class TwitchStreamEmbed extends Embed {
  constructor (user: TwitchUser, stream: TwitchStream, game: TwitchGame) {
    super()

    const streamURL = `https://twitch.tv/${user.login}`
    this.setAuthor(`${stream.user_name} is live on Twitch!`, user.profile_image_url, streamURL)
    this.setTitle(streamURL)
    this.setURL(streamURL)
    this.setThumbnail(user.profile_image_url)

    this.addField('Title', stream.title)
    this.addField('Playing', game ? game.name : '*unknown*')

    this.setImage(stream.thumbnail_url.replace('{width}', '480').replace('{height}', '270'))
    this.setFooter('Stream started at: ')
    this.setTimestamp(new Date(stream.started_at))
  }
}
