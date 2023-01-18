import { Flex, Text, Tooltip, Box, Icon, HStack, LinkBox, LinkOverlay, Badge } from '@chakra-ui/react'
import { format } from 'date-fns'
import { Type, FileText } from 'react-feather'
import NextLink from 'next/link'
import truncateMiddle from '@/lib/truncate'
import { useAuth } from '@/hooks/use-auth'
import { AccessControl } from '@/types/storage'

interface IOverviewFileProps {
  path: string
  accessControl: AccessControl
  encrypted: boolean
  isString: boolean
  lastModified: string
  url: string
  userAddress: string | undefined
}

const OverviewFile = ({ path, accessControl, encrypted, isString, lastModified, url, userAddress }: IOverviewFileProps) => {
  const { useSTXAddress } = useAuth()

  return (
    <LinkBox
      as={Flex}
      bg={useSTXAddress() === userAddress ? 'whiteAlpha.200' : 'whiteAlpha.500'}
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
        {
          {
            public: <Badge colorScheme="green">Public</Badge>,
            private: <Badge colorScheme="red">Private</Badge>,
            shared: <Badge colorScheme="orange">Shared</Badge>,
          }[accessControl]
        }
        {useSTXAddress() === userAddress ? <Badge colorScheme="blue">Yours</Badge> : <></>}
        {/* {isPublic ? <Badge colorScheme="green">Public</Badge> : <Badge colorScheme="red">Private</Badge>} */}
      </HStack>
      <Box>
        <Tooltip label={format(new Date(lastModified), 'PPPPpppp')}>
          <Text width="fit-content">Last modified: {format(new Date(lastModified), 'PPP')}</Text>
        </Tooltip>
      </Box>
      <Box>
        <Tooltip label={userAddress}>
          <Text width="fit-content">User: {truncateMiddle(userAddress)}</Text>
        </Tooltip>
      </Box>
    </LinkBox>
  )
}

export default OverviewFile
