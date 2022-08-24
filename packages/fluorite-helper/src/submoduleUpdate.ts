import { $, cd } from "zx";

cd('../..')

await $`git submodule update --init --recursive`
