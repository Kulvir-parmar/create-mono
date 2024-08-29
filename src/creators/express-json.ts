import fs from 'fs'
import fse from 'fs-extra'
import path from 'node:path'

import { ROOT } from '../CONSTS'

function expressJSON(projectDir: string, packageManager: string) {
    fse.copySync(
        path.join(ROOT, 'template/applications/express'),
        path.join(projectDir, 'apps/express'),
    )

    const pkgJSON = fse.readJSONSync(
        path.join(projectDir, 'apps/express/package.json'),
    )

    // `node run dist/index.js` for other than bun.
    if (packageManager !== 'bun') {
        pkgJSON.scripts.start = 'node dist/index.js'
        pkgJSON.scripts.dev = 'tsup --watch --onSuccess "node dist/index.js"'

        // pnpm workspaces fucks everytime
        if (packageManager === 'pnpm') {
            pkgJSON.devDependencies['@repo/eslint-config'] = 'workspace:*'
            pkgJSON.devDependencies['@repo/typescript-config'] = 'workspace:*'
        }

        // add "@types/node"
        pkgJSON.devDependencies['@types/node'] = '^22.5.1'
    } else {
        // add "@types/bun"
        pkgJSON.devDependencies['@types/bun'] = '^1.1.26'
    }
    fse.writeJsonSync(
        path.join(projectDir, 'apps/express/package.json'),
        pkgJSON,
        {
            spaces: 4,
        },
    )

    fs.copyFileSync(
        path.join(ROOT, 'template/config/eslint/server.js'),
        path.join(projectDir, 'packages/eslint-config/server.js'),
    )
}

export { expressJSON }