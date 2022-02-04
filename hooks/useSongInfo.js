import React, { useState, useEffect } from 'react'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import { useRecoilState } from 'recoil'
import useSpotify from '../hooks/useSpotify'
import { useSession } from 'next-auth/react'

function useSongInfo() {
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession()
  const [currentIdTrack, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState)
  const [songInfo, setSongInfo] = useState(null)

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentIdTrack) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentIdTrack}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json())

        setSongInfo(trackInfo)
      }
    }
    fetchSongInfo()
  }, [currentIdTrack, spotifyApi])
  return songInfo
}

export default useSongInfo
