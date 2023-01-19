export type AccessControl = 'public' | 'private' | 'shared'

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
  files: GroupIPublicFile
}

type GroupIPublicFile = {
  [key:string]: IPublicFile | undefined;
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

export function isPublicFile(object: IPrivateFile | IPublicFile): object is IPublicFile {
  return !(object as IPublicFile).userAddress !== undefined
}
