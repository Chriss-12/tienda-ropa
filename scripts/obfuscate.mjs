import { createHash } from 'node:crypto'
import { readdir, readFile, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { obfuscate } from 'js-confuser'

const assetsDirectory = join(process.cwd(), 'dist', 'assets')
const assetFiles = await readdir(assetsDirectory)
const javascriptFiles = assetFiles.filter((file) => file.endsWith('.js'))

if (javascriptFiles.length === 0) {
  throw new Error('No se encontraron archivos JavaScript en dist/assets. Ejecuta primero pnpm build.')
}

const renamedAssets = new Map()

for (const file of javascriptFiles) {
  const filePath = join(assetsDirectory, file)
  const source = await readFile(filePath, 'utf8')
  const result = await obfuscate(source, {
    target: 'browser',
    preset: false,
    compact: true,
    minify: false,
    renameVariables: true,
    renameGlobals: false,
    stringConcealing: true,
    controlFlowFlattening: false,
    dispatcher: false,
    calculator: false,
    deadCode: false,
    rgf: false,
  })

  const contentHash = createHash('sha256').update(result.code).digest('hex').slice(0, 8)
  const assetBase = file.replace(/-[^-]+\.js$/, '').replace(/\.js$/, '')
  const outputFile = `${assetBase}-${contentHash}.js`
  const outputPath = join(assetsDirectory, outputFile)

  await writeFile(filePath, result.code, 'utf8')
  if (outputFile !== file) {
    await rename(filePath, outputPath)
    renamedAssets.set(file, outputFile)
  }
  console.log(`Ofuscado: ${outputFile}`)
}

if (renamedAssets.size > 0) {
  const distFiles = await readdir(join(process.cwd(), 'dist'), { recursive: true })

  for (const relativePath of distFiles) {
    if (!/\.(html|js|css)$/.test(relativePath)) continue
    const filePath = join(process.cwd(), 'dist', relativePath)
    let content = await readFile(filePath, 'utf8')

    for (const [oldName, newName] of renamedAssets) {
      content = content.replaceAll(oldName, newName)
    }

    await writeFile(filePath, content, 'utf8')
  }
}
