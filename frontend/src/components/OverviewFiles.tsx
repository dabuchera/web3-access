import { Spinner, Grid, Button, Spacer, Center, Text, Code, Link, Flex, Icon } from '@chakra-ui/react'
import { useEffect } from 'react'
import OverviewFile from '@/components/OverviewFile'
import { IPublicFile, PublicMetadataFile } from '@/types/storage'
import { useStorage } from '@/hooks/use-storage'
import { RefreshCcw } from 'react-feather'
import NextLink from 'next/link'

const OverviewFiles = () => {
  const { refreshMetadata, publicMetadata, isMetadataRefreshing } = useStorage()

  useEffect(() => {
    const fetchFiles = async () => {
      await refreshMetadata()
    }

    fetchFiles()
  }, [])

  return (
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
        <Grid templateColumns="repeat(auto-fit, minmax(400px, 1fr))" gap={6} w="100%">
          {publicMetadata && Object.keys(publicMetadata.files).length > 0 ? (
            Object.keys(publicMetadata.files).map((path) => {
              const { accessControl, encrypted, isString, lastModified, url, userAddress }: IPublicFile = publicMetadata
                ?.files[path as keyof PublicMetadataFile['files']] as IPublicFile
              return (
                <OverviewFile
                  key={path}
                  path={path}
                  accessControl={accessControl}
                  encrypted={encrypted}
                  isString={isString}
                  lastModified={lastModified}
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
  )
}

export default OverviewFiles
