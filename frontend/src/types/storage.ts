export type AccessControl = "public" | "private" | "shared"

export type PrivateMetadataFile = {
  files: IPrivateFile[]
}

export type IPrivateFile = {
  path: string
  accessControl: AccessControl
  encrypted: boolean
  isString: boolean
  lastModified: string
  url: string
}

export type PublicMetadataFile = {
  files: IPublicFile[]
}

export type IPublicFile = {
  path: string
  accessControl: AccessControl
  encrypted: boolean
  isString: boolean
  lastModified: string
  url: string
  userAddress: string | undefined
}

export type returnObject = {
  type: string
  value: string
}