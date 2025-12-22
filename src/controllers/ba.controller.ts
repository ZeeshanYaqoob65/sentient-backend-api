import { Response } from "express";
import { AppDataSource } from "../config/database";
import { AssignmentSale } from "../entities/AssignmentSale";
import { UserAttendance } from "../entities/UserAttendance";
import { Usership } from "../entities/Usership";
import { UsershipDetail } from "../entities/UsershipDetail";
import { Assignment } from "../entities/Assignment";
import { Product } from "../entities/Product";
import { Brand } from "../entities/Brand";
import { AuthRequest } from "../middleware/auth.middleware";
import { Between } from "typeorm";

const assignmentSaleRepository = AppDataSource.getRepository(AssignmentSale);
const attendanceRepository = AppDataSource.getRepository(UserAttendance);
const usershipRepository = AppDataSource.getRepository(Usership);
const usershipDetailRepository = AppDataSource.getRepository(UsershipDetail);
const assignmentRepository = AppDataSource.getRepository(Assignment);
const productRepository = AppDataSource.getRepository(Product);
const brandRepository = AppDataSource.getRepository(Brand);

export class BAController {
  /**
   * Get dashboard data
   * GET /api/ba/dashboard
   */
  async getDashboard(req: AuthRequest, res: Response) {
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

      // Get current month data
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const firstDay = Math.floor(
        new Date(year, month - 1, 1).getTime() / 1000
      );
      const lastDay = Math.floor(
        new Date(year, month, 0, 23, 59, 59).getTime() / 1000
      );

      // Get assignment with relations
      const assignment = await assignmentRepository.findOne({
        where: { uid, asstatus: 0 },
        relations: ["store", "brand", "user"],
      });

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: "No active assignment found",
        });
      }

      // Get monthly sales
      const monthlySales = await assignmentSaleRepository
        .createQueryBuilder("sale")
        .select("SUM(sale.sale_qty)", "total_sale")
        .where("sale.uid = :uid", { uid })
        .andWhere("sale.asid = :asid", { asid: assignment.asid })
        .andWhere("sale.assdate BETWEEN :firstDay AND :lastDay", {
          firstDay,
          lastDay,
        })
        .getRawOne();

      // Get working days count
      const workingDays = await attendanceRepository.count({
        where: {
          uid,
          asid: assignment.asid,
          timein: Between(1, lastDay),
        },
      });

      // Calculate metrics
      const totalSale = parseFloat(monthlySales.total_sale) || 0;
      const monthlyTarget = assignment.storetarget * 26;
      const targetTillDate = workingDays * assignment.storetarget;
      const dailySale = workingDays > 0 ? totalSale / workingDays : 0;
      const dailyAchievement =
        assignment.storetarget > 0
          ? (dailySale / assignment.storetarget) * 100
          : 0;
      const monthlyAchievement =
        monthlyTarget > 0 ? (totalSale / monthlyTarget) * 100 : 0;
      const remainingTarget = monthlyTarget - totalSale;

      // Get today's attendance
      const todayAttendance = await attendanceRepository.findOne({
        where: { uid, attendance_date: dateString },
      });

      // Get usership data
      const usershipData = await usershipDetailRepository
        .createQueryBuilder("detail")
        .select("SUM(detail.interception)", "total_interception")
        .addSelect("SUM(detail.productive)", "total_productive")
        .where("detail.uid = :uid", { uid })
        .andWhere("detail.asuddate BETWEEN :firstDay AND :lastDay", {
          firstDay,
          lastDay,
        })
        .getRawOne();

      const totalInterception =
        parseFloat(usershipData.total_interception) || 0;
      const totalProductive = parseFloat(usershipData.total_productive) || 0;
      const avgUsership =
        totalInterception > 0 ? (totalProductive / totalInterception) * 100 : 0;

      return res.json({
        success: true,
        profile: {
          name: assignment.user.fullname,
          brand: assignment.brand.brname,
          store: assignment.store.store_name,
          city: assignment.store.city,
        },
        performance: {
          targetPerDay: assignment.storetarget,
          monthlyTarget,
          targetTillDate,
          totalSale,
          dailyAchievement: Math.round(dailyAchievement),
          monthlyAchievement: Math.round(monthlyAchievement),
          perDayAvg: Math.round(dailySale),
          remainingTarget,
          workingDays,
          avgUsership: Math.round(avgUsership),
        },
        todayStatus: {
          stockStatus: todayAttendance?.stock_status || 0,
          priceStatus: todayAttendance?.price_status || 0,
          saleStatus: todayAttendance?.sale_status || 0,
          usershipStatus: todayAttendance?.usership_status || 0,
          comsaleStatus: todayAttendance?.comsale_status || 0,
          dealsSoldStatus: todayAttendance?.deals_sold_status || 0,
          samplesStatus: todayAttendance?.samples_status || 0,
        },
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get stock quantity data
   * GET /api/ba/stock
   */
  async getStock(req: AuthRequest, res: Response) {
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

      // Use raw SQL query matching the PHP implementation
      const stockData = await AppDataSource.query(
        `SELECT 
          ASS.assid, 
          ASS.uid, 
          ASS.asdid, 
          ASS.asid, 
          ASS.pid, 
          ASS.stock_qty, 
          ASS.stock_type, 
          ASD.asdstatus, 
          P.pid as product_id, 
          P.pname,
          P.ptype,
          P.psize,
          B.brname as company
        FROM assignment_sale ASS 
        INNER JOIN assignment_detail ASD ON ASS.asdid = ASD.asdid 
        INNER JOIN products P ON ASS.pid = P.pid 
        LEFT JOIN brand B ON P.brid = B.brid
        WHERE ASS.asid = ? AND ASS.sale_date = ? AND ASD.asdstatus = ? 
        ORDER BY P.pname ASC`,
        [asid, dateString, 0]
      );

      // Transform data to match frontend format
      const productsWithDetails = stockData.map((item: any) => ({
        company: item.company || "",
        product_name: item.pname || "",
        variant: item.ptype || "",
        size: item.psize || null,
        qty: parseFloat(item.stock_qty) || 0,
        status: (item.stock_type || "A") as "A" | "L" | "Z",
        assid: item.assid,
      }));

      // Get attendance status
      const attendance = await attendanceRepository.findOne({
        where: { uid, attendance_date: dateString },
      });

      return res.json({
        success: true,
        data: {
          status: attendance?.stock_status === 1 ? "posted" : "pending",
          productStatus: ["A", "L", "Z"],
          products: productsWithDetails,
        },
        isPosted: attendance?.stock_status === 1,
      });
    } catch (error) {
      console.error("Get stock error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Save stock quantity
   * POST /api/ba/stock/save
   */
  async saveStock(req: AuthRequest, res: Response) {
    try {
      const { products } = req.body;

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Products array is required",
        });
      }

      for (const product of products) {
        if (product.assid) {
          await assignmentSaleRepository.update(
            { assid: product.assid },
            {
              stock_qty: product.qty || 0,
              stock_type: product.status || "A",
            }
          );
        }
      }

      return res.json({
        success: true,
        message: "Stock data saved successfully",
      });
    } catch (error) {
      console.error("Save stock error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Post stock quantity (lock)
   * POST /api/ba/stock/post
   */
  async postStock(req: AuthRequest, res: Response) {
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

      // Save items
      for (const product of products) {
        if (product.assid) {
          await assignmentSaleRepository.update(
            { assid: product.assid },
            {
              stock_qty: parseInt(String(product.qty || 0)),
              stock_type: product.status || "A",
            }
          );
        }
      }

      // Update attendance status
      await attendanceRepository.update(
        { uid, attendance_date: dateString },
        { stock_status: 1 }
      );

      return res.json({
        success: true,
        message: "Stock data posted successfully",
      });
    } catch (error) {
      console.error("Post stock error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get price data
   * GET /api/ba/price
   */
  async getPrice(req: AuthRequest, res: Response) {
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

      // Use raw SQL query matching the PHP implementation
      const priceData: any[] = await AppDataSource.query(
        `SELECT 
          ASS.assid, 
          ASS.pid, 
          ASS.asdid,
          ASS.sale_price, 
          P.pname,
          P.ptype,
          P.psize,
          B.brname as company
        FROM assignment_sale ASS 
        INNER JOIN assignment_detail ASD ON ASS.asdid = ASD.asdid 
        INNER JOIN products P ON ASS.pid = P.pid 
        LEFT JOIN brand B ON P.brid = B.brid
        WHERE ASS.asid = ? AND ASS.sale_date = ? AND ASD.asdstatus = ? 
        ORDER BY P.pname ASC`,
        [asid, dateString, 0]
      );

      // Get last price if current is 0
      for (const item of priceData) {
        if (parseInt(item.sale_price) === 0) {
          const lastPriceResult = await AppDataSource.query(
            `SELECT sale_price FROM assignment_sale 
             WHERE assid < ? AND asdid = ? AND pid = ? AND sale_price > 0
             ORDER BY assid DESC LIMIT 1`,
            [item.assid, item.asdid, item.pid]
          );

          if (lastPriceResult && lastPriceResult.length > 0) {
            item.sale_price = lastPriceResult[0].sale_price;
          }
        }
      }

      // Transform data to match frontend format
      const products = priceData.map((item) => ({
        company: item.company || "",
        product_name: item.pname || "",
        variant: item.ptype || "",
        size: item.psize || null,
        price: parseInt(item.sale_price) || 0,
        assid: item.assid,
      }));

      const attendance = await attendanceRepository.findOne({
        where: { uid, attendance_date: dateString },
      });

      return res.json({
        success: true,
        data: {
          status: attendance?.price_status === 1 ? "posted" : "pending",
          products: products,
        },
        isPosted: attendance?.price_status === 1,
      });
    } catch (error) {
      console.error("Get price error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Save price
   * POST /api/ba/price/save
   */
  async savePrice(req: AuthRequest, res: Response) {
    try {
      const { products } = req.body;

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Products array is required",
        });
      }

      for (const product of products) {
        if (product.assid) {
          await assignmentSaleRepository.update(
            { assid: product.assid },
            { sale_price: parseInt(String(product.price || 0)) }
          );
        }
      }

      return res.json({
        success: true,
        message: "Price data saved successfully",
      });
    } catch (error) {
      console.error("Save price error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Post price (lock)
   * POST /api/ba/price/post
   */
  async postPrice(req: AuthRequest, res: Response) {
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

      for (const product of products) {
        if (product.assid) {
          await assignmentSaleRepository.update(
            { assid: product.assid },
            { sale_price: parseInt(String(product.price || 0)) }
          );
        }
      }

      await attendanceRepository.update(
        { uid, attendance_date: dateString },
        { price_status: 1 }
      );

      return res.json({
        success: true,
        message: "Price data posted successfully",
      });
    } catch (error) {
      console.error("Post price error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get sale data
   * GET /api/ba/sale
   */
  async getSale(req: AuthRequest, res: Response) {
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

      // Use raw SQL query matching the PHP implementation
      const saleData = await AppDataSource.query(
        `SELECT 
          ASS.assid, 
          ASS.pid, 
          ASS.sale_qty,
          ASD.asdtarget,
          P.pname,
          P.ptype,
          P.psize,
          B.brname as company
        FROM assignment_sale ASS 
        INNER JOIN assignment_detail ASD ON ASS.asdid = ASD.asdid 
        INNER JOIN products P ON ASS.pid = P.pid 
        LEFT JOIN brand B ON P.brid = B.brid
        WHERE ASS.asid = ? AND ASS.sale_date = ? AND ASD.asdstatus = ? 
        ORDER BY P.pname ASC`,
        [asid, dateString, 0]
      );

      // Transform data to match frontend format
      const products = saleData.map((item: any) => ({
        company: item.company || "",
        product_name: item.pname || "",
        variant: item.ptype || "",
        size: item.psize || null,
        soldItem: parseInt(item.sale_qty) || 0,
        assid: item.assid,
      }));

      const attendance = await attendanceRepository.findOne({
        where: { uid, attendance_date: dateString },
      });

      return res.json({
        success: true,
        data: {
          status: attendance?.sale_status === 1 ? "posted" : "pending",
          products: products,
        },
        isPosted: attendance?.sale_status === 1,
      });
    } catch (error) {
      console.error("Get sale error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Save sale
   * POST /api/ba/sale/save
   */
  async saveSale(req: AuthRequest, res: Response) {
    try {
      const { products } = req.body;

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Products array is required",
        });
      }

      for (const product of products) {
        if (product.assid) {
          await assignmentSaleRepository.update(
            { assid: product.assid },
            { sale_qty: parseInt(String(product.soldItem || 0)) }
          );
        }
      }

      return res.json({
        success: true,
        message: "Sale data saved successfully",
      });
    } catch (error) {
      console.error("Save sale error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Post sale (lock)
   * POST /api/ba/sale/post
   */
  async postSale(req: AuthRequest, res: Response) {
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

      for (const product of products) {
        if (product.assid) {
          await assignmentSaleRepository.update(
            { assid: product.assid },
            { sale_qty: parseInt(String(product.soldItem || 0)) }
          );
        }
      }

      await attendanceRepository.update(
        { uid, attendance_date: dateString },
        { sale_status: 1 }
      );

      return res.json({
        success: true,
        message: "Sale data posted successfully",
      });
    } catch (error) {
      console.error("Post sale error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get attendance history
   * GET /api/ba/attendance
   */
  async getAttendance(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const skip = (page - 1) * pageSize;

      const [attendance, total] = await attendanceRepository.findAndCount({
        where: { uid },
        order: { uatid: "DESC" },
        skip,
        take: pageSize,
      });

      // Transform data to match frontend format
      const records = attendance.map((att) => {
        return {
          id: att.uatid.toString(),
          date: att.attendance_date,
          timeIn: att.timein > 0 ? new Date(att.timein * 1000).toISOString() : null,
          timeOut: att.timeout > 0 ? new Date(att.timeout * 1000).toISOString() : null,
          qtyStatus: att.stock_status === 1 ? "posted" : "pending",
          priceStatus: att.price_status === 1 ? "posted" : "pending",
          salesStatus: att.sale_status === 1 ? "posted" : "pending",
          usershipStatus: att.usership_status === 1 ? "posted" : "pending",
          competitionStatus: att.comsale_status === 1 ? "posted" : "pending",
          samplesStatus: att.samples_status === 1 ? "posted" : "pending",
          dealsStatus: att.deals_sold_status === 1 ? "posted" : "pending",
        };
      });

      return res.json({
        success: true,
        data: {
          records: records,
          total: total,
        },
      });
    } catch (error) {
      console.error("Get attendance error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get sales performance data
   * GET /api/ba/sales-performance
   */
  async getSalesPerformance(req: AuthRequest, res: Response) {
    try {
      const uid = req.user!.uid;
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const firstDay = Math.floor(
        new Date(year, month - 1, 1).getTime() / 1000
      );
      const lastDay = Math.floor(
        new Date(year, month, 0, 23, 59, 59).getTime() / 1000
      );

      // Get assignment with relations
      const assignment = await assignmentRepository.findOne({
        where: { uid, asstatus: 0 },
        relations: ["store", "brand", "user"],
      });

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: "No active assignment found",
        });
      }

      // Get monthly sales
      const monthlySales = await assignmentSaleRepository
        .createQueryBuilder("sale")
        .select("SUM(sale.sale_qty)", "total_sale")
        .where("sale.uid = :uid", { uid })
        .andWhere("sale.asid = :asid", { asid: assignment.asid })
        .andWhere("sale.assdate BETWEEN :firstDay AND :lastDay", {
          firstDay,
          lastDay,
        })
        .getRawOne();

      // Get working days count
      const workingDays = await attendanceRepository.count({
        where: {
          uid,
          asid: assignment.asid,
          timein: Between(1, lastDay),
        },
      });

      // Calculate metrics
      const totalSale = parseFloat(monthlySales.total_sale) || 0;
      const monthlyTarget = assignment.storetarget * 26;
      const targetTillDate = workingDays * assignment.storetarget;
      const dailySale = workingDays > 0 ? totalSale / workingDays : 0;
      const dailyAchievement =
        assignment.storetarget > 0
          ? (dailySale / assignment.storetarget) * 100
          : 0;
      const monthlyAchievement =
        monthlyTarget > 0 ? (totalSale / monthlyTarget) * 100 : 0;
      const remainingTarget = monthlyTarget - totalSale;

      return res.json({
        success: true,
        data: {
          baName: assignment.user.fullname,
          storeName: assignment.store.store_name,
          targetPerDay: assignment.storetarget,
          monthlyTarget,
          targetTillDate,
          totalSales: totalSale,
          dailyAchievementPercent: Math.round(dailyAchievement),
          mtdAchievementPercent: Math.round(monthlyAchievement),
          perDayAvg: Math.round(dailySale),
          remainingTarget,
        },
      });
    } catch (error) {
      console.error("Get sales performance error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
