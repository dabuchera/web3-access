import { AppConfig, AuthOptions } from '@stacks/connect'

export const appConfig = new AppConfig(['store_write', 'publish_data'])

export const appDetails: AuthOptions['appDetails'] = {
  name: 'Web3-Access-Paper Prototype',
  icon: 'TBF',
}

export const contractOwnerAddress = 'ST1HVZ0NQ050J2674MA0B9E5T65QY4J1XT5JGE1FB'

// export const dasContractAddress = 'ST3QAYFPQJX93Z2JANY2602C2NK8ZGG0MREAMM0DH'

export const dasContractName = 'das'

export const microstacksPerSTX = 1_000_000
