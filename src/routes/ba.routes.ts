import { Router } from "express";
import { BAController } from "../controllers/ba.controller";
import { UsershipController } from "../controllers/usership.controller";
import { DealsSamplesController } from "../controllers/deals-samples.controller";
import { authMiddleware, baOnly } from "../middleware/auth.middleware";

const router = Router();
const baController = new BAController();
const usershipController = new UsershipController();
const dealsSamplesController = new DealsSamplesController();

// Apply auth middleware to all routes
router.use(authMiddleware);
router.use(baOnly);

/**
 * @route   GET /api/ba/dashboard
 * @desc    Get BA dashboard data
 * @access  Private (BA only)
 */
router.get("/dashboard", (req, res) => baController.getDashboard(req, res));

/**
 * @route   GET /api/ba/stock
 * @desc    Get stock quantity data
 * @access  Private (BA only)
 */
router.get("/stock", (req, res) => baController.getStock(req, res));

/**
 * @route   POST /api/ba/stock/save
 * @desc    Save stock quantity
 * @access  Private (BA only)
 */
router.post("/stock/save", (req, res) => baController.saveStock(req, res));

/**
 * @route   POST /api/ba/stock/post
 * @desc    Post stock quantity (lock)
 * @access  Private (BA only)
 */
router.post("/stock/post", (req, res) => baController.postStock(req, res));

/**
 * @route   GET /api/ba/price
 * @desc    Get price data
 * @access  Private (BA only)
 */
router.get("/price", (req, res) => baController.getPrice(req, res));

/**
 * @route   POST /api/ba/price/save
 * @desc    Save price
 * @access  Private (BA only)
 */
router.post("/price/save", (req, res) => baController.savePrice(req, res));

/**
 * @route   POST /api/ba/price/post
 * @desc    Post price (lock)
 * @access  Private (BA only)
 */
router.post("/price/post", (req, res) => baController.postPrice(req, res));

/**
 * @route   GET /api/ba/sale
 * @desc    Get sale data
 * @access  Private (BA only)
 */
router.get("/sale", (req, res) => baController.getSale(req, res));

/**
 * @route   POST /api/ba/sale/save
 * @desc    Save sale
 * @access  Private (BA only)
 */
router.post("/sale/save", (req, res) => baController.saveSale(req, res));

/**
 * @route   POST /api/ba/sale/post
 * @desc    Post sale (lock)
 * @access  Private (BA only)
 */
router.post("/sale/post", (req, res) => baController.postSale(req, res));

/**
 * @route   GET /api/ba/attendance
 * @desc    Get attendance history
 * @access  Private (BA only)
 */
router.get("/attendance", (req, res) => baController.getAttendance(req, res));

/**
 * @route   GET /api/ba/sales-performance
 * @desc    Get sales performance data
 * @access  Private (BA only)
 */
router.get("/sales-performance", (req, res) =>
  baController.getSalesPerformance(req, res)
);

/**
 * @route   GET /api/ba/usership
 * @desc    Get usership data
 * @access  Private (BA only)
 */
router.get("/usership", (req, res) => usershipController.getUsership(req, res));

/**
 * @route   POST /api/ba/usership/save
 * @desc    Save usership data
 * @access  Private (BA only)
 */
router.post("/usership/save", (req, res) =>
  usershipController.saveUsership(req, res)
);

/**
 * @route   POST /api/ba/usership/post
 * @desc    Post usership data (lock)
 * @access  Private (BA only)
 */
router.post("/usership/post", (req, res) =>
  usershipController.postUsership(req, res)
);

/**
 * @route   GET /api/ba/competition-sales
 * @desc    Get competition sales data
 * @access  Private (BA only)
 */
router.get("/competition-sales", (req, res) =>
  usershipController.getCompetitionSales(req, res)
);

/**
 * @route   POST /api/ba/competition-sales/save
 * @desc    Save competition sales
 * @access  Private (BA only)
 */
router.post("/competition-sales/save", (req, res) =>
  usershipController.saveCompetitionSales(req, res)
);

/**
 * @route   POST /api/ba/competition-sales/post
 * @desc    Post competition sales (lock)
 * @access  Private (BA only)
 */
router.post("/competition-sales/post", (req, res) =>
  usershipController.postCompetitionSales(req, res)
);

/**
 * @route   GET /api/ba/deals
 * @desc    Get deals data
 * @access  Private (BA only)
 */
router.get("/deals", (req, res) => dealsSamplesController.getDeals(req, res));

/**
 * @route   POST /api/ba/deals/save
 * @desc    Save deals data
 * @access  Private (BA only)
 */
router.post("/deals/save", (req, res) =>
  dealsSamplesController.saveDeals(req, res)
);

/**
 * @route   POST /api/ba/deals/post
 * @desc    Post deals data (lock)
 * @access  Private (BA only)
 */
router.post("/deals/post", (req, res) =>
  dealsSamplesController.postDeals(req, res)
);

/**
 * @route   GET /api/ba/samples
 * @desc    Get samples data
 * @access  Private (BA only)
 */
router.get("/samples", (req, res) =>
  dealsSamplesController.getSamples(req, res)
);

/**
 * @route   POST /api/ba/samples/save
 * @desc    Save samples data
 * @access  Private (BA only)
 */
router.post("/samples/save", (req, res) =>
  dealsSamplesController.saveSamples(req, res)
);

/**
 * @route   POST /api/ba/samples/post
 * @desc    Post samples data (lock)
 * @access  Private (BA only)
 */
router.post("/samples/post", (req, res) =>
  dealsSamplesController.postSamples(req, res)
);

export default router;
