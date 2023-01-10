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
import { callReadOnlyFunction, stringAsciiCV, uintCV, cvToValue} from '@stacks/transactions'
import { StacksNetwork, StacksTestnet, StacksMocknet } from '@stacks/network'
import { useAuth } from '@/hooks/use-auth'

const ObjectPage: NextPage = () => {
  const {
    query: { path },
  } = useRouter()
  const { getFile, getFileMetadata } = useStorage()
  const {useSTXAddress} =  useAuth()

  const toast = useToast()

  const [metadata, setMetadata] = useState<IPrivateFile | IPublicFile>()

  const inputRef = useRef<HTMLInputElement>(null)
  const [numberInput, setNumberInput] = useState<Number>(0)

  const { isLoading: isLoading, startLoading: startLoading, stopLoading: stopLoading } = useLoading()

  const { isOpen: is_1DialogOpen, onOpen: on_1DialogOpen, onClose: on_1DialogClose } = useDisclosure()
  const _1DialogCancelRef = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>

  const { isOpen: is_2DialogOpen, onOpen: on_2DialogOpen, onClose: on_2DialogClose } = useDisclosure()
  const _2DialogCancelRef = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>

  const { isOpen: is_3DialogOpen, onOpen: on_3DialogOpen, onClose: on_3DialogClose } = useDisclosure()
  const _3DialogCancelRef = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>

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

  const test = () => {
    console.log(numberInput)
  }

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
      // network,
      appDetails,
      onFinish: (data) => {
        on_1DialogClose()
        toast({
          title: 'Transaction succeed',
          description: 'Congrats, your NFT is coming',
          status: 'success',
        })
      },
    }

    await openContractCall(options)
  }

  const mintDataAccessNFT = async () => {}

  const changeAcessNFTActivation = async () => {}



  const getAccessNFTOwner = async () => {
    const address = useSTXAddress()
    if(!address){
      return null
    }
    console.log(address)

    const network = new StacksTestnet()

    const operationalTemp = await callReadOnlyFunction({
      contractAddress: contractOwnerAddress,
      contractName: 'tokenAccess',
      functionName: 'get-access-nft-owner',
      functionArgs: [uintCV(numberInput)],
      senderAddress: address,
      network
    })
    // return cvToValue(operationalTemp).value
    console.log(cvToValue(operationalTemp).value)
  }



  // principalCV(string)

  return (
    <>
      {metadata ? (
        <>
          <Heading mb={5}>Token-Based Data Sharing</Heading>
          <Text fontSize="xl" mb={2}>
            Mint Ownership-NFT
          </Text>
          <Flex experimental_spaceX={4} mb={8}>
            <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={on_1DialogOpen}>
              mint-ownership-nft
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

          {/* slkdjflksjdfkjskdjfsdj */}
          <Text fontSize="xl" mb={2}>
            Mint Access Tokens that you can send to other addresses to access a gaiaURL. You need to own the OwnershipNFT for
            this Gaia-URL.
          </Text>
          <Flex experimental_spaceX={4} mb={8}>
            <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={on_2DialogOpen}>
              mint-data-access-nft
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
                      onClick={async () => await mintDataAccessNFT()}
                      isLoading={isLoading}
                    >
                      Mint
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
            <Box p={1}>
              <Text fontSize="l">Mint data access-NFT for this Gaia-URL (Maximum 10).</Text>
            </Box>
          </Flex>

          {/* slkdjflksjdfkjskdjfsdj */}
          <Text fontSize="xl" mb={2}>
            Enable/disable sharing for a gaiaURL that you minted access-NFTs for.
          </Text>
          <Flex experimental_spaceX={4} mb={8}>
            <Box>
              <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={on_3DialogOpen}>
                change-access-nft-activation
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
                        onClick={async () => await changeAcessNFTActivation()}
                        isLoading={isLoading}
                      >
                        test
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </Box>
            <Box p={1}>
              <Text fontSize="l">Enable/disable NFT access for this Gaia-URL.</Text>
            </Box>
          </Flex>

          {/* slkdjflksjdfkjskdjfsdj */}
          <Text fontSize="xl" mb={2}>
            You want to check whether this worked?
          </Text>
          <Flex experimental_spaceX={4} mb={2}>
            <Box>
              <Input mb={2} placeholder="Copy Gaia-URL here" />
              <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={test}>
                get-ownerhsip-nft-owner
              </Button>
            </Box>
            <Box p={1}>
              <Text fontSize="l">Retrieve the ownership-NFT owner for a Gaia-URL.</Text>
            </Box>
          </Flex>

          {/* slkdjflksjdfkjskdjfsdj */}
          <Flex experimental_spaceX={4} mb={2}>
            <Box>
              <Input mb={2} placeholder="Copy Gaia-URL here" />
              <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={test}>
                list-of-access-nft
              </Button>
            </Box>
            <Box p={1}>
              <Text fontSize="l">Retrieve all active access-NFT URI's for a Gaia-URL.</Text>
            </Box>
          </Flex>

          {/* Get Access NFT Owner */}
          <Flex experimental_spaceX={4} mb={2}>
            <NumberInput defaultValue={0} min={0} value={String(numberInput)} onChange={(value) => setNumberInput(Number(value))}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={getAccessNFTOwner}>
              get-access-nft-owner
            </Button>
            <Box p={1}>
              <Text fontSize="l">Retrieve the access-NFT owner for a Token-URI.</Text>
            </Box>
          </Flex>
        </>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default ObjectPage
