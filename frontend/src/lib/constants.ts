import { AppConfig, AuthOptions } from '@stacks/connect'

export const appConfig = new AppConfig(['store_write', 'publish_data'])

export const appDetails: AuthOptions['appDetails'] = {
  name: 'Web3-Access-Paper Prototype',
  icon: 'TBF',
}

export const contractOwnerAddress = 'ST3QAYFPQJX93Z2JANY2602C2NK8ZGG0MREAMM0DH'

export const dasContractAddress = 'ST3QAYFPQJX93Z2JANY2602C2NK8ZGG0MREAMM0DH'

export const dasContractName = 'das'

export const microstacksPerSTX = 1_000_000
