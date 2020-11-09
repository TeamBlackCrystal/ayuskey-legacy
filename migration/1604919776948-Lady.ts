import {MigrationInterface, QueryRunner} from "typeorm";

export class Lady1604919776948 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD IF NOT EXISTS "isLady" boolean NOT NULL DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isLady"`, undefined);
    }

}
