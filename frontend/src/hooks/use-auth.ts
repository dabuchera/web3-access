import { showConnect, UserData } from '@stacks/connect'
import { useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { appDetails } from '@/lib/constants'
import { userDataAtom, userSessionAtom } from '@/store/auth'

export const useAuth = () => {
  const userSession = useAtomValue(userSessionAtom)
  const [userData, setUserData] = useAtom(userDataAtom)

  const authenticate = () => {
    showConnect({
      appDetails,
      onFinish: () => window.location.reload(),
      userSession,
    })
  }

  const logout = () => {
    userSession.signUserOut()
    window.location.reload()
  }

  const useSTXAddress = (): string | undefined => {
    const env = process.env.REACT_APP_NETWORK_ENV
    const isMainnet = env == 'mainnet'

    if (isMainnet) {
      return userData?.profile?.stxAddress?.mainnet as string
    }
    return userData?.profile?.stxAddress?.testnet as string
  }

  const resolveSTXAddress = (userData: UserData | null) => {
    const env = process.env.REACT_APP_NETWORK_ENV
    const isMainnet = env == 'mainnet'

    if (isMainnet) {
      return userData?.profile?.stxAddress?.mainnet as string
    }
    return userData?.profile?.stxAddress?.testnet as string
  }

  return { userSession, userData, setUserData, authenticate, logout, useSTXAddress, resolveSTXAddress }
}
