import {MigrationInterface, QueryRunner} from "typeorm";

export class turnstile1664548052072 implements MigrationInterface {
    name = 'turnstile1664548052072'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "meta" ADD "enableTurnstile" boolean NOT NULL DEFAULT false`);
      await queryRunner.query(`ALTER TABLE "meta" ADD "turnstileSiteKey" character varying(64)`);
      await queryRunner.query(`ALTER TABLE "meta" ADD "turnstileSecretKey" character varying(64)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "turnstileSecretKey"`);
			await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "turnstileSiteKey"`);
			await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "enableTurnstile"`);
    }

}
