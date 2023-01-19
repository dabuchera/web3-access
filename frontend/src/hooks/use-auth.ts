import { showConnect, UserData } from '@stacks/connect'
import { useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { appDetails } from '@/lib/constants'
import { userDataAtom, userSessionAtom } from '@/store/auth'
import { getRPCClient } from 'common/utils'

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

  const getBalance = async (address: string) => {
    const client = getRPCClient()
    const url = `${client.url}/extended/v1/address/${address}/balances`

    // console.log(url)
    const response = await fetch(url, { credentials: 'omit' })
    const data = await response.json()

    console.log(data)
    // const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS

    // // console.log(contractAddress)
    // const dasBalance = data.fungible_tokens[`${contractAddress}.das-token::das-token`]

    // return {
    //   stx: Number(data.stx.balance / microstacksPerSTX),
    //   das: dasBalance ? Number(dasBalance.balance) : 0,
    //   // stx: Number(data.stx.balance) - Number(data.stx.locked),
    //   // das: Number(dasBalance) ? dasBalance.balance : 0,
    // }
  }

  const getAccessNFTBalance = async (address: string) => {
    const client = getRPCClient()
    const url = `${client.url}/extended/v1/tokens/nft/holdings?principal=${address}&asset_identifiers=STN5A1RKHA2C2WH033G82SR2MSR8BGY3W1XTJ5W5.accessNFT::accessNFT`

    // console.log(url)
    const response = await fetch(url, { credentials: 'omit' })
    const data = await response.json()

    const returnArr: string[] = []
    data.results.forEach((element: { value: { repr: string } }) => {
      returnArr.push(element.value.repr.replace("u",""))
    });

    return returnArr
    // const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS

    // // console.log(contractAddress)
    // const dasBalance = data.fungible_tokens[`${contractAddress}.das-token::das-token`]

    // return {
    //   stx: Number(data.stx.balance / microstacksPerSTX),
    //   das: dasBalance ? Number(dasBalance.balance) : 0,
    //   // stx: Number(data.stx.balance) - Number(data.stx.locked),
    //   // das: Number(dasBalance) ? dasBalance.balance : 0,
    // }
  }

  return {
    userSession,
    userData,
    setUserData,
    authenticate,
    logout,
    useSTXAddress,
    resolveSTXAddress,
    getBalance,
    getAccessNFTBalance,
  }
}
