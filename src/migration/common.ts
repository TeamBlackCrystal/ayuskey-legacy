import Logger from "@/services/logger";
import type { Connection, EntityTarget, FindManyOptions } from "typeorm";

export function createPagination<Entity>(originalDb: Connection, entity: EntityTarget<Entity>, options?: FindManyOptions<EntityTarget<Entity>>) {
    const repository = originalDb.getRepository(entity)
    let skip = 0
    const take = 100
    async function next() {
        const result = (await repository.find({ ...options, take: 100, skip }));
        skip = skip + take;
        return result
    }
    return { next }
}

export const logger = new Logger('MigrateAyuskeyNext')
