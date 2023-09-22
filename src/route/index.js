// Підключаємо технологію express для back-end сервера
const express = require('express')
const { emit } = require('nodemon')
const { TRUE } = require('sass')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return (
      Track.#list.find((track) => track.id === id) || null
    )
  }
}

// ================================================================

Track.create(
  'Інь Ян',
  'MONATIK & ROXOLANA',
  'https://picsum.photos/100/100',
)

Track.create(
  'Balila Comnigo (Remix)',
  'Selena Gomez & Raul Alejandro',
  'https://picsum.photos/100/100',
)

Track.create(
  'Shameless',
  'Camila Cabello',
  'https://picsum.photos/100/100',
)

Track.create(
  'DACITI',
  'BAD BANNY & JHAY',
  'https://picsum.photos/100/100',
)

Track.create(
  '11 PM',
  'Maluma',
  'https://picsum.photos/100/100',
)

Track.create(
  'Інша любов',
  'Enleo',
  'https://picsum.photos/100/100',
)

console.log(Track.getList())

// ================================================================

class Playlist {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }

  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    console.log('deleteTrackById', trackId)
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  addTrackById(playlist, trackId) {
    console.log('addTrackById', trackId)
    playlist.tracks.push(trackId)
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}

Playlist.makeMix(Playlist.create('Test1'))
Playlist.makeMix(Playlist.create('Test2'))
Playlist.makeMix(Playlist.create('Test3'))
Playlist.makeMix(Playlist.create('Test4'))

// ================================================================

router.get('/', function (req, res) {
  const value = ''

  const list = Playlist.findListByValue(value)

  res.render('spotify-start', {
    style: 'spotify-start',
    data: {
      list: list.map(({ tracks, ...res }) => ({
        ...res,
        amount: tracks.length,
      })),
      value,
    },
  })
})
// ================================================================

router.get('/spotify-choose', function (req, res) {
  res.render('spotify-choose', {
    style: 'spotify-choose',
    data: {},
  })
})
// ================================================================
router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  console.log(isMix)

  res.render('spotify-create', {
    style: 'spotify-create',
    data: {
      isMix,
    },
  })
})
// ================================================================
router.post('/spotify-create', function (req, res) {
  console.log(res.body, req.query)

  const isMix = !!req.query.isMix
  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Введіть назву плейліста',
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })

  // res.render('alert', {
  //   style: 'alert',
  //   data: {
  //     message: 'OK',
  //     info: 'Created',
  //     link: `/spotify-playlist?id=${playlist.id}`,
  //   },
  // })
})
// ================================================================

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/`,
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  // console.log('id', req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================

router.get('/spotify-playlist-add', function (req, res) {
  // console.log(req.query.playlistId)
  const id = Number(req.query.playlistId)

  const playlist = Playlist.getById(id)

  // console.log('playlist', playlist)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/`,
      },
    })
  }

  //console.log('playlist', playlist.tracks.length)

  if (playlist.tracks.length === 0) {
    playlist.tracks = Track.getList()
  }

  res.render('spotify-track-add', {
    style: 'spotify-track-add',
    data: {
      playlist: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================

router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  console.log('spotify-track-add-playlistId', req.query)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  //playlist.addTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlist: playlist.id,
      tracks: playlist.addTrackById(playlist, trackId),
      // tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================

router.get('/spotify-search', function (req, res) {
  const value = ''

  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...res }) => ({
        ...res,
        amount: tracks.length,
      })),
      value,
    },
  })
})

// ================================================================
router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...res }) => ({
        ...res,
        amount: tracks.length,
      })),
      value,
    },
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
