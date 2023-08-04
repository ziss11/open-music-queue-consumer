const { Pool } = require('pg')

class PlaylistsService {
  constructor () {
    this._pool = new Pool()
  }

  async getPlaylistWithSongs (userId, playlistId) {
    const query = {
      text: `SELECT playlists.name, users.username, 
        songs.id, songs.title, songs.performer FROM playlists 
        LEFT JOIN users ON users.id=playlists.owner 
        LEFT JOIN songs ON songs.playlist_id=playlists.id 
        WHERE playlists.id=$1 AND playlists.owner=$2`,
      values: [userId, playlistId]
    }

    const result = await this._pool.query(query)
    return result.rows
  }
}

module.exports = PlaylistsService
