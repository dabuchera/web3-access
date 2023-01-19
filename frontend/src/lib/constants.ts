import { AppConfig, AuthOptions } from '@stacks/connect'

export const appConfig = new AppConfig(['store_write', 'publish_data'])

export const appDetails: AuthOptions['appDetails'] = {
  name: 'Web3-Access-Paper Prototype',
  icon: 'https://polybox.ethz.ch/index.php/s/zvO3apkyFKP6w2A/download',
}

export const contractOwnerAddress = 'ST2Q25747F18NBRK958J7YX0DJ1MNF4QEVA9WCZCJ'

export const dasContractName = 'das'

export const microstacksPerSTX = 1_000_000
