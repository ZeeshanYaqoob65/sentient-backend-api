import * as crypto from "crypto";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { Assignment } from "../entities/Assignment";
import { AssignmentDetail } from "../entities/AssignmentDetail";
import { AssignmentSale } from "../entities/AssignmentSale";
import { AttendanceLog } from "../entities/AttendanceLog";
import { User } from "../entities/User";
import { UserAttendance } from "../entities/UserAttendance";
import { Usership } from "../entities/Usership";
import { UsershipDetail } from "../entities/UsershipDetail";

const userRepository = AppDataSource.getRepository(User);
const assignmentRepository = AppDataSource.getRepository(Assignment);
const attendanceRepository = AppDataSource.getRepository(UserAttendance);
const assignmentSaleRepository = AppDataSource.getRepository(AssignmentSale);
const assignmentDetailRepository =
  AppDataSource.getRepository(AssignmentDetail);
const usershipRepository = AppDataSource.getRepository(Usership);
const usershipDetailRepository = AppDataSource.getRepository(UsershipDetail);
const attendanceLogRepository = AppDataSource.getRepository(AttendanceLog);

export class AuthController {
  /**
   * Login endpoint
   * POST /api/auth/login
   *
   * Input Parameters:
   * - userName: string
   * - password: string
   * - app_id: string (optional)
   *
   * Response:
   * Returns userData based on the structure defined in types/user.ts
   * - Required fields (lines 14-16): assignedStoreName, storeLatitude, storeLongitude
   * - Full user data structure (lines 5-19): userId, userName, userEmail, userPhone,
   *   userType, userCNIC, assignedStoreName, storeLatitude, storeLongitude, profilePicture
   */
  async login(req: Request, res: Response) {
    try {
      const { userName, password, app_id } = req.body;

      // Validate required fields
      if (!userName || !password) {
        return res.status(400).json({
          success: false,
          message: "userName and password are required",
        });
      }

      // Hash password with MD5 (matching PHP implementation)
      const hashedPassword = crypto
        .createHash("md5")
        .update(password)
        .digest("hex");

      // Get current date in d-m-Y format
      const currentDate = new Date();
      const at_date = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}-${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${currentDate.getFullYear()}`;
      const timestamp = Math.floor(Date.now() / 1000);

      // 1. Find user by username, password, utype = 4 (BA), and ustatus = 0
      // Select specific fields: uid, utype, app_id, lid, su_attendance
      const user = await userRepository
        .createQueryBuilder("user")
        .select([
          "user.uid",
          "user.utype",
          "user.app_id",
          "user.lid",
          "user.su_attendance",
          "user.fullname",
          "user.email",
          "user.mobileno1",
          "user.ba_no",
          "user.su_no",
          "user.user_image",
        ])
        .where("user.username = :username", {
          username: userName.toLowerCase(),
        })
        .andWhere("user.password = :password", { password: hashedPassword })
        .andWhere("user.utype = :utype", { utype: 4 })
        .andWhere("user.ustatus = :ustatus", { ustatus: 0 })
        .getOne();

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      // 2. Handle attendance_log entry
      const lastLogEntry = await attendanceLogRepository.findOne({
        where: {
          uid: user.uid,
          attendance_date: at_date,
        },
        order: {
          atlid: "DESC",
        },
      });

      if (!lastLogEntry) {
        // Create new attendance log entry
        const newLogEntry = attendanceLogRepository.create({
          uid: user.uid,
          attendance_date: at_date,
          app_id: app_id || "",
          atldate: timestamp,
        });
        await attendanceLogRepository.save(newLogEntry);
      } else {
        // Check if more than 300 seconds (5 minutes) have passed
        const timeDiff = timestamp - lastLogEntry.atldate;
        if (timeDiff > 300) {
          const newLogEntry = attendanceLogRepository.create({
            uid: user.uid,
            attendance_date: at_date,
            app_id: app_id || "",
            atldate: timestamp,
          });
          await attendanceLogRepository.save(newLogEntry);
        }
      }

      // 3. Update app_id if request has app_id and user doesn't have one
      if (app_id && !user.app_id) {
        await userRepository.update({ uid: user.uid }, { app_id: app_id });
        user.app_id = app_id;
      }

      // 4. Check for active assignment (asstatus = 0)
      const assignment = await assignmentRepository.findOne({
        where: {
          uid: user.uid,
          asstatus: 0, // 0 = Active assignment
        },
        relations: ["store", "brand"], // JOIN with store and brand tables
      });

      if (!assignment) {
        return res.status(403).json({
          success: false,
          message: "No active assignment",
        });
      }

      // 5. Check user daily attendance
      let attendance = await attendanceRepository.findOne({
        where: {
          uid: user.uid,
          attendance_date: at_date,
        },
      });

      if (!attendance) {
        // Create new attendance record
        attendance = attendanceRepository.create({
          uid: user.uid,
          asid: assignment.asid,
          attendance_date: at_date,
          store_starttime: assignment.asstarttime || "00:00",
          store_offtime: assignment.asofftime || "00:00",
          uatapp_id: app_id || "",
          uatdate: timestamp,
        });
        await attendanceRepository.save(attendance);
      } else {
        // 7. Update timein if attendance exists but timein is 0
        if (attendance.timein === 0) {
          await attendanceRepository.update(
            { uatid: attendance.uatid },
            { uatdate: timestamp }
          );
        }
      }

      // 6. Always check and create assignment_sale records if they don't exist
      // This ensures records are created even if attendance already exists
      // OPTIMIZED: Use bulk insert instead of individual saves
      const assignmentDetails = await assignmentDetailRepository.find({
        where: {
          asid: assignment.asid,
          asdstatus: 0, // Only active assignment details
        },
      });

      if (assignmentDetails.length > 0) {
        // Get existing assignment_sale records in one query
        const existingSales = await assignmentSaleRepository.find({
          where: {
            uid: user.uid,
            sale_date: at_date,
          },
          select: ["asdid"],
        });

        const existingAsdidSet = new Set(
          existingSales.map((s) => s.asdid)
        );

        // Prepare bulk insert data
        const salesToInsert = assignmentDetails
          .filter((detail) => !existingAsdidSet.has(detail.asdid))
          .map((detail) => [
            user.uid,
            detail.asdid,
            detail.asid,
            detail.brid,
            detail.pid,
            at_date,
            Number(detail.asdtarget),
            timestamp,
          ]);

        // Bulk insert if there are records to insert
        if (salesToInsert.length > 0) {
          const placeholders = salesToInsert
            .map(() => "(?, ?, ?, ?, ?, ?, ?, ?)")
            .join(", ");
          const values = salesToInsert.flat();

          await AppDataSource.query(
            `INSERT INTO assignment_sale (uid, asdid, asid, brid, pid, sale_date, sale_target, assdate) 
             VALUES ${placeholders}`,
            values
          );
        }
      }

      // 8. Create usership records if they don't exist for today
      const brid = assignment.brid;
      let existingUsership = await usershipRepository.findOne({
        where: {
          uid: user.uid,
          brid: brid,
          sale_date: at_date,
        },
      });

      // Query com_brand table for competitor brands
      const competitorBrands = await AppDataSource.query(
        `SELECT brid, cbrid FROM com_brand WHERE brid = ? ORDER BY combrid ASC`,
        [brid]
      );

      if (competitorBrands && competitorBrands.length > 0) {
        if (!existingUsership) {
          // Create usership record
          const usership = usershipRepository.create({
            uid: user.uid,
            asid: assignment.asid,
            brid: brid,
            sale_date: at_date,
            asudate: timestamp,
          });
          await usershipRepository.save(usership);
          existingUsership = usership;
        }

        const asuid = existingUsership.asuid;

        // Always check and create usership_detail records if they don't exist
        // OPTIMIZED: Use bulk insert instead of individual saves
        // Get existing usership_detail records in one query
        const existingDetails = await usershipDetailRepository.find({
          where: {
            asuid: asuid,
            uid: user.uid,
            sale_date: at_date,
          },
          select: ["cbrid"],
        });

        const existingCbridSet = new Set(
          existingDetails.map((d) => d.cbrid)
        );

        // Prepare bulk insert data
        const detailsToInsert = competitorBrands
          .filter((comBrand: any) => !existingCbridSet.has(comBrand.cbrid))
          .map((comBrand: any) => [
            asuid,
            user.uid,
            brid,
            comBrand.cbrid,
            at_date,
            timestamp,
          ]);

        // Bulk insert if there are records to insert
        if (detailsToInsert.length > 0) {
          const placeholders = detailsToInsert
            .map(() => "(?, ?, ?, ?, ?, ?)")
            .join(", ");
          const values = detailsToInsert.flat();

          await AppDataSource.query(
            `INSERT INTO usership_detail (asuid, uid, brid, cbrid, sale_date, asuddate) 
             VALUES ${placeholders}`,
            values
          );
        }
      }

      // Verify store exists
      if (!assignment.store) {
        return res.status(400).json({
          success: false,
          message: "Store not found for this assignment",
        });
      }

      // Determine user type
      const userType: "BA" | "Supervisor" =
        user.utype === 4 ? "BA" : "Supervisor";

      // Generate JWT token
      const tokenPayload = {
        uid: user.uid,
        username: userName.toLowerCase(),
        utype: user.utype,
        asid: assignment.asid,
      };

      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || "secret", {
        expiresIn: "7d", // Token expires in 7 days
      });

      // Build response data matching types/user.ts structure
      const userData = {
        userId: user.uid.toString(),
        userName: user.fullname || "",
        userEmail: user.email || "",
        userPhone: user.mobileno1 || "",
        userType: userType,
        userCNIC: user.ba_no || String(user.su_no) || "",
        assignedStoreName: assignment.store.store_name || "", // Required field
        storeLatitude: parseFloat(assignment.store.stlat) || 0, // Required field
        storeLongitude: parseFloat(assignment.store.stlong) || 0, // Required field
        profilePicture: user.user_image || undefined, // Optional field
      };

      return res.json({
        success: true,
        data: userData,
        token: token,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Upload selfie for check-in
   * POST /api/auth/upload-selfie
   */
  async uploadSelfie(req: Request, res: Response) {
    try {
      const { uid, latitude, longitude } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      if (!uid || !latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      const currentDate = new Date();
      const dateString = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}-${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${currentDate.getFullYear()}`;
      const timestamp = Math.floor(Date.now() / 1000);

      let attendance = await attendanceRepository.findOne({
        where: { uid: parseInt(uid), attendance_date: dateString },
      });

      // Create attendance record if it doesn't exist
      if (!attendance) {
        // Get user's active assignment
        const assignment = await assignmentRepository.findOne({
          where: { uid: parseInt(uid), asstatus: 0 },
        });

        if (!assignment) {
          return res.status(400).json({
            success: false,
            message: "User does not have an active assignment",
          });
        }

        // Create new attendance record using raw query to exclude uatid
        // This avoids the issue where TypeORM tries to insert uatid with DEFAULT
        const result = await attendanceRepository.query(
          `INSERT INTO user_attendance (uid, asid, attendance_date, store_starttime, store_offtime, timein, timein_lat, timein_long, timein_image, uatdate) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            parseInt(uid),
            assignment.asid,
            dateString,
            assignment.asstarttime || "00:00",
            assignment.asofftime || "00:00",
            timestamp,
            latitude,
            longitude,
            file.filename,
            timestamp,
          ]
        );

        // Fetch the created attendance record by uid and date
        attendance = await attendanceRepository.findOne({
          where: { uid: parseInt(uid), attendance_date: dateString },
        });
      } else {
        // Update existing attendance with selfie and location
        if (attendance.timein === 0) {
          await attendanceRepository.update(
            { uatid: attendance.uatid },
            {
              timein: timestamp,
              timein_lat: latitude,
              timein_long: longitude,
              timein_image: file.filename,
            }
          );
        } else {
          await attendanceRepository.update(
            { uatid: attendance.uatid },
            {
              timein_lat: latitude,
              timein_long: longitude,
              timein_image: file.filename,
            }
          );
        }

        // Reload attendance to get updated data
        const updatedAttendance = await attendanceRepository.findOne({
          where: { uatid: attendance.uatid },
        });
        if (updatedAttendance) {
          attendance = updatedAttendance;
        }
      }

      // Ensure attendance exists before returning
      if (!attendance) {
        return res.status(500).json({
          success: false,
          message: "Failed to create or update attendance record",
        });
      }

      // Return data in format expected by frontend
      return res.json({
        success: true,
        message: "Selfie uploaded successfully",
        data: {
          attendanceId: attendance.uatid.toString(),
          timestamp: new Date(timestamp * 1000).toISOString(),
        },
        filename: file.filename,
      });
    } catch (error) {
      console.error("Upload selfie error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Logout endpoint
   * POST /api/auth/logout
   */
  async logout(req: Request, res: Response) {
    try {
      const { uid, latitude, longitude } = req.body;

      if (!uid) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      const currentDate = new Date();
      const dateString = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}-${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${currentDate.getFullYear()}`;
      const timestamp = Math.floor(Date.now() / 1000);

      const attendance = await attendanceRepository.findOne({
        where: { uid: parseInt(uid), attendance_date: dateString },
      });

      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: "Attendance record not found",
        });
      }

      await attendanceRepository.update(
        { uatid: attendance.uatid },
        {
          timeout: timestamp,
          timeout_lat: latitude || "",
          timeout_long: longitude || "",
        }
      );

      return res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Update user profile picture
   * PUT /api/auth/profile-picture
   */
  async updateProfilePicture(req: Request, res: Response) {
    try {
      const { uid } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      if (!uid) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      // Update user record with profile picture filename
      // Note: In a real implementation, you might want to store the full URL
      await userRepository.update(
        { uid: parseInt(uid) },
        { user_image: file.filename }
      );

      return res.json({
        success: true,
        message: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error("Update profile picture error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Helper method to create usership records
   */
  private async createUsershipRecords(
    uid: number,
    asid: number,
    brid: number,
    saleDate: string,
    timestamp: number
  ) {
    // Check if usership already exists
    const existingUsership = await usershipRepository.findOne({
      where: { uid, brid, sale_date: saleDate },
    });

    if (existingUsership) {
      return;
    }

    // Get competitor brands (this would need a com_brand table/entity)
    // For now, we'll skip this part as the table structure isn't fully clear
    // You can implement this based on your com_brand table structure
  }
}
