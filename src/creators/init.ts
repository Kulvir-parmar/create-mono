import path from 'path'
import fse from 'fs-extra'

import { ROOT } from '@/CONSTS'
import { baseSetup } from './base-setup'
import { express } from './express'
import { vite } from './vite'
import { addDatabase } from './database'

import type {
    TApplication,
    TDatabase,
    TOrm,
    TPackageManager,
} from '@/cli/index'

async function init(
    projectName: string,
    packageManager: TPackageManager,
    applications: TApplication[],
    orm: TOrm,
    database: TDatabase
) {
    const projectDir = path.resolve(process.cwd(), projectName)

    await baseSetup(projectName, projectDir)

    // pnpm got weird workspaces setup
    if (packageManager === 'pnpm') {
        const packageJSON = fse.readJSONSync(
            path.resolve(projectDir, 'package.json')
        )
        delete packageJSON['workspaces']
        fse.writeJsonSync(path.join(projectDir, 'package.json'), packageJSON, {
            spaces: 4,
        })

        fse.copyFileSync(
            path.join(ROOT, 'template/pnpm-workspace.yaml'),
            path.join(projectDir, 'pnpm-workspace.yaml')
        )
    }

    if (applications.includes('vite')) {
        vite(projectDir, packageManager)
    }

    if (applications.includes('express')) {
        express(projectDir, packageManager)
    }

    orm !== 'none' && addDatabase(projectDir, packageManager, orm, database)
}

export { init }
