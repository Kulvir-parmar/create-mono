import path from 'node:path'
import fs from 'fs'

import type { TDependencies } from '../utils/dependencies'
import { addDependencies } from '../utils/add-dependencies'
import { ROOT } from '../CONSTS'

function twInstaller(appDir: string) {
    const devPkg: TDependencies[] = ['tailwindcss', 'autoprefixer', 'postcss']
    addDependencies(devPkg, true, appDir)

    /*
    src
    |  globals.css
    tailwind.configs.ts
    postcss.config.cjs
    */

    const configsDir = path.join(ROOT, 'template/deps/configs')

    fs.copyFileSync(
        path.join(configsDir, 'globals.css'),
        path.join(appDir, 'src/globals.css'),
    )
    fs.copyFileSync(
        path.join(configsDir, 'tailwind.config.ts'),
        path.join(appDir, 'tailwind.config.ts'),
    )
    fs.copyFileSync(
        path.join(configsDir, 'postcss.config.cjs'),
        path.join(appDir, 'postcss.config.cjs'),
    )
}

export { twInstaller }