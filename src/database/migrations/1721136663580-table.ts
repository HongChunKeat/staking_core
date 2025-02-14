import { MigrationInterface, QueryRunner } from "typeorm";

export class Table1721136663580 implements MigrationInterface {
    name = 'Table1721136663580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reward_record" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "amount" numeric(30,8) NOT NULL, CONSTRAINT "PK_14c183bc814ae3c3b24f2595576" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "setting_blockchain" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying, "group" character varying, "chain_id" bigint NOT NULL, "rpc_url" character varying, CONSTRAINT "PK_50c3077ced5fc6cb65e84cb4670" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "setting_stake" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying, "contract_address" character varying, "signer_address" character varying, "private_key" character varying, "blockchain_id" uuid NOT NULL, "is_active" boolean NOT NULL, "latest_block" bigint NOT NULL, CONSTRAINT "PK_e688a71aaf675be9478465b0603" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_stake" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "cutoff_at" TIMESTAMP, "unstake_at" TIMESTAMP, "user_id" uuid NOT NULL, "contract_id" uuid NOT NULL, "stake_txid" character varying, "unstake_txid" character varying, "amount" numeric(30,8) NOT NULL, CONSTRAINT "PK_e04e7e8f07dba97f5863e802c55" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('USER', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "web3_address" character varying, "nickname" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT 'USER', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reward_record" ADD CONSTRAINT "FK_c7319895c615ea112403282b0b8" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "setting_stake" ADD CONSTRAINT "FK_25136078d75c6008a8640de1c14" FOREIGN KEY ("blockchain_id") REFERENCES "setting_blockchain"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_stake" ADD CONSTRAINT "FK_4685b62e3fca2b6e1b5f70d8027" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_stake" ADD CONSTRAINT "FK_f94f42c141742529ab508b8e0dc" FOREIGN KEY ("contract_id") REFERENCES "setting_stake"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`INSERT INTO "user" ("web3_address", "role") VALUES ('0xBdc76521b93cbF4E1dEf17a8d17a7767A3B85C4c', 'ADMIN'),('0x9693CD9713496b0712f52E5F0c7b8948abdA824D', 'USER')`);
        await queryRunner.query(`INSERT INTO "setting_blockchain" ("id", "name", "group", "chain_id", "rpc_url") VALUES ('2b113c51-f53c-45d5-9519-e779dd439ae9', 'BSC Testnet', 'bsc', 97, 'https://endpoints.omniatech.io/v1/bsc/testnet/public')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_stake" DROP CONSTRAINT "FK_f94f42c141742529ab508b8e0dc"`);
        await queryRunner.query(`ALTER TABLE "user_stake" DROP CONSTRAINT "FK_4685b62e3fca2b6e1b5f70d8027"`);
        await queryRunner.query(`ALTER TABLE "setting_stake" DROP CONSTRAINT "FK_25136078d75c6008a8640de1c14"`);
        await queryRunner.query(`ALTER TABLE "reward_record" DROP CONSTRAINT "FK_c7319895c615ea112403282b0b8"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "user_stake"`);
        await queryRunner.query(`DROP TABLE "setting_stake"`);
        await queryRunner.query(`DROP TABLE "setting_blockchain"`);
        await queryRunner.query(`DROP TABLE "reward_record"`);
    }

}
