import { AppConfig, AuthOptions } from '@stacks/connect'

export const appConfig = new AppConfig(['store_write', 'publish_data'])

export const appDetails: AuthOptions['appDetails'] = {
  name: 'Web3-Access-Paper Prototype',
  icon: 'https://polybox.ethz.ch/index.php/s/zvO3apkyFKP6w2A/download',
}

export const contractOwnerAddress = 'STN5A1RKHA2C2WH033G82SR2MSR8BGY3W1XTJ5W5'

export const dasContractName = 'das'

export const microstacksPerSTX = 1_000_000
