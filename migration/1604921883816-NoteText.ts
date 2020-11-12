import {MigrationInterface, QueryRunner} from "typeorm";

export class NoteText1604921883816 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" ADD IF NOT EXISTS "text" character varying(10240)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" ADD "text" character varying(8192)`);
    }

}
