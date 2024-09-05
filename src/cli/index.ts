import * as p from '@clack/prompts'
import chalk from 'chalk'

import { validateName } from '../utils/validate-name'

async function cli() {
    const userInputs = await p.group(
        {
            repoName: () =>
                p.text({
                    message: 'Name of your project',
                    defaultValue: '.',
                    validate: validateName,
                }),
            pacMan: () => {
                return p.select({
                    message: 'Choose your package manager',
                    options: [
                        { value: 'bun', label: 'Bun' },
                        { value: 'npm', label: 'npm' },
                        { value: 'pnpm', label: 'pnpm' },
                        { value: 'yarn', label: 'yarn' },
                    ],
                    initialValue: 'bun',
                })
            },
            // TODO: add next and astro templates.
            apps: () => {
                return p.multiselect({
                    message:
                        'What applications you want to have in your monorepo?' +
                        chalk.cyan('(space to select)'),
                    options: [
                        {
                            value: 'astro',
                            label: chalk.redBright('Astro app'),
                            hint: 'not available yet',
                        },
                        {
                            value: 'next',
                            label: chalk.redBright('Next App') + '(app router)',
                            hint: 'not available yet',
                        },
                        { value: 'vite', label: 'Vite SPA' },
                        {
                            value: 'hono',
                            label: chalk.redBright('Hono API'),
                            hint: 'not available yet',
                        },
                        { value: 'express', label: 'Express API' },
                    ],
                })
            },
            //TODO: Remove when next and astro template is added
            _: ({ results }) => {
                if (
                    results.apps?.includes('hono') ||
                    results.apps?.includes('next') ||
                    results.apps?.includes('astro')
                ) {
                    p.cancel(
                        chalk.redBright(
                            'This framework is not yet supported, If needed create on your own.',
                        ),
                    )
                    process.exit(0)
                }
            },
            language: () => {
                return p.select({
                    message:
                        'Will you be using Javascript or Typescript in all application?',
                    options: [
                        { value: 'typescript', label: 'Typescript' },
                        {
                            value: 'javascript',
                            label: 'Javascript',
                            hint: 'Skill issues',
                        },
                    ],
                    initialValue: 'typescript',
                })
            },
            __: ({ results }) => {
                if (results.language === 'javascript') {
                    return p.note(
                        chalk.redBright(
                            'Skill issues, you will use only Typescript',
                        ),
                    )
                }
            },
        },
        {
            onCancel() {
                process.exit(0)
            },
        },
    )

    return {
        repoName: userInputs.repoName,
        packageManager: userInputs.pacMan,
        applications: [...userInputs.apps] as string[],
    }
}

export { cli }
