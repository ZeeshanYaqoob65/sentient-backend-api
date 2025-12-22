import { Response } from "express";
import { AppDataSource } from "../config/database";
import { Usership } from "../entities/Usership";
import { UsershipDetail } from "../entities/UsershipDetail";
import { UserAttendance } from "../entities/UserAttendance";
import { CompetitorBrand } from "../entities/CompetitorBrand";
import { Assignment } from "../entities/Assignment";
import { AuthRequest } from "../middleware/auth.middleware";

const usershipRepository = AppDataSource.getRepository(Usership);
const usershipDetailRepository = AppDataSource.getRepository(UsershipDetail);
const attendanceRepository = AppDataSource.getRepository(UserAttendance);
const competitorBrandRepository = AppDataSource.getRepository(CompetitorBrand);
const assignmentRepository = AppDataSource.getRepository(Assignment);

export class UsershipController {
  /**
   * Get usership data for today
   * GET /api/ba/usership
   */
  async getUsership(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const currentDate = new Date();
      const dateString = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}-${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${currentDate.getFullYear()}`;

      // Get usership record
      const usership = await usershipRepository.findOne({
        where: { uid, sale_date: dateString },
      });

      if (!usership) {
        return res.status(404).json({
          success: false,
          message: "No usership record found for today",
        });
      }

      // Get assignment to get brand name
      const assignment = await assignmentRepository.findOne({
        where: { uid, asstatus: 0 },
        relations: ["brand"],
      });

      // Get usership details with competitor brands
      const usershipDetails = await usershipDetailRepository
        .createQueryBuilder("detail")
        .leftJoin("cbrand", "competitor", "detail.cbrid = competitor.cbrid")
        .select([
          "detail.asudid",
          "detail.cbrid",
          "detail.interception",
          "detail.productive",
          "detail.com_sale",
          "competitor.cbrname as competitor_name",
        ])
        .where("detail.uid = :uid", { uid })
        .andWhere("detail.sale_date = :dateString", { dateString })
        .orderBy("competitor.cbrid", "ASC")
        .getRawMany();

      // Get attendance status
      const attendance = await attendanceRepository.findOne({
        where: { uid, attendance_date: dateString },
      });

      // Transform data to match frontend format
      // Note: Frontend expects products array, but usership is about competitor brands
      // We'll transform competitor brands into products format
      const products = usershipDetails.map((detail) => ({
        productId: detail.cbrid?.toString() || "",
        productName: detail.competitor_name || "",
        interceptedCustomer: parseFloat(detail.interception) || 0,
        productiveCustomer: parseFloat(detail.productive) || 0,
        asudid: detail.asudid, // Keep for updates
      }));

      return res.json({
        success: true,
        data: {
          brand: assignment?.brand?.brname || "",
          postDate: dateString,
          products: products,
        },
        isPosted: usership.asustatus === 1,
        usershipStatus: attendance?.usership_status || 0,
      });
    } catch (error) {
      console.error("Get usership error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Save usership data
   * POST /api/ba/usership/save
   */
  async saveUsership(req: AuthRequest, res: Response) {
    try {
      const { products } = req.body;

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Products array is required",
        });
      }

      // Validate interception >= productive
      for (const product of products) {
        if (
          parseFloat(product.productiveCustomer) >
          parseFloat(product.interceptedCustomer)
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Productive quantity cannot be greater than interception quantity",
          });
        }
      }

      // Update usership details
      for (const product of products) {
        if (product.asudid) {
          await usershipDetailRepository.update(
            { asudid: product.asudid },
            {
              interception: parseInt(String(product.interceptedCustomer || 0)),
              productive: parseInt(String(product.productiveCustomer || 0)),
            }
          );
        }
      }

      return res.json({
        success: true,
        message: "Usership data saved successfully",
      });
    } catch (error) {
      console.error("Save usership error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Post usership data (lock)
   * POST /api/ba/usership/post
   */
  async postUsership(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const { products } = req.body;
      const currentDate = new Date();
      const dateString = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}-${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${currentDate.getFullYear()}`;

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Products array is required",
        });
      }

      // Validate interception >= productive
      for (const product of products) {
        if (
          parseFloat(product.productiveCustomer) >
          parseFloat(product.interceptedCustomer)
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Productive quantity cannot be greater than interception quantity",
          });
        }
      }

      // Update usership status
      await usershipRepository.update(
        { uid, sale_date: dateString },
        { asustatus: 1 }
      );

      // Update attendance status
      await attendanceRepository.update(
        { uid, attendance_date: dateString },
        { usership_status: 1 }
      );

      // Update usership details
      for (const product of products) {
        if (product.asudid) {
          await usershipDetailRepository.update(
            { asudid: product.asudid },
            {
              interception: parseInt(String(product.interceptedCustomer || 0)),
              productive: parseInt(String(product.productiveCustomer || 0)),
            }
          );
        }
      }

      return res.json({
        success: true,
        message: "Usership data posted successfully",
      });
    } catch (error) {
      console.error("Post usership error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get competition sales data
   * GET /api/ba/competition-sales
   */
  async getCompetitionSales(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const currentDate = new Date();
      const dateString = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}-${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${currentDate.getFullYear()}`;

      // Get assignment to get brand name
      const assignment = await assignmentRepository.findOne({
        where: { uid, asstatus: 0 },
        relations: ["brand"],
      });

      // Get usership details with competitor brands
      const competitionData = await usershipDetailRepository
        .createQueryBuilder("detail")
        .leftJoin("cbrand", "competitor", "detail.cbrid = competitor.cbrid")
        .select([
          "detail.asudid",
          "detail.cbrid",
          "detail.com_sale",
          "competitor.cbrname as competitor_name",
        ])
        .where("detail.uid = :uid", { uid })
        .andWhere("detail.sale_date = :dateString", { dateString })
        .orderBy("competitor.cbrid", "ASC")
        .getRawMany();

      // Get attendance status
      const attendance = await attendanceRepository.findOne({
        where: { uid, attendance_date: dateString },
      });

      // Transform data to match frontend format
      const competitors = competitionData.map((detail) => ({
        competitorId: detail.cbrid?.toString() || "",
        competitorName: detail.competitor_name || "",
        salesValue: parseFloat(detail.com_sale) || 0,
        asudid: detail.asudid, // Keep for updates
      }));

      return res.json({
        success: true,
        data: {
          brand: assignment?.brand?.brname || "",
          postDate: dateString,
          competitors: competitors,
        },
        isPosted: attendance?.comsale_status === 1,
      });
    } catch (error) {
      console.error("Get competition sales error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Save competition sales
   * POST /api/ba/competition-sales/save
   */
  async saveCompetitionSales(req: AuthRequest, res: Response) {
    try {
      const { competitors } = req.body;

      if (!Array.isArray(competitors) || competitors.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Competitors array is required",
        });
      }

      for (const competitor of competitors) {
        if (competitor.asudid) {
          await usershipDetailRepository.update(
            { asudid: competitor.asudid },
            { com_sale: parseInt(String(competitor.salesValue || 0)) }
          );
        }
      }

      return res.json({
        success: true,
        message: "Competition sales saved successfully",
      });
    } catch (error) {
      console.error("Save competition sales error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Post competition sales (lock)
   * POST /api/ba/competition-sales/post
   */
  async postCompetitionSales(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const { competitors } = req.body;
      const currentDate = new Date();
      const dateString = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}-${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${currentDate.getFullYear()}`;

      if (!Array.isArray(competitors) || competitors.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Competitors array is required",
        });
      }

      // Update attendance status
      await attendanceRepository.update(
        { uid, attendance_date: dateString },
        { comsale_status: 1 }
      );

      // Update competition sales
      for (const competitor of competitors) {
        if (competitor.asudid) {
          await usershipDetailRepository.update(
            { asudid: competitor.asudid },
            { com_sale: parseInt(String(competitor.salesValue || 0)) }
          );
        }
      }

      return res.json({
        success: true,
        message: "Competition sales posted successfully",
      });
    } catch (error) {
      console.error("Post competition sales error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
