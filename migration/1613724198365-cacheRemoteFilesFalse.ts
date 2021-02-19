import {MigrationInterface, QueryRunner} from "typeorm";

export class cacheRemoteFilesFalse1613724198365 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "cacheRemoteFiles" SET DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "cacheRemoteFiles" SET DEFAULT true`, undefined);
    }

}
