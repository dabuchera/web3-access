import {
  Spinner,
  Grid,
  Button,
  Box,
  Spacer,
  Center,
  Text,
  Code,
  Link,
  Flex,
  Icon,
  Heading,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { MutableRefObject, useEffect, useRef } from 'react'
import OverviewFile from '@/components/OverviewFile'
import { IPublicFile, PublicMetadataFile } from '@/types/storage'
import { useStorage } from '@/hooks/use-storage'
import { RefreshCcw, Share2, Trash2 } from 'react-feather'
import NextLink from 'next/link'
import useLoading from '@/hooks/use-loading'

const OverviewFiles = () => {
  const { refreshMetadata, publicMetadata, isMetadataRefreshing } = useStorage()
  const toast = useToast()

  const { isLoading: isLoading, startLoading: startLoading, stopLoading: stopLoading } = useLoading()

  const { isOpen: isTestDialogOpen, onOpen: onTestDialogOpen, onClose: onTestDialogClose } = useDisclosure()

  const testDialogCancelRef = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>

  useEffect(() => {
    const fetchFiles = async () => {
      await refreshMetadata()
    }

    fetchFiles()
  }, [])

  const handleShareFile = async (bool: boolean) => {
    startLoading()
    try {
     
      toast({
        title: 'Error deleting file',
        description: 'Something went wrong. Please try again later',
        status: 'error',
      })
      //   await toggleshareFile(path)
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error deleting file',
        description: 'Something went wrong. Please try again later',
        status: 'error',
      })
    }
    stopLoading()
    onTestDialogClose()
  }

  const tokenToStxSwap = async (dasAmount: number, address: string) => {
  const microstacks = tokenYAmount * microstacksPerSTX

  const stxPostCondition = makeContractSTXPostCondition(address, 'das', FungibleConditionCode.Equal, microstacks)

  const tokenPostCondition = makeStandardFungiblePostCondition(
    contractOwnerAddress,
    FungibleConditionCode.Equal,
    dasAmount,
    createAssetInfo(contractOwnerAddress, 'das-token', 'das-token')
  )

  const options: ContractCallRegularOptions = {
    contractAddress: contractOwnerAddress,
    contractName: 'das',
    functionName: 'token-to-stx-swap',
    functionArgs: [uintCV(dasAmount)],
    postConditions: [stxPostCondition, tokenPostCondition],
    network,
    appDetails,
    onFinish: (data) => {
      if (firstInputRef.current && secondInputRef.current) {
        firstInputRef.current.value = ''
        secondInputRef.current.value = ''
      }
      console.log('Swap DAS for STX...', data)
      // setAppstate((prevState) => ({
      //   ...prevState,
      //   showTxModal: true,
      //   currentTxMessage: '',
      //   tx_id: data.txId,
      //   tx_status: 'pending',
      // }))
    },
  }

  await openContractCall(options)
}

  return (
    <>
      <Heading mb={5}>Control Management</Heading>
      <Text fontSize="xl" mb={5}>
        Sharing control for all files that allowed sharing
      </Text>
      <Flex experimental_spaceX={4}>
        <Box>
          <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={onTestDialogOpen}>
            test
          </Button>
          <AlertDialog isOpen={isTestDialogOpen} onClose={onTestDialogClose} leastDestructiveRef={testDialogCancelRef}>
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader>Test</AlertDialogHeader>
                <AlertDialogBody>Are you sure you want to share this file? This operation cannot be undone.</AlertDialogBody>
                <AlertDialogFooter as={Flex} experimental_spaceX={4}>
                  <Button onClick={onTestDialogClose} ref={testDialogCancelRef}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="blue"
                    bg="blue.400"
                    onClick={async () => await handleShareFile(false)}
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
          <Text fontSize="l">Sharing control for all files that allowed sharing</Text>
        </Box>
        {/* Delete Button and Modal */}
        {/* <Box>
          <Button leftIcon={<Icon as={Trash2} />} colorScheme="red" bg="red.400" size="sm" onClick={onDeleteAlertDialogOpen}>
            Delete
          </Button>
          <AlertDialog
            isOpen={isDeleteAlertDialogOpen}
            onClose={onDeleteAlertDialogClose}
            leastDestructiveRef={deleteDialogCancelRef}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader>Delete File</AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure you want to delete this file? This operation cannot be undone.
                </AlertDialogBody>
                <AlertDialogFooter as={Flex} experimental_spaceX={4}>
                  <Button onClick={onDeleteAlertDialogClose} ref={deleteDialogCancelRef}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    bg="red.400"
                    onClick={async () => await handleDeleteFile(path)}
                    isLoading={isLoading}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Box> */}
      </Flex>
      <>
        {publicMetadata ? (
          <>
            <Spacer mb={8} h={4} />
            <Button
              onClick={async () => await refreshMetadata()}
              leftIcon={<Icon as={RefreshCcw} />}
              mb={8}
              isLoading={isMetadataRefreshing}
            >
              Refresh
            </Button>
          </>
        ) : (
          <Spacer mb={8} h={4} mt={8} />
        )}

        {isMetadataRefreshing ? (
          <Spinner />
        ) : (
          <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6} w="100%">
            {publicMetadata && Object.keys(publicMetadata.files).length > 0 ? (
              Object.keys(publicMetadata.files).map((path) => {
                const { isPublic, isString, lastModified, shared, url, userAddress }: IPublicFile = publicMetadata?.files[
                  path as keyof PublicMetadataFile['files']
                ] as IPublicFile
                return (
                  <OverviewFile
                    key={path}
                    path={path}
                    isPublic={isPublic}
                    isString={isString}
                    lastModified={lastModified}
                    shared={shared}
                    url={url}
                    userAddress={userAddress}
                  />
                )
              })
            ) : (
              <Center as={Flex} flexDirection="column" experimental_spaceX={4}>
                <Text fontSize="xl" fontWeight="semibold">
                  No files found
                </Text>
                <Text>
                  Upload a file by heading over to{' '}
                  <NextLink href="/upload" passHref>
                    <Code as={Link}>/upload</Code>
                  </NextLink>
                </Text>
              </Center>
            )}
          </Grid>
        )}
      </>
    </>
  )
}

export default OverviewFiles
