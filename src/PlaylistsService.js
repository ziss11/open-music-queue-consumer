const { Pool } = require('pg')

class PlaylistsService {
  constructor () {
    this._pool = new Pool()
  }

  async getPlaylistWithSongs (userId, playlistId) {
    const query = {
      text: `SELECT playlists.name, songs.id, songs.title, songs.performer FROM playlists
        LEFT JOIN songs ON songs.playlist_id=playlists.id
        WHERE playlists.id=$1 AND playlists.owner=$2`,
      values: [playlistId, userId]
    }

    const result = await this._pool.query(query)

    const { name } = result.rows[0]
    const playlistResult = { id: playlistId, name }
    const songsResult = result.rows.map(({ id, title, performer }) => ({
      id, title, performer
    }))

    return {
      playlist: {
        ...playlistResult,
        songs: songsResult.length !== 1 || songsResult[0].id != null ? songsResult : []
      }
    }
  }
}

module.exports = PlaylistsService
