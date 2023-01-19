import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, Text, Center, Button, Heading, Link, Icon } from '@chakra-ui/react'
import { useEffect } from 'react'
import { LogIn } from 'react-feather'
import { DefaultSeo } from 'next-seo'
import { theme } from '../theme'
import { useAuth } from '@/hooks/use-auth'
import Header from '@/components/Header'
import SEO from '../../next-seo.config'
import Logo from '@/components/Logo'
import Footer from '@/components/Footer'

function MyApp({ Component, pageProps }: AppProps) {
  const { userSession, setUserData, authenticate, userData } = useAuth()

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData)
      })
    } else if (userSession.isUserSignedIn()) {

      // const tempUserSession = userSession.store.getSessionData()
      // tempUserSession.userData?.gaiaHubConfig.address = 

      console.log(userSession.store.getSessionData())
      // console.log(userSession.store.setSessionData())



      setUserData(userSession.loadUserData())
    }
  }, [userSession, setUserData])

  return (
    <ChakraProvider theme={theme}>
      <Header />
      <DefaultSeo {...SEO} />
      <Center mt={8} flexDir="column" px={{ base: 8, md: 16, lg: 32 }}>
        {userData ? (
          <Component {...pageProps} />
        ) : (
          <>
            <Logo height={128} width={128} />
            <Heading>Web3 Data Access dApp</Heading>
            <Text as="h2" fontSize="xl" textAlign="center" mt={4} mb={16}>
              This prototype developed for our EC3 paper stores your data off-chain using{' '}
              <Link href="https://docs.stacks.co/docs/gaia/" isExternal color="blue.400">
                Gaia
              </Link>
              . Files are private and encrypted by default and can only be decrypted by connecting your wallet. You can also store public files, which
              will be stored in an unencrypted form.
            </Text>

            <Text as="h2" fontSize="xl" textAlign="center" mt={4} mb={16}>
              You can then decide to share your private data, either with a role-based or token-based access mechanism using smart contracts on the{' '}
              <Link href="https://www.stacks.co/" isExternal color="blue.400">
                Stacks Blockchain
              </Link>
              . The protoype runs on the Stacks testnet. You need to request test-STX from the{' '}
              <Link href="https://explorer.stacks.co/sandbox/faucet?chain=testnet" isExternal color="blue.400">
                faucet
              </Link>{' '}
              to pay for the transaction fees.
            </Text>

            <Text fontSize="xl">
              Please connect your Stacks{' '}
              <Link href="https://wallet.hiro.so/" isExternal color="blue.400">
                wallet
              </Link>{' '}
              to continue:
            </Text>
            <Button mt={4} onClick={authenticate} bg="blue.600" color="white" _hover={{ bg: 'blue.500' }} leftIcon={<Icon as={LogIn} />}>
              Connect Wallet
            </Button>
          </>
        )}
      </Center>
      <Footer />
    </ChakraProvider>
  )
}

export default MyApp
