import { Response } from "express";
import { AppDataSource } from "../config/database";
import { UserAttendance } from "../entities/UserAttendance";
import { Assignment } from "../entities/Assignment";
import { AssignmentDetail } from "../entities/AssignmentDetail";
import { Product } from "../entities/Product";
import { AuthRequest } from "../middleware/auth.middleware";

const attendanceRepository = AppDataSource.getRepository(UserAttendance);
const assignmentRepository = AppDataSource.getRepository(Assignment);
const assignmentDetailRepository =
  AppDataSource.getRepository(AssignmentDetail);
const productRepository = AppDataSource.getRepository(Product);

export class DealsSamplesController {
  /**
   * Get deals data
   * GET /api/ba/deals
   */
  async getDeals(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const asid = req.user!.asid;
      const currentDate = new Date();
      const dateString = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}-${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${currentDate.getFullYear()}`;

      // Check if deals are enabled for this assignment
      const assignment = await assignmentRepository.findOne({
        where: { asid, asstatus: 0 },
      });

      if (!assignment || assignment.deal_status !== 1) {
        return res.status(403).json({
          success: false,
          message: "Deals feature is not enabled for your assignment",
        });
      }

      // Get attendance with deals data
      const attendance = await attendanceRepository.findOne({
        where: { uid, attendance_date: dateString },
      });

      return res.json({
        success: true,
        data: {
          title: attendance?.uatdeals_title || "",
          data: attendance?.uatdeals || "",
        },
        isPosted: attendance?.deals_sold_status === 1,
      });
    } catch (error) {
      console.error("Get deals error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Save deals data
   * POST /api/ba/deals/save
   */
  async saveDeals(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const { title, data } = req.body;
      const currentDate = new Date();
      const dateString = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}-${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${currentDate.getFullYear()}`;

      if (!title || !data) {
        return res.status(400).json({
          success: false,
          message: "Title and data are required",
        });
      }

      // Store deals data in title field (varchar 255) since uatdeals is int
      const dealsData = typeof data === 'string' ? data : JSON.stringify(data);
      const truncatedData = dealsData.length > 255 
        ? dealsData.substring(0, 252) + "..." 
        : dealsData;

      await attendanceRepository.update(
        { uid, attendance_date: dateString },
        {
          uatdeals_title: truncatedData,
          uatdeals: typeof data === 'number' ? data : (Array.isArray(data) ? data.length : 0),
        }
      );

      return res.json({
        success: true,
        message: "Deals data saved successfully",
      });
    } catch (error) {
      console.error("Save deals error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Post deals data (lock)
   * POST /api/ba/deals/post
   */
  async postDeals(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const { title, data } = req.body;
      const currentDate = new Date();
      const dateString = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}-${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${currentDate.getFullYear()}`;

      if (!title || !data) {
        return res.status(400).json({
          success: false,
          message: "Title and data are required",
        });
      }

      // Store deals data in title field (varchar 255) since uatdeals is int
      const dealsData = typeof data === 'string' ? data : JSON.stringify(data);
      const truncatedData = dealsData.length > 255 
        ? dealsData.substring(0, 252) + "..." 
        : dealsData;

      await attendanceRepository.update(
        { uid, attendance_date: dateString },
        {
          deals_sold_status: 1,
          uatdeals_title: truncatedData,
          uatdeals: typeof data === 'number' ? data : (Array.isArray(data) ? data.length : 0),
        }
      );

      return res.json({
        success: true,
        message: "Deals data posted successfully",
      });
    } catch (error) {
      console.error("Post deals error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get samples data
   * GET /api/ba/samples
   */
  async getSamples(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const asid = req.user!.asid;
      const currentDate = new Date();
      const dateString = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}-${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${currentDate.getFullYear()}`;

      // Check if samples are enabled for this assignment
      const assignment = await assignmentRepository.findOne({
        where: { asid, asstatus: 0 },
      });

      if (!assignment || assignment.sample_status !== 1) {
        return res.status(403).json({
          success: false,
          message: "Samples feature is not enabled for your assignment",
        });
      }

      // Get assignment to get products
      const assignmentDetails = await assignmentDetailRepository.find({
        where: { asid, asdstatus: 0 },
        relations: ["assignment"],
      });

      // Get attendance with samples data
      const attendance = await attendanceRepository.findOne({
        where: { uid, attendance_date: dateString },
      });

      // Try to parse samples data from uatsamples_title (varchar 255) since uatsamples is int
      let samplesData: any[] = [];
      if (attendance?.uatsamples_title && attendance.uatsamples_title !== "None") {
        try {
          samplesData = JSON.parse(attendance.uatsamples_title);
        } catch (e) {
          // If not JSON, create empty array
          samplesData = [];
        }
      }

      // Get products for the assignment
      const products = await Promise.all(
        assignmentDetails.map(async (detail) => {
          const product = await productRepository.findOne({
            where: { pid: detail.pid },
            relations: ["brand"],
          });

          // Find existing sample data for this product
          const existingSample = samplesData.find(
            (s: any) => s.pid === detail.pid
          );

          return {
            company: product?.brand?.brname || "",
            product_name: product?.pname || "",
            variant: product?.ptype || "",
            size: product?.psize || null,
            qtyGiven: existingSample?.qtyGiven || 0,
            pid: detail.pid, // Keep for updates
          };
        })
      );

      return res.json({
        success: true,
        data: {
          status: attendance?.samples_status === 1 ? "posted" : "pending",
          products: products,
        },
        isPosted: attendance?.samples_status === 1,
      });
    } catch (error) {
      console.error("Get samples error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Save samples data
   * POST /api/ba/samples/save
   */
  async saveSamples(req: AuthRequest, res: Response) {
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

      if (!Array.isArray(products)) {
        return res.status(400).json({
          success: false,
          message: "Products array is required",
        });
      }

      // Store samples as JSON in uatsamples_title (varchar 255)
      // Note: If JSON is too long, we'll truncate it
      const samplesData = JSON.stringify(products);
      const truncatedData = samplesData.length > 255 
        ? samplesData.substring(0, 252) + "..." 
        : samplesData;

      await attendanceRepository.update(
        { uid, attendance_date: dateString },
        {
          uatsamples_title: truncatedData,
          uatsamples: products.length, // Store count in int field
        }
      );

      return res.json({
        success: true,
        message: "Samples data saved successfully",
      });
    } catch (error) {
      console.error("Save samples error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Post samples data (lock)
   * POST /api/ba/samples/post
   */
  async postSamples(req: AuthRequest, res: Response) {
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

      if (!Array.isArray(products)) {
        return res.status(400).json({
          success: false,
          message: "Products array is required",
        });
      }

      // Store samples as JSON in uatsamples_title (varchar 255)
      // Note: If JSON is too long, we'll truncate it
      const samplesData = JSON.stringify(products);
      const truncatedData = samplesData.length > 255 
        ? samplesData.substring(0, 252) + "..." 
        : samplesData;

      await attendanceRepository.update(
        { uid, attendance_date: dateString },
        {
          samples_status: 1,
          uatsamples_title: truncatedData,
          uatsamples: products.length, // Store count in int field
        }
      );

      return res.json({
        success: true,
        message: "Samples data posted successfully",
      });
    } catch (error) {
      console.error("Post samples error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
