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
  useToast,
} from '@chakra-ui/react'
import { Type, FileText, Copy, Check, Download } from 'react-feather'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { NextSeo } from 'next-seo'
import useLoading from '@/hooks/use-loading'
import { IPrivateFile, IPublicFile } from '@/types/storage'
import { useAuth } from '@/hooks/use-auth'

const ObjectPage: NextPage = () => {
  const {
    query: { path },
  } = useRouter()
  const { getFile, getFileMetadata, listDataAccessors } = useStorage()
  const { useSTXAddress } = useAuth()

  const [metadata, setMetadata] = useState<IPrivateFile | IPublicFile>()
  const [text, setText] = useState<string>('')
  const { onCopy: onTextCopy, hasCopied: hasCopiedText } = useClipboard(text)
  const { isLoading: isDownloading, startLoading: startDownloadLoading, stopLoading: stopDownloadLoading } = useLoading()

  const toast = useToast()

  const handleFileDownload = async () => {
    startDownloadLoading()
    if (metadata) {
      const dataAccessors = new Array()
      const userAddress = useSTXAddress()
      const temp = await listDataAccessors(metadata.url)
      temp.forEach((element) => {
        dataAccessors.push(element.value)
      })
      // If current User does not have Smart Contract Permission -> Toast
      // metadata is of type IPublicFile
      if (metadata.hasOwnProperty('userAddress')) {
        // @ts-ignore
        if (
          !dataAccessors.includes(userAddress) &&
          //@ts-ignore
          metadata.userAddress !== userAddress &&
          metadata.accessControl === 'shared'
        ) {
          toast({
            status: 'error',
            title: 'Missing Permission',
            description: 'You do not have the permission to download this file',
          })
          stopDownloadLoading()
          return null
          //@ts-ignore
        } else if (metadata.userAddress !== userAddress && metadata.accessControl === 'private') {
          toast({
            status: 'error',
            title: 'Missing Permission',
            description: 'You do not have the permission to download this file',
          })
          stopDownloadLoading()
          return null
        }
      }

      const data = await getFile(metadata.url, metadata.encrypted)

      const blob = new Blob([data as ArrayBuffer], {
        type: 'application/octet-stream',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = metadata.path
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    stopDownloadLoading()
  }

  useEffect(() => {
    const fetchFile = async () => {
      if (path) {
        const pathParsed = (path as string).trim()
        const metadata = await getFileMetadata(pathParsed)

        if (metadata) {
          setMetadata(metadata)
        }
        // Whether the correct data is displayed or not is checked in the use-storage.ts
        if (metadata.isString) {
          const data = await getFile(metadata.url, metadata.encrypted)
          // console.log(data)
          setText(data as string)
        }
      }
    }

    fetchFile()
  }, [path])

  return (
    <>
      <NextSeo title={`${path} | Web3-Access-Paper`} />
      {metadata ? (
        <Box>
          <VStack spacing={4}>
            <Box>
              {metadata.isString ? (
                <Tooltip label="Text">
                  <Icon as={Type} aria-label="Text" h={8} w={8} />
                </Tooltip>
              ) : (
                <Tooltip label="File">
                  <Icon as={FileText} aria-label="File" h={8} w={8} />
                </Tooltip>
              )}
            </Box>
            <Heading as="h2" fontSize="2xl">
              {metadata.path}
            </Heading>
            {
              {
                public: <Badge colorScheme="green">Public</Badge>,
                private: <Badge colorScheme="red">Private</Badge>,
                shared: <Badge colorScheme="orange">Shared</Badge>,
              }[metadata.accessControl]
            }
            {/* {metadata.isPublic ? (
              metadata.shared ? (
                <Badge colorScheme="orange">Shared</Badge>
              ) : (
                <Badge colorScheme="green">Public</Badge>
              )
            ) : (
              <Badge colorScheme="red">Private</Badge>
            )} */}
            {metadata.isString ? (
              text ? (
                <VStack>
                  <Text bg="brand.primary" p={4} rounded="md">
                    {text}
                  </Text>
                  <IconButton
                    icon={hasCopiedText ? <Icon as={Check} /> : <Icon as={Copy} />}
                    aria-label="Copy Text"
                    onClick={onTextCopy}
                    colorScheme={hasCopiedText ? 'green' : 'gray'}
                  />
                </VStack>
              ) : (
                <Spinner />
              )
            ) : (
              <Button leftIcon={<Icon as={Download} />} onClick={handleFileDownload} isLoading={isDownloading}>
                Download
              </Button>
            )}
          </VStack>
        </Box>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export default ObjectPage
function toast(arg0: { status: string; title: string; description: string }) {
  throw new Error('Function not implemented.')
}
