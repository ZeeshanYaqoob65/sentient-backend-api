import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAutoIncrementToPrimaryKeys1704567600000
  implements MigrationInterface
{
  name = "AddAutoIncrementToPrimaryKeys1704567600000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check and update user_attendance table
    // First check if uatid already has AUTO_INCREMENT
    const userAttendanceCheck = await queryRunner.query(`
      SELECT COLUMN_NAME, EXTRA 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'user_attendance' 
      AND COLUMN_NAME = 'uatid'
    `);

    if (
      userAttendanceCheck.length > 0 &&
      !userAttendanceCheck[0].EXTRA.includes("auto_increment")
    ) {
      // Check if PRIMARY KEY exists
      const pkCheck = await queryRunner.query(`
        SELECT CONSTRAINT_NAME 
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'user_attendance' 
        AND CONSTRAINT_TYPE = 'PRIMARY KEY'
      `);

      if (pkCheck.length === 0) {
        // No PRIMARY KEY, add it with AUTO_INCREMENT
        await queryRunner.query(`
          ALTER TABLE \`user_attendance\` 
          MODIFY \`uatid\` int NOT NULL AUTO_INCREMENT,
          ADD PRIMARY KEY (\`uatid\`)
        `);
      } else {
        // PRIMARY KEY exists, just add AUTO_INCREMENT
        await queryRunner.query(`
          ALTER TABLE \`user_attendance\` 
          MODIFY \`uatid\` int NOT NULL AUTO_INCREMENT
        `);
      }
    }

    // For assignment_sale table: Ensure PRIMARY KEY, then add AUTO_INCREMENT
    const assignmentSaleCheck = await queryRunner.query(`
      SELECT COLUMN_NAME, EXTRA 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'assignment_sale' 
      AND COLUMN_NAME = 'assid'
    `);

    if (
      assignmentSaleCheck.length > 0 &&
      !assignmentSaleCheck[0].EXTRA.includes("auto_increment")
    ) {
      // Check if PRIMARY KEY exists
      const pkCheck = await queryRunner.query(`
        SELECT CONSTRAINT_NAME 
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'assignment_sale' 
        AND CONSTRAINT_TYPE = 'PRIMARY KEY'
      `);

      if (pkCheck.length === 0) {
        // No PRIMARY KEY, add it with AUTO_INCREMENT
        await queryRunner.query(`
          ALTER TABLE \`assignment_sale\` 
          MODIFY \`assid\` int NOT NULL AUTO_INCREMENT,
          ADD PRIMARY KEY (\`assid\`)
        `);
      } else {
        // PRIMARY KEY exists, just add AUTO_INCREMENT
        await queryRunner.query(`
          ALTER TABLE \`assignment_sale\` 
          MODIFY \`assid\` int NOT NULL AUTO_INCREMENT
        `);
      }
    }

    // For usership table: Ensure PRIMARY KEY, then add AUTO_INCREMENT
    const usershipCheck = await queryRunner.query(`
      SELECT COLUMN_NAME, EXTRA 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'usership' 
      AND COLUMN_NAME = 'asuid'
    `);

    if (
      usershipCheck.length > 0 &&
      !usershipCheck[0].EXTRA.includes("auto_increment")
    ) {
      // Check if PRIMARY KEY exists
      const pkCheck = await queryRunner.query(`
        SELECT CONSTRAINT_NAME 
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'usership' 
        AND CONSTRAINT_TYPE = 'PRIMARY KEY'
      `);

      if (pkCheck.length === 0) {
        // No PRIMARY KEY, add it with AUTO_INCREMENT
        await queryRunner.query(`
          ALTER TABLE \`usership\` 
          MODIFY \`asuid\` int NOT NULL AUTO_INCREMENT,
          ADD PRIMARY KEY (\`asuid\`)
        `);
      } else {
        // PRIMARY KEY exists, just add AUTO_INCREMENT
        await queryRunner.query(`
          ALTER TABLE \`usership\` 
          MODIFY \`asuid\` int NOT NULL AUTO_INCREMENT
        `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove AUTO_INCREMENT from uatid in user_attendance table
    await queryRunner.query(`
      ALTER TABLE \`user_attendance\` 
      MODIFY \`uatid\` int NOT NULL
    `);

    // Remove AUTO_INCREMENT from assid in assignment_sale table
    await queryRunner.query(`
      ALTER TABLE \`assignment_sale\` 
      MODIFY \`assid\` int NOT NULL
    `);

    // Remove AUTO_INCREMENT from asuid in usership table
    await queryRunner.query(`
      ALTER TABLE \`usership\` 
      MODIFY \`asuid\` int NOT NULL
    `);
  }
}
