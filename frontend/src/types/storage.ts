export type PrivateMetadataFile = {
  files: IPrivateFile[]
}

export type IPrivateFile = {
  path: string
  isPublic: boolean
  isString: boolean
  lastModified: string
  shared: boolean
  url: string
}

export type PublicMetadataFile = {
  files: IPublicFile[]
}

export type IPublicFile = {
  path: string
  isPublic: boolean
  isString: boolean
  lastModified: string
  shared: boolean
  url: string
  userAddress: string | undefined
}
