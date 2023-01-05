import { useStorage } from '@/hooks/use-storage'
import { Link, VStack, Text, Button } from '@chakra-ui/react'

const Footer = () => (
  <VStack as="footer" alignItems="center" justify="center" spacing={4} mt={10}>
    <Text>
      The code and further documentation is available on GitHub,{' '}
      <Link href="https://github.com/dabuchera/web3-access" isExternal color="blue.400">
        dabuchera
      </Link>
    </Text>
  </VStack>
)

export default Footer
