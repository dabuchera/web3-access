import { useAuth } from './use-auth'
import { Storage } from '@stacks/storage'
import { IPrivateFile, IPublicFile, PrivateMetadataFile, PublicMetadataFile } from '@/types/storage'
import { useState } from 'react'
import useLoading from './use-loading'
import { useToast } from '@chakra-ui/react'

const PRIVATE_METADATA_FILE_PATH = '.private/metadata.json'
const PUBLIC_METADATA_FILE_PATH = 'https://api.jsonbin.io/v3/b/639af46101a72b59f231285b?meta=false'

export const useStorage = () => {
  const { userSession, useSTXAddress } = useAuth()
  const [metadata, setMetadata] = useState<PrivateMetadataFile | undefined>()
  const [publicMetadata, setPublicMetadata] = useState<PublicMetadataFile | undefined>()

  const {
    isLoading: isMetadataRefreshing,
    startLoading: startMetadataRefreshingLoading,
    stopLoading: stopMetadataRefreshingLoading,
  } = useLoading()
  const toast = useToast()

  const storage = new Storage({ userSession })

  const refreshMetadata = async () => {
    startMetadataRefreshingLoading()
    try {
      const resMetadata = await getMetadataFile()
      console.log('resMetadata Lenght: ' + Object.keys(resMetadata.files).length)
      console.log(resMetadata)
      setMetadata(resMetadata)

      const resOverview = await getOverviewFile()
      console.log('resOverview Lenght: ' + Object.keys(resOverview.files).length)
      console.log(resOverview)
      setPublicMetadata(resOverview)
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error fetching files',
        description: 'Something went wrong when fetching the files. Please try again later',
        status: 'error',
      })
    }
    stopMetadataRefreshingLoading()
  }

  const saveFile = async (
    path: string,
    data: any,
    isPublic: boolean = false,
    shared: boolean = false,
    isString: boolean = true
  ) => {
    const existingMetadata = await getMetadataFile()
    const existingOverviewMetadata = await getOverviewFile()

    const url = await storage.putFile(path, data, {
      encrypt: !isPublic,
      cipherTextEncoding: 'base64',
      dangerouslyIgnoreEtag: true,
      wasString: isString,
    })

    const currentFileMetadata: IPrivateFile = {
      path,
      isPublic,
      lastModified: new Date().toISOString(),
      url,
      shared,
      isString,
    }

    // Private Metadata
    if (existingMetadata) {
      const newMetadata: PrivateMetadataFile = existingMetadata
      if (existingMetadata.files) {
        newMetadata.files = {
          ...existingMetadata.files,
          [path]: currentFileMetadata,
        }
      }
      await saveMetadataFile(newMetadata)
    } else {
      await saveMetadataFile({
        files: { [path]: currentFileMetadata },
      })
    }

    const userAddress = useSTXAddress()

    const currentPublicMetadata: IPublicFile = {
      userAddress,
      path,
      isPublic,
      lastModified: new Date().toISOString(),
      url,
      shared,
      isString,
    }

    // console.log('Object.keys(existingOverviewMetadata).length')
    // console.log(Object.keys(existingOverviewMetadata).length)

    // Public Metadata -> Overview of all files
    // if (Object.keys(existingOverviewMetadata).length !== 0) {
    if (existingOverviewMetadata) {
      // console.log('existingOverviewMetadata')
      // console.log(existingOverviewMetadata)
      const newOverviewMetadata: PublicMetadataFile = existingOverviewMetadata
      if (existingOverviewMetadata.files) {
        newOverviewMetadata.files = {
          ...existingOverviewMetadata.files,
          [path]: currentPublicMetadata,
        }
      }
      await saveOverviewFile(newOverviewMetadata)
    } else {
      await saveOverviewFile({
        files: { [path]: currentPublicMetadata },
      })
    }

    await refreshMetadata()

    return url
  }

  const getFileWithMeta = async (filename: string) => {
    const fileMeta = await getFileMetadata(filename)
    const res = await storage.getFile(filename, {
      decrypt: !fileMeta.isPublic,
    })

    return { meta: fileMeta, data: res }
  }

  // Get File which belongs to logged in user
  const getFile = async (url: string, doDecrypt: boolean = true) => {
    // Check if File belongs to logged in user
    const userAddress = useSTXAddress()
    const resOverview = await getOverviewFile()
    // console.log('YOURS?')
    // console.log(resOverview?.files)
    // console.log(userAddress === resOverview.files[filename].userAddress)

    var n = url.lastIndexOf('/')
    var filename = url.substring(n + 1)
    // console.log(filename)

    // console.log(doDecrypt)

    //*********************** File belongs to logged in user ***********************//
    if (userAddress === resOverview.files[filename].userAddress) {
      console.log('File belongs to logged in user')
      const res = await storage.getFile(filename, {
        decrypt: doDecrypt,
      })
      // console.log('res')
      // console.log(res)

      // if file is encrypted it means that it is a shared file
      if (typeof res === 'string' || res instanceof String) {
        if (res.includes('cipherText')) {
          return await storage
            .getFile(filename, {
              decrypt: '4e185081062dd819e0f251864817957704f17bb07baef49fa447bbbeb8b143e5',
            })
            .then((res) => {
              if (!res) return null
              // console.log('res')
              // console.log(res)
              return res
            })
        }
      }
      return res
    }
    //*********************** File DOES NOT belongs to logged in user ***********************//
    else {
      console.log('File DOES NOT belongs to logged in user')
      try {
        console.log('url')
        console.log(url)
        return await fetch(url).then((response) => {
          const contentType = response.headers.get('content-type')
          // The response was a JSON object
          // Process your data as a JavaScript object
          if (contentType && contentType.indexOf('application/json') !== -1) {
            return response.json().then((data) => {
              console.log(data)
              const res = JSON.stringify(data)
              // Hier die Decryption machen
              // Check if file is encrypted
              if (typeof res === 'string' || (res as any) instanceof String) {
                if (res.includes('cipherText')) {
                  // console.log(res.includes('cipherText'))
                  return '*******'
                }
              }
              return data
            })
          }
          // The response wasn't a JSON object
          // Process your text as a String
          else {
            return response.text().then((text) => {
              if (typeof text === 'string' || (text as any) instanceof String) {
                if (text.includes('cipherText')) {
                  // console.log(res.includes('cipherText'))
                  return '*******'
                }
              }
              return text
            })
          }
        })

        // return await fetch(url)
        //   .then((response) => {
        //     if (resOverview.files[filename].isPublic) {
        //       return response.text
        //     }
        //     return response.json()
        //   })
        //   .then((data) => {
        //     console.log(data)
        //     const res = JSON.stringify(data)
        //     // Hier die Decryption machen
        //     // Check if file is encrypted
        //     if (typeof res === 'string' || res instanceof String) {
        //       if (res.includes('cipherText')) {
        //         // console.log(res.includes('cipherText'))
        //         return '*******'
        //       }
        //     }
        //     return data
        //   })
      } catch (err) {
        console.error(err)
      }
    }
  }

  // Get File which is usually encrypted
  const getEncryptedFile = async (path: string) => {
    try {
      // console.log(path)
      return await fetch(path)
        .then((response) => response.json())
        .then((data) => {
          return data
        })
    } catch (err) {
      console.error(err)
    }
  }

  const getMetadataFile = async () => {
    // console.log('getMetadataFile')
    try {
      const metadata = await storage.getFile(PRIVATE_METADATA_FILE_PATH, {
        decrypt: true,
      })
      if (!metadata) return null
      return JSON.parse(metadata as string)
    } catch (err) {
      console.error(err)
    }
  }

  const getOverviewFile = async () => {
    // console.log('getOverviewFile')
    try {
      return await fetch(PUBLIC_METADATA_FILE_PATH)
        .then((response) => response.json())
        .then((data) => {
          // return data -> Ohne encryption
          // console.log('getOverviewFile -> data')
          // console.log(JSON.stringify(data))

          // This happens if file is empty -> {}
          if (Object.keys(data).length === 0) {
            return null
          }
          return userSession
            .decryptContent(JSON.stringify(data), {
              privateKey: '4e185081062dd819e0f251864817957704f17bb07baef49fa447bbbeb8b143e5',
            })
            .then((res) => {
              // console.log(res)
              if (!res) return null
              // console.log('res')
              // console.log(res)
              return JSON.parse(res as string)
            })
        })
    } catch (err) {
      console.error(err)
    }
  }

  const getFileMetadata = async (path: string) => {
    const metadata = await getMetadataFile()
    const publicMetadata = await getOverviewFile()
    if (!metadata) {
      return null
    }
    // File of Logged In User
    else if (metadata.files[path]) {
      return metadata.files[path]
    }
    // File of NOT Logged In User
    else {
      return publicMetadata.files[path]
    }
  }

  const saveMetadataFile = async (metadata: any) => {
    await storage.putFile(PRIVATE_METADATA_FILE_PATH, JSON.stringify(metadata), {
      encrypt: true,
      dangerouslyIgnoreEtag: true,
      wasString: true,
    })
  }

  // Store Overview File
  const saveOverviewFile = async (metadata: any) => {
    // console.log('saveOverviewFile')
    // console.log(JSON.stringify(metadata))
    const encrypted = await userSession.encryptContent(JSON.stringify(metadata), {
      privateKey: '4e185081062dd819e0f251864817957704f17bb07baef49fa447bbbeb8b143e5',
    })

    // console.log('encrypted')
    // console.log(encrypted)

    try {
      return await fetch(PUBLIC_METADATA_FILE_PATH, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'X-Master-Key': '$2b$10$OFwARP0y9m.ePAhdbHInQO7/1Hm653WR4C7qVDSzrBmgle/Qdepqq',
          'X-Bin-Versioning': 'false',
        },
        // body: JSON.stringify(metadata),
        body: encrypted,
      })
        .then((response) => {
          response.json()
        })
        .then((data) => {
          console.log('Success:', data)
        })
    } catch (err) {
      console.error(err)
    }
  }

  const deleteFile = async (path: string) => {
    const existingMetadata = await getMetadataFile()
    const existingOverviewMetadata = await getOverviewFile()

    // Private Metadata
    const newMetadata: PrivateMetadataFile = {
      ...existingMetadata,
      files: { ...existingMetadata.files, [path]: undefined },
    }

    await saveMetadataFile(newMetadata)

    await storage.deleteFile(path)

    // Public Metadata -> Overview of all files
    const newOverviewMetadata: PublicMetadataFile = {
      ...existingOverviewMetadata,
      files: { ...existingOverviewMetadata.files, [path]: undefined },
    }

    await saveOverviewFile(newOverviewMetadata)

    await refreshMetadata()
  }

  const toggleshareFile = async (path: string) => {
    const existingMetadata = await getMetadataFile()
    const existingOverviewMetadata = await getOverviewFile()

    const file = existingMetadata.files[path]
    // console.log(file)

    const data = await getFile(path, !file.isPublic)
    // console.log(data)

    //Allow sharing
    if (!file.shared) {
      // Delete Private Metadata
      const newMetadata: PrivateMetadataFile = {
        ...existingMetadata,
        files: { ...existingMetadata.files, [path]: undefined },
      }

      await saveMetadataFile(newMetadata)

      await storage.deleteFile(path)

      // Delete Public Metadata
      const newOverviewMetadata: PublicMetadataFile = {
        ...existingOverviewMetadata,
        files: { ...existingOverviewMetadata.files, [path]: undefined },
      }

      await saveOverviewFile(newOverviewMetadata)

      await refreshMetadata()

      let input

      // Could be a string or file
      // String not stringify
      if (typeof data === 'string' || data instanceof String) {
        input = data as any
      } else {
        input = JSON.stringify(data)
      }

      const encryptedData = await userSession.encryptContent(input, {
        privateKey: '4e185081062dd819e0f251864817957704f17bb07baef49fa447bbbeb8b143e5',
      })

      await saveFile(path, encryptedData, true, true, file.dataType)
    }
    // Revoke sharing
    else {
      // console.log('Revoke sharing')
      // Delete Private Metadata
      const newMetadata: PrivateMetadataFile = {
        ...existingMetadata,
        files: { ...existingMetadata.files, [path]: undefined },
      }

      console.log(newMetadata)

      await saveMetadataFile(newMetadata)

      await storage.deleteFile(path)

      // Delete Public Metadata
      const newOverviewMetadata: PublicMetadataFile = {
        ...existingOverviewMetadata,
        files: { ...existingOverviewMetadata.files, [path]: undefined },
      }

      await saveOverviewFile(newOverviewMetadata)

      await refreshMetadata()

      await saveFile(path, data, false, false, file.dataType)
    }
  }

  const deleteAllFiles = async () => {
    const paths: string[] = []
    await storage.listFiles((path) => {
      paths.push(path)
      return true
    })

    for (const path of paths) {
      await storage.deleteFile(path)
      console.log(`delete ${path}`)
    }
  }

  const deletePublicFile = async () => {
    try {
      return await fetch(PUBLIC_METADATA_FILE_PATH, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'X-Master-Key': '$2b$10$OFwARP0y9m.ePAhdbHInQO7/1Hm653WR4C7qVDSzrBmgle/Qdepqq',
          'X-Bin-Versioning': 'false',
        },
        // body: JSON.stringify(metadata),
        body: '',
      }).then((response) => {
        console.log('response: ' + JSON.stringify(response))
        return response.json()
      })
    } catch (err) {
      console.error(err)
    }
  }

  const test = async () => {
    // const str =
    //   '{"iv":"1ba3577147464b7fe41bf4194b1b2ee1","ephemeralPK":"037d3cda2139aca911d02259be49e3343d6708bfa42d08fb9f75784d946bbdcc71","cipherText":"dfd5fa916f976f515b4485e3019133b9","mac":"ef1fd15eaaf24b4de7408bf3b229ad0aa04f00de346908dc6b994772e3bb5200","wasString":true}'
    // await userSession.decryptContent(str).then((res) => {
    //   console.log('res')
    //   console.log(res)
    // })

    console.log('metadata')
    console.log(metadata)

    console.log('publicMetadata')
    console.log(publicMetadata)
  }

  return {
    storage,
    saveFile,
    getFile,
    getOverviewFile,
    // getEncryptedFile,
    getFileWithMeta,
    getMetadataFile,
    getFileMetadata,
    saveMetadataFile,
    toggleshareFile,
    deleteFile,
    deleteAllFiles,
    deletePublicFile,
    metadata,
    publicMetadata,
    refreshMetadata,
    isMetadataRefreshing,
    test,
  }
}
