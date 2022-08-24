import { load as yamlLoad } from 'js-yaml';
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { $, cd, echo, YAML } from 'zx'
import { Source } from './configTypes.js';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

const dir = `${_dirname}/../../../.config`

const config = dir + '/default.yml'
//await $`pwd`
//await $`ls ${dir}`

const yml = yamlLoad(readFileSync(config, 'utf-8')) as Source;

cd('../ayuskey-fluorite')

await Promise.all([
	$`echo "VITE_FRONT_DOMAIN = ${yml.url}"`,
	$`echo "VITE_INSTANCE_DOMAIN = ${yml.url}"`,
	$`echo "VITE_PRODUCTION = true"`,
])
