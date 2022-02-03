import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
import spotifyApi, { LOGIN_URL } from '../../../lib/spotify'

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken)
    spotifyApi.setRefreshToken(token.refreshToken)

    const { body: refereshedToken } = await spotifyApi.refreshAccessToken()
    console.log('refreshed token', refereshedToken)

    return {
      ...token,
      accessToken: refereshedToken.access_token,
      accessTokenExpires: Date.now + refereshedToken.expires_in * 1000, // = 1 hour as 3600 returns seconds from spotify API
      refreshToken: refereshedToken.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error(error)

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000, // we are handling the expiry times in Milliseconds hence the * 1000
        }
      }
      // Return previous token if its not expired
      if (Date.now() < token.accessTokenExpires) {
        console.log('token is not expired')
        return token
      }
      // Access token has expired, then we need to refresh it
      console.log('token is expired')
      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      ;(session.user.accessToken = token.accessToken),
        (session.user.refreshToken = token.refreshToken),
        (session.user.username = token.username)

      return session
    },
  },
})
