import {MigrationInterface, QueryRunner} from "typeorm";

export class NoteText1604921883816 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
				await queryRunner.query(`ALTER TABLE "note" ALTER COLUMN "text" TYPE character varying(10240)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
				await queryRunner.query(`ALTER TABLE "note" ALTER COLUMN "text" TYPE character varying(8192)`, undefined);
    }

}
