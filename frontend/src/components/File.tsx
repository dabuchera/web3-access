import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogBody,
  Button,
  Flex,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Tooltip,
  useDisclosure,
  AlertDialogFooter,
  AlertDialogOverlay,
  AlertDialogContent,
  Box,
  useToast,
  Icon,
  HStack,
  LinkBox,
  LinkOverlay,
  useClipboard,
  Badge,
} from '@chakra-ui/react'
import { MutableRefObject, useRef } from 'react'
import { format } from 'date-fns'
import { Type, FileText, Share2, Trash2, Copy, Check } from 'react-feather'
import NextLink from 'next/link'
import useLoading from '@/hooks/use-loading'
import { useStorage } from '@/hooks/use-storage'

interface IFileProps {
  path: string
  isPublic: boolean
  isString: boolean
  lastModified: string
  shared: boolean
  url: string
}

const File = ({ path, isPublic, isString, lastModified, shared, url }: IFileProps) => {
  const { toggleshareFile, deleteFile } = useStorage()
  const toast = useToast()

  const { isLoading: isLoading, startLoading: startLoading, stopLoading: stopLoading } = useLoading()

  const {
    isOpen: isShareAlertDialogOpen,
    onOpen: onShareAlertDialogOpen,
    onClose: onShareAlertDialogClose,
  } = useDisclosure()

  const shareDialogCancelRef = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>

  const handleShareFile = async (path: string) => {
    startLoading()
    try {
      await toggleshareFile(path)
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error deleting file',
        description: 'Something went wrong. Please try again later',
        status: 'error',
      })
    }
    stopLoading()
    onShareAlertDialogClose()
  }

  const {
    isOpen: isDeleteAlertDialogOpen,
    onOpen: onDeleteAlertDialogOpen,
    onClose: onDeleteAlertDialogClose,
  } = useDisclosure()

  const deleteDialogCancelRef = useRef<HTMLButtonElement>() as MutableRefObject<HTMLButtonElement>

  const { onCopy: onCopyGaiaUrl, hasCopied: hasCopiedGaiaUrl } = useClipboard(url)

  const handleDeleteFile = async (path: string) => {
    startLoading()
    try {
      await deleteFile(path)
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error deleting file',
        description: 'Something went wrong. Please try again later',
        status: 'error',
      })
    }
    stopLoading()
    onDeleteAlertDialogClose()
  }

  return (
    <LinkBox
      as={Flex}
      bg="whiteAlpha.200"
      p={4}
      rounded="lg"
      flexDirection="column"
      experimental_spaceY={4}
      border="1px"
      borderColor="brand.secondary"
      transition="all 0.2s ease-in-out"
      _hover={{ borderColor: 'white' }}
    >
      <HStack spacing={2} alignItems="center">
        {isString ? (
          <Tooltip label="Text">
            <Icon as={Type} aria-label="Text" h={5} w={5} />
          </Tooltip>
        ) : (
          <Tooltip label="File">
            <Icon as={FileText} aria-label="File" h={5} w={5} />
          </Tooltip>
        )}
        <NextLink href={`/object/${path}`} passHref>
          <LinkOverlay fontWeight="bold" fontSize="lg">
            {path}
          </LinkOverlay>
        </NextLink>
        {isPublic ? (
          shared ? (
            <Badge colorScheme="orange">Shared</Badge>
          ) : (
            <Badge colorScheme="green">Public</Badge>
          )
        ) : (
          <Badge colorScheme="red">Private</Badge>
        )}
      </HStack>
      <Box>
        <Tooltip label={format(new Date(lastModified), 'PPPPpppp')}>
          <Text width="fit-content">Last modified: {format(new Date(lastModified), 'PPP')}</Text>
        </Tooltip>
      </Box>

      <Flex experimental_spaceX={4}>
        {isPublic && !shared ? (
          <></>
        ) : (
          <Box>
            <Button
              leftIcon={<Icon as={Share2} />}
              colorScheme="blue"
              bg="blue.400"
              size="sm"
              onClick={onShareAlertDialogOpen}
            >
              {!shared ? 'Allow Sharing' : 'Revoke Sharing'}
            </Button>

            <AlertDialog
              isOpen={isShareAlertDialogOpen}
              onClose={onShareAlertDialogClose}
              leastDestructiveRef={shareDialogCancelRef}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader>Share File</AlertDialogHeader>
                  <AlertDialogBody>
                    Are you sure you want to share this file? This operation cannot be undone.
                  </AlertDialogBody>
                  <AlertDialogFooter as={Flex} experimental_spaceX={4}>
                    <Button onClick={onShareAlertDialogClose} ref={shareDialogCancelRef}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="blue"
                      bg="blue.400"
                      onClick={async () => await handleShareFile(path)}
                      isLoading={isLoading}
                    >
                      {!shared ? 'Allow Sharing' : 'Revoke Sharing'}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Box>
        )}
        {/* Delete Button and Modal */}
        <Box>
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
        </Box>
      </Flex>
      {/* Copy Gaia URL */}
      <Flex experimental_spaceX={4}>
        {isPublic ? (
          <Button
            backgroundColor={hasCopiedGaiaUrl ? 'green.400' : 'cyan.400'}
            colorScheme={hasCopiedGaiaUrl ? 'green' : 'cyan'}
            leftIcon={hasCopiedGaiaUrl ? <Icon as={Check} /> : <Icon as={Copy} />}
            size="sm"
            onClick={onCopyGaiaUrl}
          >
            Copy Gaia URL
          </Button>
        ) : (
          <Popover trigger="click">
            <PopoverTrigger>
              <Button colorScheme="cyan" backgroundColor="cyan.400" leftIcon={<Icon as={Copy} />} size="sm">
                Copy Gaia URL
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Private File</PopoverHeader>
              <PopoverBody>
                <Text>
                  This is a private file. You can go to the Gaia URL but you will only be able to see the encrypted content
                </Text>
                <Button
                  leftIcon={hasCopiedGaiaUrl ? <Icon as={Check} /> : <Icon as={Copy} />}
                  size="sm"
                  mt={2}
                  backgroundColor={hasCopiedGaiaUrl ? 'green.400' : 'cyan.400'}
                  colorScheme={hasCopiedGaiaUrl ? 'green' : 'cyan'}
                  onClick={onCopyGaiaUrl}
                >
                  Copy private Gaia URL
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
      </Flex>
    </LinkBox>
  )
}

export default File
