import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import { useRecoilState } from 'recoil'
import useSpotify from '../hooks/useSpotify'
import useSongInfo from '../hooks/useSongInfo'

function Player() {
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession()
  const [currentTrackId, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = useState(50)

  const songInfo = useSongInfo()

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log('now playing: ', data.body?.item)
        setCurrentIdTrack(data.body?.item?.id)

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          console.log('is playing: ', data.body?.is_playing)
          setIsPlaying(data.body?.is_playing)
        })
      })
    }
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      // fetch song info
      fetchCurrentSong()
      setVolume(50)
    }
  }, [currentTrackId, spotifyApi, session])

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Left */}
      <div>
        <img
          className="hidden h-10 w-10 md:inline "
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
    </div>
  )
}

export default Player
