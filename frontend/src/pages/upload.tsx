import { Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import Upload from '@/components/Upload'

const Home: NextPage = () => {
  return (
    <>
      <NextSeo title="Upload | Web3-Access-Paper" />
      <Heading mb={8}>Upload Files</Heading>

      <Upload />
    </>
  )
}

export default Home
