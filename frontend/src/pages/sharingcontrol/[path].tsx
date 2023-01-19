import { useStorage } from '@/hooks/use-storage'
import {
  Box,
  Heading,
  Spinner,
  VStack,
  Tooltip,
  Icon,
  Text,
  IconButton,
  Button,
  Badge,
  useClipboard,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Share2 } from 'react-feather'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ChangeEvent, MutableRefObject, useEffect, useRef, useState } from 'react'
import useLoading from '@/hooks/use-loading'
import { IPrivateFile, IPublicFile } from '@/types/storage'
import { contractOwnerAddress, appDetails } from '@/lib/constants'
import { ContractCallRegularOptions, openContractCall } from '@stacks/connect'
import { url } from 'inspector'
import { 
  callReadOnlyFunction, 
  stringAsciiCV, 
  uintCV, 
  cvToValue, 
  standardPrincipalCV,
  NonFungibleConditionCode,
  createAssetInfo,
  makeStandardNonFungiblePostCondition,
  PostConditionMode
} from '@stacks/transactions'
import { StacksNetwork, StacksTestnet, StacksMocknet } from '@stacks/network'
import { useAuth } from '@/hooks/use-auth'

const ObjectPage: NextPage = () => {
  const {
    query: { path },
  } = useRouter()
  const { getFile, getFileMetadata, listDataAccessors, listAccessNFT } = useStorage()
  const {useSTXAddress} =  useAuth()

  const toast = useToast()

  const network = new StacksTestnet()

  const [metadata, setMetadata] = useState<IPrivateFile | IPublicFile>()

  const inputRef = useRef<HTMLInputElement>(null)
  const [numberInput1, setNumberInput1] = useState<number>(1)
  const [numberInput2, setNumberInput2] = useState<number>(1)
  const [addressInput1, setAddressInput1] = useState<string>('')
  const [addressInput2, setAddressInput2] = useState<string>('')

  const { isLoading: isLoading, startLoading: startLoading, stopLoading: stopLoading } = useLoading()

  const { isOpen: is_1DialogOpen, onOpen: on_1DialogOpen, onClose: on_1DialogClose } = useDisclosure()
  const _1DialogCancelRef = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>

  const { isOpen: is_2DialogOpen, onOpen: on_2DialogOpen, onClose: on_2DialogClose } = useDisclosure()
  const _2DialogCancelRef = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>

  const { isOpen: is_3DialogOpen, onOpen: on_3DialogOpen, onClose: on_3DialogClose } = useDisclosure()
  const _3DialogCancelRef = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>

  const { isOpen: is_4DialogOpen, onOpen: on_4DialogOpen, onClose: on_4DialogClose } = useDisclosure()
  const _4DialogCancelRef = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>

  const { isOpen: is_5DialogOpen, onOpen: on_5DialogOpen, onClose: on_5DialogClose } = useDisclosure()
  const _5DialogCancelRef = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>

  const { isOpen: is_6DialogOpen, onOpen: on_6DialogOpen, onClose: on_6DialogClose } = useDisclosure()
  const _6DialogCancelRef = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>

  const { isOpen: is_7DialogOpen, onOpen: on_7DialogOpen, onClose: on_7DialogClose } = useDisclosure()
  const _7DialogCancelRef = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>

  useEffect(() => {
    const fetchFile = async () => {
      if (path) {
        const pathParsed = (path as string).trim()
        const metadata = await getFileMetadata(pathParsed)
        if (metadata) {
          setMetadata(metadata)
          console.log(metadata)
        }
      }
    }

    fetchFile()
  }, [path])

  //-------------- ROLE-BASED SMARTCONTRACT FUNCTIONS --------------

  // (add-data-owner (url (string-ascii 100)))
  const addDataOwner = async () => {
    const url = metadata?.url
    if (!url) {
      return null
    }
    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: 'rolesAccess',
      functionName: 'add-data-owner',
      functionArgs: [stringAsciiCV(metadata.url)],
      postConditions: [],
      appDetails,
      onFinish: (data) => {
        on_1DialogClose()
        toast({
          title: 'Transaction succeeded',
          description: 'Congrats, you registered for this ownership role.',
          status: 'success',
        })
      },
    }
    await openContractCall(options)
  }

  // (add-data-accessor (url (string-ascii 100)) (address principal))
  const addDataAccessor = async () => {
    const url = metadata?.url
    if (!url) {
      return null
    }
    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: 'rolesAccess',
      functionName: 'add-data-accessor',
      functionArgs: [stringAsciiCV(metadata.url), standardPrincipalCV(addressInput1)],
      postConditions: [],
      appDetails,
      onFinish: (data) => {
        on_1DialogClose()
        toast({
          title: 'Transaction succeeded',
          description: 'Congrats, you registered a new address for the access-role.',
          status: 'success',
        })
      },
    }
    await openContractCall(options)
  }

  // (remove-data-accessors (url (string-ascii 100)))
  const removeDataAccessors = async () => {
    const url = metadata?.url
    if (!url) {
      return null
    }
    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: 'rolesAccess',
      functionName: 'remove-data-accessors',
      functionArgs: [stringAsciiCV(metadata.url)],
      postConditions: [],
      appDetails,
      onFinish: (data) => {
        on_1DialogClose()
        toast({
          title: 'Transaction succeeded',
          description: 'Congrats, you removed all address for the access-role.',
          status: 'success',
        })
      },
    }
    await openContractCall(options)
  }

  // (get-data-owner (url (string-ascii 100)))
  const getDataOwner = async () => {
    const address = useSTXAddress()
    if(!address){
      return null
    }
    const url = metadata?.url
    if (!url) {
      return null
    }
    const operationalTemp = await callReadOnlyFunction({
      contractAddress: contractOwnerAddress,
      contractName: 'rolesAccess',
      functionName: 'get-data-owner',
      functionArgs: [stringAsciiCV(metadata.url)],
      senderAddress: address,
      network
    })
    console.log(cvToValue(operationalTemp).value)
    if (cvToValue(operationalTemp).value == "1005"){
      toast({
        title: 'Transaction failed',
        description: 'No data owner found.',
        status: 'error',
      })
      return null
    }
    toast({
      title: 'Transaction succeeded',
      description: cvToValue(operationalTemp).value,
      status: 'success',
    })
    return null
  }

   // (list-of-data-accessors (url (string-ascii 100)))
   const listOfDataAccessors = async () => {
    const url = metadata?.url
    if (!url) {
      return null
    }
    const show = await listDataAccessors(url)
    if (show.length === 0){
      toast({
        title: 'No entries',
        description: 'There are no entries for this file',
        status: 'success',
      })
      return null
    }
    else {
      toast({
        title: 'Transaction succeeded',
        description: show,
        status: 'success',
      })
      return null
    }
  }

  //-------------- TOKEN-BASED SMARTCONTRACT FUNCTIONS --------------

  // (mint-ownership-nft (url (string-ascii 100)))
  const mintOwnershipNFT = async () => {
    const url = metadata?.url
    if (!url) {
      return null
    }
    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: 'tokenAccess',
      functionName: 'mint-ownership-nft',
      functionArgs: [stringAsciiCV(metadata.url)],
      postConditions: [],
      appDetails,
      onFinish: (data) => {
        on_1DialogClose()
        toast({
          title: 'Transaction succeeded',
          description: 'Congrats, your ownership-NFT is being issued.',
          status: 'success',
        })
      },
    }
    await openContractCall(options)
  }

  // (mint-data-access-nft (url (string-ascii 100)))
  const mintDataAccessNFT = async () => {
    const url = metadata?.url
    if (!url) {
      return null
    }
    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: 'tokenAccess',
      functionName: 'mint-data-access-nft',
      functionArgs: [stringAsciiCV(metadata.url)],
      postConditions: [],
      appDetails,
      onFinish: (data) => {
        on_1DialogClose()
        toast({
          title: 'Transaction succeeded',
          description: 'Congrats, your access-NFT is being issued.',
          status: 'success',
        })
      },
    }
    await openContractCall(options)
  }

  // (transfer (token-id uint) (sender principal) (recipient principal))
  const transferAccessNFT = async () => {
    const address = useSTXAddress()
    if(!address){
      return null
    }
    const url = metadata?.url
    if (!url) {
      return null
    }
    // With a standard principal
    const postConditionAddress = address
    const postConditionCode = NonFungibleConditionCode.DoesNotOwn
    const assetAddress = contractOwnerAddress
    const assetContractName = 'accessNFT'
    const assetName = 'accessNFT'
    // const tokenAssetName = stringAsciiCV('accessNFT')
    const tokenAssetName = uintCV(numberInput1)
    const nonFungibleAssetInfo = createAssetInfo(assetAddress, assetContractName, assetName)
    const standardNonFungiblePostCondition = 
      makeStandardNonFungiblePostCondition(
        postConditionAddress,
        postConditionCode,
        nonFungibleAssetInfo,
        tokenAssetName
      )
    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: 'accessNFT',
      functionName: 'transfer',
      functionArgs: [uintCV(numberInput1), standardPrincipalCV(address), standardPrincipalCV(addressInput2)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [standardNonFungiblePostCondition],
      appDetails,
      onFinish: (data) => {
        on_1DialogClose()
        toast({
          title: 'Transaction succeeded',
          description: 'Congrats, your access-NFT is being transferred.',
          status: 'success',
        })
      },
    }
    await openContractCall(options)
  }

  // (change-access-nft-activation (url (string-ascii 100)))
  const changeAcessNFTActivation = async () => {
    const url = metadata?.url
    if (!url) {
      return null
    }
    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: 'tokenAccess',
      functionName: 'change-access-nft-activation',
      functionArgs: [stringAsciiCV(metadata.url)],
      postConditions: [],
      appDetails,
      onFinish: (data) => {
        on_1DialogClose()
        toast({
          title: 'Transaction succeeded',
          description: 'Congrats, you changed the activation state.',
          status: 'success',
        })
      },
    }
    await openContractCall(options)
  }

  // (get-ownership-nft-owner (url (string-ascii 100)))
  const getOwnershipNFTOwner = async () => {
    const address = useSTXAddress()
    if(!address){
      return null
    }
    const url = metadata?.url
    if (!url) {
      return null
    }
    const operationalTemp = await callReadOnlyFunction({
      contractAddress: contractOwnerAddress,
      contractName: 'tokenAccess',
      functionName: 'get-ownership-nft-owner',
      functionArgs: [stringAsciiCV(metadata.url)],
      senderAddress: address,
      network
    })
    console.log(cvToValue(operationalTemp).value)
    if (cvToValue(operationalTemp).value == "1005"){
      toast({
        title: 'Transaction failed',
        description: 'No NFT owner found.',
        status: 'error',
      })
      return null
    }
    toast({
      title: 'Transaction succeeded',
      description: cvToValue(operationalTemp).value,
      status: 'success',
    })
    return null
  }

  // (list-of-access-nft (url (string-ascii 100)))
  const listOfAccessNFT = async () => {
    const url = metadata?.url
    if (!url) {
      return null
    }
    const show = await listAccessNFT(url)
    if (show.length === 0){
      toast({
        title: 'No entries',
        description: 'There are no entries for this file',
        status: 'success',
      })
      return null
    }
    else{
      toast({
        title: 'Transaction succeeded',
        description: show,
        status: 'success',
      })
      return null
    }
  }

  // (get-access-nft-owner (uri uint))
  const getAccessNFTOwner = async () => {
    const address = useSTXAddress()
    if(!address){
      return null
    }
    const operationalTemp = await callReadOnlyFunction({
      contractAddress: contractOwnerAddress,
      contractName: 'tokenAccess',
      functionName: 'get-access-nft-owner',
      functionArgs: [uintCV(numberInput2)],
      senderAddress: address,
      network
    })
    console.log(cvToValue(operationalTemp).value)
    if (cvToValue(operationalTemp).value == "1003"){
      toast({
        title: 'Transaction failed',
        description: 'No address found for this URI.',
        status: 'error',
      })
      return null
    }
    toast({
      title: 'Transaction succeeded',
      description: cvToValue(operationalTemp).value,
      status: 'success',
    })
    return null
  }

  //--------------  FRONTEND --------------

  return (
    <>
      {metadata ? (
        <>
          {/* --------------  ROLE FUNCTIONS -------------- */}
          <Heading mb={5}>Role-Based Data Sharing</Heading>

          {/* Register Ownership Role */}
          <Text fontSize="xl" mb={2}>
            Register for Ownership-Role
          </Text>
          <Flex experimental_spaceX={4} mb={8}>
            <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={on_1DialogOpen}>
              add-data-owner
            </Button>
            <AlertDialog isOpen={is_1DialogOpen} onClose={on_1DialogClose} leastDestructiveRef={_1DialogCancelRef}>
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader>Transaction Execution</AlertDialogHeader>
                  <AlertDialogBody>
                    Are you sure you want to execute this transaction? This will cost a transaction fee.
                  </AlertDialogBody>
                  <AlertDialogFooter as={Flex} experimental_spaceX={4}>
                    <Button onClick={on_1DialogClose} ref={_1DialogCancelRef}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="blue"
                      bg="blue.400"
                      onClick={async () => await addDataOwner()}
                      isLoading={isLoading}
                    >
                      Register as Owner
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Flex>

          {/* Register Address for Access Role */}
          <Text fontSize="xl" mb={2}>
            Register Address for Access-Role (max. 10)
          </Text>
          <Flex experimental_spaceX={4} mb={8}>
          <Flex>
          <Input placeholder='Copy Stacks-Address here' value={addressInput1} onChange={(event) => setAddressInput1(event.target.value)}/>
          </Flex>
            <Button marginTop={1} leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={on_2DialogOpen}>
              add-data-accessor
            </Button>
            <AlertDialog isOpen={is_2DialogOpen} onClose={on_2DialogClose} leastDestructiveRef={_2DialogCancelRef}>
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader>Transaction Execution</AlertDialogHeader>
                  <AlertDialogBody>
                    Are you sure you want to execute this transaction? This will cost a transaction fee.
                  </AlertDialogBody>
                  <AlertDialogFooter as={Flex} experimental_spaceX={4}>
                    <Button onClick={on_2DialogClose} ref={_2DialogCancelRef}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="blue"
                      bg="blue.400"
                      onClick={async () => await addDataAccessor()}
                      isLoading={isLoading}
                    >
                      Register Address
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Flex>

          {/* Remove all addresses from access role */}
          <Text fontSize="xl" mb={2}>
            Revoke Sharing for All Registered Access-Role Addresses
          </Text>
          <Flex experimental_spaceX={4} mb={8}>
            <Box>
              <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={on_3DialogOpen}>
                remove-data-accessors
              </Button>
              <AlertDialog isOpen={is_3DialogOpen} onClose={on_3DialogClose} leastDestructiveRef={_3DialogCancelRef}>
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader>Transaction Execution</AlertDialogHeader>
                    <AlertDialogBody>
                      Are you sure you want to execute this transaction? This will cost a transaction fee.
                    </AlertDialogBody>
                    <AlertDialogFooter as={Flex} experimental_spaceX={4}>
                      <Button onClick={on_3DialogClose} ref={_3DialogCancelRef}>
                        Cancel
                      </Button>
                      <Button
                        colorScheme="blue"
                        bg="blue.400"
                        onClick={async () => await removeDataAccessors()}
                        isLoading={isLoading}
                      >
                        Remove
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </Box>
          </Flex>

          <Text fontSize="xl" mb={8}>
            You want to check whether this worked?
          </Text>

          {/* Get address that has ownership role */}
          <Flex experimental_spaceX={4} mb={2}>
          <Text fontSize="l">Get address with the Ownership-Role.</Text>
              <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={getDataOwner}>
                get-data-owner
              </Button>
          </Flex>

          {/* Get list of addresses that have access role */}
          <Flex experimental_spaceX={4} mb={8}>
          <Text fontSize="l">Retrieve all addresses that have the Access-Role.</Text>
              <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={listOfDataAccessors}>
                list-of-data-accessors
              </Button>
          </Flex>
          
          {/* --------------  TOKEN FUNCTIONS -------------- */}
          <Heading mb={5}>Token-Based Data Sharing</Heading>

          {/* Mint ownerNFT */}
          <Text fontSize="xl" mb={2}>
            Mint Ownership-NFT
          </Text>
          <Flex experimental_spaceX={4} mb={8}>
            <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={on_4DialogOpen}>
              mint-ownership-nft
            </Button>
            <AlertDialog isOpen={is_4DialogOpen} onClose={on_4DialogClose} leastDestructiveRef={_4DialogCancelRef}>
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader>Transaction Execution</AlertDialogHeader>
                  <AlertDialogBody>
                    Are you sure you want to execute this transaction? This will cost a transaction fee.
                  </AlertDialogBody>
                  <AlertDialogFooter as={Flex} experimental_spaceX={4}>
                    <Button onClick={on_4DialogClose} ref={_4DialogCancelRef}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="blue"
                      bg="blue.400"
                      onClick={async () => await mintOwnershipNFT()}
                      isLoading={isLoading}
                    >
                      Mint
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Flex>

          {/* Mint accessNFT */}
          <Text fontSize="xl" mb={2}>
            Mint Access-NFTs (max. 10)
          </Text>
          <Flex experimental_spaceX={4} mb={8}>
            <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={on_5DialogOpen}>
              mint-data-access-nft
            </Button>
            <AlertDialog isOpen={is_5DialogOpen} onClose={on_5DialogClose} leastDestructiveRef={_5DialogCancelRef}>
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader>Transaction Execution</AlertDialogHeader>
                  <AlertDialogBody>
                    Are you sure you want to execute this transaction? This will cost a transaction fee.
                  </AlertDialogBody>
                  <AlertDialogFooter as={Flex} experimental_spaceX={4}>
                    <Button onClick={on_5DialogClose} ref={_5DialogCancelRef}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="blue"
                      bg="blue.400"
                      onClick={async () => await mintDataAccessNFT()}
                      isLoading={isLoading}
                    >
                      Mint
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Flex>

          {/* Transfer accessNFT */}
          <Text fontSize="xl" mb={2}>
            Transfer an Access-NFT. Specify the URI and Receiver of the NFT.
          </Text>
          <Flex experimental_spaceX={4} mb={8}>
            <Box>
            <NumberInput size="md" defaultValue={1} min={1} value={String(numberInput1)} onChange={(value) => setNumberInput1(Number(value))}>
              <NumberInputField />
              <NumberInputStepper  >
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            </Box>
            <Input mb={2} placeholder='Copy Stacks-Address here' value={addressInput2} onChange={(event) => setAddressInput2(event.target.value)}/>
            <Box>
            <Button marginTop={1} leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={on_6DialogOpen}>
              transfer
            </Button>
            </Box>
            <AlertDialog isOpen={is_6DialogOpen} onClose={on_5DialogClose} leastDestructiveRef={_6DialogCancelRef}>
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader>Transaction Execution</AlertDialogHeader>
                  <AlertDialogBody>
                    Are you sure you want to execute this transaction? This will cost a transaction fee.
                  </AlertDialogBody>
                  <AlertDialogFooter as={Flex} experimental_spaceX={4}>
                    <Button onClick={on_6DialogClose} ref={_6DialogCancelRef}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="blue"
                      bg="blue.400"
                      onClick={async () => await transferAccessNFT()}
                      isLoading={isLoading}
                    >
                      Transfer
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Flex>

          {/* Enable/Disable accessNFT sharing */}
          <Text fontSize="xl" mb={2}>
            Enable/Disable Access-NFT Sharing
          </Text>
          <Flex experimental_spaceX={4} mb={8}>
            <Box>
              <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={on_7DialogOpen}>
                change-access-nft-activation
              </Button>
              <AlertDialog isOpen={is_7DialogOpen} onClose={on_7DialogClose} leastDestructiveRef={_7DialogCancelRef}>
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader>Transaction Execution</AlertDialogHeader>
                    <AlertDialogBody>
                      Are you sure you want to execute this transaction? This will cost a transaction fee.
                    </AlertDialogBody>
                    <AlertDialogFooter as={Flex} experimental_spaceX={4}>
                      <Button onClick={on_7DialogClose} ref={_7DialogCancelRef}>
                        Cancel
                      </Button>
                      <Button
                        colorScheme="blue"
                        bg="blue.400"
                        onClick={async () => await changeAcessNFTActivation()}
                        isLoading={isLoading}
                      >
                        Change
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </Box>
          </Flex>

          <Text fontSize="xl" mb={2}>
            You want to check whether this worked?
          </Text>

          {/* Get owner of ownerNFT */}
          <Flex experimental_spaceX={4} mb={2}>
          <Box p={1}>
              <Text fontSize="l">Get the owner of the Ownership-NFT.</Text>
            </Box>
            <Box>
              <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={getOwnershipNFTOwner}>
                get-ownerhsip-nft-owner
              </Button>
            </Box>
          </Flex>

          {/* Get List of accessNFT Owners */}
          <Flex experimental_spaceX={4} mb={2}>
          <Box p={1}>
              <Text fontSize="l">Retrieve all active Access-NFT URI's.</Text>
            </Box>
            <Box>
              <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={listOfAccessNFT}>
                list-of-access-nft
              </Button>
            </Box>
          </Flex>

          {/* Get Access NFT Owner */}
          <Text fontSize="l" mb={2} mt={2}>Get the owner of one of the Access-NFT URI's retrieved above.</Text>
          <Flex experimental_spaceX={4} mb={2}>
            <NumberInput defaultValue={1} min={1} value={String(numberInput2)} onChange={(value) => setNumberInput2(Number(value))}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Button marginTop={1} leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={getAccessNFTOwner}>
              get-access-nft-owner
            </Button>
          </Flex>
        </>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default ObjectPage
