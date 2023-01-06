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
      <Heading mb={5}>Data Sharing Control</Heading>
      <Heading mb={5}>dApp Sharing Permissions</Heading>
      <Text fontSize="xl" mb={2}>
        Enable this dApp to share data. This does not automatically share your data, but you can then further specify role-based and token-based sharing of individual data.
      </Text>
      <Flex experimental_spaceX={4} mb={8}>
        <Box>
          <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={onTestDialogOpen}>
            Allow Sharing
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
          <Text fontSize="l">Allow dApp Data Sharing</Text>
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
      <Text fontSize="xl" mb={2}>
        Revoke the permission for this dApp to share data. This stops data sharing, regardless of what you have specified below in role-based or token-based sharing.
      </Text>
      <Flex experimental_spaceX={4} mb={5}>
        <Box>
          <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={onTestDialogOpen}>
            Revoke Sharing
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
          <Text fontSize="l">Revoke dApp Data Sharing</Text>
        </Box>
      </Flex>

      <Heading mb={5}>Role-Based Data Sharing</Heading>
      <Text fontSize="xl" mb={2}>
        Register Ownership for a Gaia Data-URL. Only when you are the data owner of a Gaia URL you can enable sharing below.
      </Text>
      <Flex experimental_spaceX={4} mb={8}>
        <Box>
          <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={onTestDialogOpen}>
            add-data-owner
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
          <Text fontSize="l">Register Ownership for this Gaia-URL (input field required here)</Text>
        </Box>
      </Flex>
      <Text fontSize="xl" mb={2}>
        Register a new address that can access data you are the data owner. (Maximum 10)
      </Text>
      <Flex experimental_spaceX={4} mb={8}>
        <Box>
          <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={onTestDialogOpen}>
            add-data-accessor
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
          <Text fontSize="l">Register new address (input field required here) that can access this Gaia-URL (input field required here)</Text>
        </Box>
      </Flex>
      <Text fontSize="xl" mb={2}>
        Revoke sharing for all addresses that can access data you are the data owner.
      </Text>
      <Flex experimental_spaceX={4} mb={8}>
        <Box>
          <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={onTestDialogOpen}>
            remove-data-accessors
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
          <Text fontSize="l">Remove all addresses that can access your Gaia-URL (input field required here)</Text>
        </Box>
      </Flex>
      <Text fontSize="xl" mb={2}>
        You want to check whether this worked?
      </Text>
      <Flex experimental_spaceX={4} mb={2}>
        <Box>
          <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={onTestDialogOpen}>
            get-data-owner
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
          <Text fontSize="l">Check the data owner role of a Gaia-URL (input field required here)</Text>
        </Box>
      </Flex>
      <Flex experimental_spaceX={4} mb={5}>
        <Box>
          <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={onTestDialogOpen}>
            list-of-data-accessors
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
          <Text fontSize="l">Check the data accessor roles of a Gaia-URL (input field required here)</Text>
        </Box>
      </Flex>

      <Heading mb={5}>Token-Based Data Sharing</Heading>
      <Text fontSize="xl" mb={2}>
        Mint Ownership NFT for gaiaURL
      </Text>
      <Flex experimental_spaceX={4} mb={8}>
        <Box>
          <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={onTestDialogOpen}>
            mint-ownership-nft
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
          <Text fontSize="l">Mint ownership nft for this Gaia-URL (input field required here)</Text>
        </Box>
      </Flex>
      <Text fontSize="xl" mb={2}>
        Mint Access Tokens that you can send to other addresses to access a gaiaURL. You need to own the OwnershipNFT for this Gaia-URL.
      </Text>
      <Flex experimental_spaceX={4} mb={8}>
        <Box>
          <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={onTestDialogOpen}>
            mint-data-access-nft
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
          <Text fontSize="l">Mint data access nft for this Gaia-URL (input field required here) (Maximum 10)</Text>
        </Box>
      </Flex>
      <Text fontSize="xl" mb={2}>
        Enable/disable sharing for a gaiaURL that you minted access-NFTs for.
      </Text>
      <Flex experimental_spaceX={4} mb={8}>
        <Box>
          <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={onTestDialogOpen}>
            change-access-nft-activation
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
          <Text fontSize="l">Enable/disable NFT access for this Gaia-URL (input field required here)</Text>
        </Box>
      </Flex>
      <Text fontSize="xl" mb={2}>
        You want to check whether this worked?
      </Text>
      <Flex experimental_spaceX={4} mb={2}>
        <Box>
          <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={onTestDialogOpen}>
            get-ownerhsip-nft-owner
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
          <Text fontSize="l">Retrieve the ownership-NFT owner for a Gaia-URL (input field required here)</Text>
        </Box>
      </Flex>
      <Flex experimental_spaceX={4} mb={2}>
        <Box>
          <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={onTestDialogOpen}>
            list-of-access-nft
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
          <Text fontSize="l">Retrieve all access-NFT uri's active for a Gaia-URL (input field required here)</Text>
        </Box>
      </Flex>
      <Flex experimental_spaceX={4} mb={2}>
        <Box>
          <Button leftIcon={<Icon as={Share2} />} colorScheme="blue" bg="blue.400" size="sm" onClick={onTestDialogOpen}>
            get-access-nft-owner
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
          <Text fontSize="l">Retrieve the access-NFT owner for a given uri (get them from the list above)</Text>
        </Box>
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
