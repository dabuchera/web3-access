import { Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'
import OverviewFiles from '@/components/OverviewFiles'

const Home: NextPage = () => {
  return (
    <>
      <Heading>Overview Files</Heading>
      <OverviewFiles />
    </>
  )
}

export default Home
