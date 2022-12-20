import { StacksNetwork } from '@stacks/network'
import { callReadOnlyFunction, cvToValue, standardPrincipalCV, bufferCVFromString } from '@stacks/transactions'
import { contractOwnerAddress, dasContractName, microstacksPerSTX } from '@/lib/constants'

export interface IUserInfo {
  stxBalance: number
  tokenBalance: number
}

export interface IUserUsageInfo {
  address: string
  minutesSum: number
}

export interface IDasStats {
  currentUser: string
  stxBalance: number
  tokenDasBalance: number
  counterUsers: number
  counterDuration: number
  lastUsage: {
    user: string
    duration: number
  }
}

export async function testBNS(network: StacksNetwork, userAddress: string, input: string): Promise<object> {
  console.log(input)
  const response = await callReadOnlyFunction({
    contractAddress: 'SP000000000000000000002Q6VF78',
    contractName: 'bns',
    functionName: 'can-name-be-registered',
    functionArgs: [bufferCVFromString('btc'), bufferCVFromString(input)],
    network,
    senderAddress: userAddress,
  })

  // stxBalanceResponse is a uint clarity value
  // cvToValue(stxBalanceResponse) is a bigint, balance in microstacks

  const boolean: boolean = cvToValue(response).value

  if (boolean) {
    console.log('TRUE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log(input)
  }

  return { input, boolean }
}

export async function fetchUserInfos(network: StacksNetwork, userAddress: string): Promise<IUserInfo> {
  const stxBalanceResponse = await callReadOnlyFunction({
    contractAddress: contractOwnerAddress,
    contractName: dasContractName,
    functionName: 'get-stx-balance',
    functionArgs: [standardPrincipalCV(userAddress)],
    network,
    senderAddress: userAddress,
  })

  // stxBalanceResponse is a uint clarity value
  // cvToValue(stxBalanceResponse) is a bigint, balance in microstacks

  const microstacks: bigint = cvToValue(stxBalanceResponse).value
  const stxBalance = Number(microstacks) / microstacksPerSTX

  // const stxBalance = 0

  const tokenBalanceResponse = await callReadOnlyFunction({
    contractAddress: contractOwnerAddress,
    contractName: dasContractName,
    functionName: 'get-das-balance',
    functionArgs: [standardPrincipalCV(userAddress)],
    network,
    senderAddress: userAddress,
  })

  // tokenBalanceResponse is a uint clarity value
  // cvToValue(tokenBalanceResponse) is a bigint, balance in tokens
  const tokenBalance = Number(cvToValue(tokenBalanceResponse).value)

  return {
    stxBalance,
    tokenBalance,
  }
}

export async function fetchDasInfo(network: StacksNetwork, userAddress: string): Promise<IDasStats> {
  const stxBalanceDasResponse = await callReadOnlyFunction({
    contractAddress: contractOwnerAddress,
    contractName: dasContractName,
    functionName: 'get-stx-dao-balance',
    functionArgs: [],
    network,
    senderAddress: userAddress,
  })

  // stxBalanceResponse is a uint clarity value
  // cvToValue(stxBalanceResponse) is a bigint, balance in microstacks

  const microstacks: bigint = cvToValue(stxBalanceDasResponse).value
  const stxBalance = Number(microstacks) / microstacksPerSTX

  // const stxBalance = 0

  const tokenBalanceDasResponse = await callReadOnlyFunction({
    contractAddress: contractOwnerAddress,
    contractName: dasContractName,
    functionName: 'get-das-dao-balance',
    functionArgs: [],
    network,
    senderAddress: userAddress,
  })

  // tokenBalanceResponse is a uint clarity value
  // cvToValue(tokenBalanceResponse) is a bigint, balance in tokens
  const tokenDasBalance = Number(cvToValue(tokenBalanceDasResponse).value)

  const loggingDataResponse = await callReadOnlyFunction({
    contractAddress: contractOwnerAddress,
    contractName: dasContractName,
    functionName: 'get-logging-data',
    functionArgs: [],
    network,
    senderAddress: userAddress,
  })

  const counterUsers = Number(cvToValue(loggingDataResponse).value.counterUsers.value)
  const counterDuration = Number(cvToValue(loggingDataResponse).value.counterDuration.value)

  //////////////////// Last Usage ////////////////////
  const lastUsageResponse = await callReadOnlyFunction({
    contractAddress: contractOwnerAddress,
    contractName: dasContractName,
    functionName: 'get-last-das-usage',
    functionArgs: [],
    network,
    senderAddress: userAddress,
  })

  let lastUsage

  if (cvToValue(lastUsageResponse).value) {
    lastUsage = {
      user: cvToValue(lastUsageResponse).value.value.user.value,
      duration: cvToValue(lastUsageResponse).value.value.minutes.value,
    }
  } else {
    lastUsage = {
      user: 'Not used yet',
      duration: 0,
    }
  }

  console.log('lastUsage : ', lastUsage)

  //////////////////// Current User ////////////////////
  const currentUserResponse = await callReadOnlyFunction({
    contractAddress: contractOwnerAddress,
    contractName: dasContractName,
    functionName: 'get-current-user',
    functionArgs: [],
    network,
    senderAddress: userAddress,
  })

  console.log('currentUserResponse : ', cvToValue(currentUserResponse))

  let currentUser = 'No User in the DAS'

  if (cvToValue(currentUserResponse).value) {
    currentUser = cvToValue(currentUserResponse).value
  }

  console.log('currentUser : ', currentUser)

  return {
    currentUser,
    stxBalance,
    tokenDasBalance,
    counterUsers,
    counterDuration,
    lastUsage,
  }
}

export async function fetchcurrentPrice(network: StacksNetwork, userAddress: string): Promise<number> {
  const currentPriceResponse = await callReadOnlyFunction({
    contractAddress: contractOwnerAddress,
    contractName: dasContractName,
    functionName: 'get-price',
    functionArgs: [],
    network,
    senderAddress: userAddress,
  })

  const price = cvToValue(currentPriceResponse).value

  console.log('currentPrice : ', price)

  return price
}

export async function fetchSpecificUserInfo(network: StacksNetwork, userAddress: string): Promise<IUserUsageInfo> {
  const currentInfoResponse = await callReadOnlyFunction({
    contractAddress: contractOwnerAddress,
    contractName: dasContractName,
    functionName: 'get-specific-das-user',
    functionArgs: [standardPrincipalCV(userAddress)],
    network,
    senderAddress: userAddress,
  })

  // const specificUserInfo = cvToValue(currentInfoResponse).
  // console.log(cvToValue(currentInfoResponse))

  let specificUserInfo = {
    address: userAddress,
    minutesSum: 0,
  }

  console.log(cvToValue(currentInfoResponse))

  if (cvToValue(currentInfoResponse).value) {
    specificUserInfo = {
      address: cvToValue(currentInfoResponse).value.value.address.value,
      minutesSum: cvToValue(currentInfoResponse).value.value.minutesSum.value,
    }
  }

  console.log('specificUserInfo')
  console.log('address : ', specificUserInfo.address)
  console.log('minutesSum : ', specificUserInfo.minutesSum)

  return specificUserInfo
}

// const tokenToStxSwap = async (dasAmount: number, address: string) => {
//   const microstacks = tokenYAmount * microstacksPerSTX

//   const stxPostCondition = makeContractSTXPostCondition(address, 'das', FungibleConditionCode.Equal, microstacks)

//   const tokenPostCondition = makeStandardFungiblePostCondition(
//     contractOwnerAddress,
//     FungibleConditionCode.Equal,
//     dasAmount,
//     createAssetInfo(contractOwnerAddress, 'das-token', 'das-token')
//   )

//   const options: ContractCallRegularOptions = {
//     contractAddress: contractOwnerAddress,
//     contractName: 'das',
//     functionName: 'token-to-stx-swap',
//     functionArgs: [uintCV(dasAmount)],
//     postConditions: [stxPostCondition, tokenPostCondition],
//     network,
//     appDetails,
//     onFinish: (data) => {
//       if (firstInputRef.current && secondInputRef.current) {
//         firstInputRef.current.value = ''
//         secondInputRef.current.value = ''
//       }
//       console.log('Swap DAS for STX...', data)
//       setAppstate((prevState) => ({
//         ...prevState,
//         showTxModal: true,
//         currentTxMessage: '',
//         tx_id: data.txId,
//         tx_status: 'pending',
//       }))
//     },
//   }

//   await openContractCall(options)
// }
