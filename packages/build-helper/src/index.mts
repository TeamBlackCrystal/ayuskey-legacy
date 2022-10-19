import { rmSync } from 'node:fs';
import { $, cd, chalk, echo, os, quotePowerShell, which } from 'zx';
import { spinner } from 'zx/experimental'

function removeBuilt(name = 'built/') {
	rmSync(name, { recursive: true, force: true })
}

if (os.platform() === 'win32') {
	echo(chalk.bold.yellow('I: win32 mode'))
	$.shell = which.sync('pwsh.exe')
	$.quote = quotePowerShell
	$.prefix = ''
}

echo(chalk.bold.blueBright('Build @ayskey/shared'))
cd('../shared')
await spinner('running pnpm...', () => $`pnpm i`.quiet())
await spinner('remove built dir...', () => removeBuilt())
await $`pnpm build`.nothrow()

echo(chalk.bold.blueBright('Build @ayskey/models'))
cd('../models')
await spinner('remove built dir...', () => removeBuilt())
await spinner('running pnpm...', () => $`pnpm i`.quiet())
await $`pnpm build`.nothrow()

//TODO: いい感じの条件分岐
if(true) {
	echo(chalk.bold.blueBright('Build ayskey'))
	cd('../..')
	await spinner('remove built-dts dir...', () => removeBuilt('built-dts'))
	await spinner('running pnpm...', () => $`pnpm i`.quiet())
	await spinner('build ayuskey...', () => $`pnpm build`.quiet())
	await spinner('generate d.ts...', () => $`pnpm build:dev`.quiet())

	echo(chalk.bold.blueBright('Build @ayskey/next-api'))
	cd('packages/next-api')
	await spinner('remove built dir...', () => removeBuilt())
	await spinner('running pnpm...', () => $`pnpm i`.quiet())
	await $`pnpm build`.nothrow()
}
