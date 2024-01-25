import fs from 'fs-extra'
import path from 'path'
export default function customBuild() {
  return {
    name: 'custom-build',
    buildStart: function () {
      console.log('*****************Empty Build Folder Start*******************')
      const buildPath = path.join(
        process.cwd().replace('My-Space-client', 'My-Space-server'),
        '/public'
      )
      fs.emptyDirSync(buildPath)
    }
  }
}
