import { KoaAdapter } from "@bull-board/koa";
import * as Router from "@koa/router";
import * as Koa from "koa";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter.js";
import { queues } from "./jobqueue";

async function main() {
    const app = new Koa();
	const router = new Router();
	const serverAdapter = new KoaAdapter();

    createBullBoard({
		queues: queues.map((q) => new BullAdapter(q)),
		// @ts-ignore
		serverAdapter,
	});

    serverAdapter.setBasePath("/ui");
	await app.use(serverAdapter.registerPlugin());
	app.use(router.routes()).use(router.allowedMethods());
    await app.listen(3000, () => {

		console.log(`Worker ${process.pid} is listening on port 3000`);
	});

}

main().catch((e) => {
	console.warn(e);
	process.exit(1);
});
