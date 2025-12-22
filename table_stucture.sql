-- -------------------------------------------------------------
-- TablePlus 6.3.2(586)
--
-- https://tableplus.com/
--
-- Database: hnd440_sentient
-- Generation Time: 2025-12-05 20:46:34.3090
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `area` (
  `id` int NOT NULL,
  `area` varchar(150) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `assignment_detail` (
  `asdid` int NOT NULL,
  `asid` int NOT NULL DEFAULT '0',
  `brid` int NOT NULL DEFAULT '0',
  `pid` int NOT NULL DEFAULT '0',
  `asdtarget` decimal(8,2) NOT NULL DEFAULT '0.00',
  `asdstatus` tinyint(1) NOT NULL DEFAULT '0',
  `asddate` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `assignment_sale` (
  `assid` int NOT NULL,
  `uid` int NOT NULL DEFAULT '0',
  `asdid` int NOT NULL DEFAULT '0',
  `asid` int NOT NULL DEFAULT '0',
  `brid` int NOT NULL DEFAULT '0',
  `pid` int NOT NULL DEFAULT '0',
  `sale_date` varchar(25) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `stock_qty` int NOT NULL DEFAULT '0',
  `sale_price` int NOT NULL DEFAULT '0',
  `sale_qty` int NOT NULL DEFAULT '0',
  `sale_target` int NOT NULL DEFAULT '0',
  `stock_type` varchar(2) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `asslat` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `asslong` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `assstatus` tinyint(1) NOT NULL DEFAULT '0',
  `assdate` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `assignments` (
  `asid` int NOT NULL,
  `stid` int NOT NULL DEFAULT '0',
  `brid` int NOT NULL DEFAULT '0',
  `uid` int NOT NULL DEFAULT '0',
  `asshift` varchar(35) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `asoffday` varchar(35) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `asbreaktime_from` varchar(10) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '00:00',
  `asbreaktime_to` varchar(10) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '00:00',
  `asstarttime` varchar(10) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '00:00',
  `asofftime` varchar(10) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '00:00',
  `storetarget` int NOT NULL DEFAULT '0',
  `supuid` int NOT NULL DEFAULT '0',
  `sampletarget` int NOT NULL DEFAULT '0',
  `dealtarget` int NOT NULL DEFAULT '0',
  `sample_status` tinyint(1) NOT NULL DEFAULT '0',
  `deal_status` tinyint(1) NOT NULL DEFAULT '0',
  `distance_limit` int NOT NULL DEFAULT '0',
  `unassign_date` int NOT NULL DEFAULT '0',
  `vacant_remarks` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `asstatus` tinyint(1) NOT NULL DEFAULT '0',
  `asdate` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `attendance_log` (
  `atlid` int NOT NULL,
  `attendance_date` varchar(25) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `uid` int NOT NULL DEFAULT '0',
  `app_id` varchar(25) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `atimage` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `atldate` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `attendance_type` (
  `attid` int NOT NULL,
  `attendance_type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `attendance_code` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `attendance_value` varchar(3) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `brand` (
  `brid` int NOT NULL,
  `cid` int NOT NULL DEFAULT '0',
  `company_name` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `brname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `brstatus` tinyint(1) NOT NULL DEFAULT '0',
  `brdate` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `category` (
  `cid` int NOT NULL,
  `category` varchar(75) COLLATE utf8mb4_general_ci NOT NULL,
  `cstatus` tinyint(1) NOT NULL,
  `cdate` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `cbrand` (
  `cbrid` int NOT NULL,
  `cbrname` varchar(150) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `cbrstatus` tinyint(1) NOT NULL DEFAULT '0',
  `cbrdate` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `cities` (
  `citid` int NOT NULL,
  `city_code` varchar(35) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `city_name` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `region` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `tier` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `citstatus` tinyint(1) NOT NULL DEFAULT '0',
  `citdate` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `com_brand` (
  `combrid` int NOT NULL,
  `brid` int NOT NULL DEFAULT '0',
  `cbrid` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `hrs` (
  `hrs` varchar(2) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `locations` (
  `lid` int NOT NULL,
  `lname` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `llat` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `llong` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `lstatus` tinyint(1) NOT NULL DEFAULT '0',
  `ldate` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `logdetail` (
  `logdid` int NOT NULL,
  `logdate` int NOT NULL,
  `deletedate` int NOT NULL,
  `detail` varchar(250) NOT NULL,
  `date` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `logreport` (
  `logid` int NOT NULL,
  `uid` int NOT NULL,
  `ip` varchar(35) NOT NULL,
  `logdate` int NOT NULL,
  `deletedate` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `mins` (
  `mins` varchar(2) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `products` (
  `pid` int NOT NULL,
  `brid` int NOT NULL DEFAULT '0',
  `cid` int NOT NULL DEFAULT '0',
  `pname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `sku` varchar(150) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `ptype` varchar(35) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `psize` varchar(35) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `pprice` decimal(8,2) NOT NULL DEFAULT '0.00',
  `unit_type` varchar(35) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `pweight` decimal(8,2) NOT NULL DEFAULT '0.00',
  `pstatus` tinyint(1) NOT NULL DEFAULT '0',
  `pdate` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `region` (
  `regid` int NOT NULL,
  `region` varchar(150) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `regstatus` tinyint(1) NOT NULL DEFAULT '0',
  `regdate` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `rights` (
  `rightid` int NOT NULL,
  `uid` int NOT NULL DEFAULT '0',
  `bulk_brands` tinyint(1) NOT NULL DEFAULT '0',
  `bulk_products` tinyint(1) NOT NULL DEFAULT '0',
  `bulk_stores` tinyint(1) NOT NULL DEFAULT '0',
  `bulk_ba` tinyint(1) NOT NULL DEFAULT '0',
  `bulk_supervisor` tinyint(1) NOT NULL DEFAULT '0',
  `add_category` tinyint(1) NOT NULL DEFAULT '0',
  `edit_category` tinyint(1) NOT NULL DEFAULT '0',
  `delete_category` tinyint(1) NOT NULL DEFAULT '0',
  `add_brand` tinyint(1) NOT NULL DEFAULT '0',
  `edit_brand` tinyint(1) NOT NULL DEFAULT '0',
  `delete_brand` tinyint(1) NOT NULL DEFAULT '0',
  `add_cbrand` tinyint(1) NOT NULL DEFAULT '0',
  `edit_cbrand` tinyint(1) NOT NULL DEFAULT '0',
  `delete_cbrand` tinyint(1) NOT NULL DEFAULT '0',
  `add_product` tinyint(1) NOT NULL DEFAULT '0',
  `edit_product` tinyint(1) NOT NULL DEFAULT '0',
  `delete_product` tinyint(1) NOT NULL DEFAULT '0',
  `add_survey` tinyint(1) NOT NULL DEFAULT '0',
  `edit_survey` tinyint(1) NOT NULL DEFAULT '0',
  `delete_survey` tinyint(1) NOT NULL DEFAULT '0',
  `add_area` tinyint(1) NOT NULL DEFAULT '0',
  `edit_area` tinyint(1) NOT NULL DEFAULT '0',
  `delete_area` tinyint(1) NOT NULL DEFAULT '0',
  `add_city` tinyint(1) NOT NULL DEFAULT '0',
  `edit_city` tinyint(1) NOT NULL DEFAULT '0',
  `delete_city` tinyint(1) NOT NULL DEFAULT '0',
  `add_schain` tinyint(1) NOT NULL DEFAULT '0',
  `edit_schain` tinyint(1) NOT NULL DEFAULT '0',
  `delete_schain` tinyint(1) NOT NULL DEFAULT '0',
  `add_store` tinyint(1) NOT NULL DEFAULT '0',
  `edit_store` tinyint(1) NOT NULL DEFAULT '0',
  `delete_store` tinyint(1) NOT NULL DEFAULT '0',
  `add_ba` tinyint(1) NOT NULL DEFAULT '0',
  `edit_ba` tinyint(1) NOT NULL DEFAULT '0',
  `delete_ba` tinyint(1) NOT NULL DEFAULT '0',
  `ba_attendance_remarks` tinyint(1) NOT NULL DEFAULT '0',
  `add_assignment` tinyint(1) NOT NULL DEFAULT '0',
  `edit_assignment` tinyint(1) NOT NULL DEFAULT '0',
  `delete_assignment` tinyint(1) NOT NULL DEFAULT '0',
  `add_supervisor` tinyint(1) NOT NULL DEFAULT '0',
  `edit_supervisor` tinyint(1) NOT NULL DEFAULT '0',
  `delete_supervisor` tinyint(1) NOT NULL DEFAULT '0',
  `activation_report` tinyint(1) NOT NULL DEFAULT '0',
  `ba_data_report` tinyint(1) NOT NULL DEFAULT '0',
  `daily_sale_report` tinyint(1) NOT NULL DEFAULT '0',
  `attendance_report` tinyint(1) NOT NULL DEFAULT '0',
  `sales_report` tinyint(1) NOT NULL DEFAULT '0',
  `stock_report` tinyint(1) NOT NULL DEFAULT '0',
  `price_report` tinyint(1) NOT NULL DEFAULT '0',
  `performance_report` tinyint(1) NOT NULL DEFAULT '0',
  `survey_report` tinyint(1) NOT NULL DEFAULT '0',
  `usership_report` tinyint(1) NOT NULL DEFAULT '0',
  `visit_report` tinyint(1) NOT NULL DEFAULT '0',
  `visit_summary_report` tinyint(1) NOT NULL DEFAULT '0',
  `store_wise_visit_report` tinyint(1) NOT NULL DEFAULT '0',
  `supervisor_attendance_report` tinyint(1) NOT NULL DEFAULT '0',
  `data_input_report` tinyint(1) NOT NULL DEFAULT '0',
  `analysis_report` tinyint(1) NOT NULL DEFAULT '0',
  `login_report` tinyint(1) NOT NULL DEFAULT '0',
  `client_activation_report` tinyint(1) NOT NULL DEFAULT '0',
  `udate` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `skills` (
  `id` int NOT NULL,
  `skill` varchar(150) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `store` (
  `stid` int NOT NULL,
  `store_code` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `store_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `store_address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `unique_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `area` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `city` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `chain_store` varchar(150) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `channel` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `stcategory` varchar(150) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `noc` tinyint(1) NOT NULL DEFAULT '0',
  `ba_card` tinyint(1) NOT NULL DEFAULT '0',
  `charges` decimal(8,2) NOT NULL DEFAULT '0.00',
  `amount` decimal(8,2) NOT NULL DEFAULT '0.00',
  `stlat` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `stlong` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `open_time` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0:00',
  `close_time` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0:00',
  `off_day` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `break_from` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0:00',
  `break_to` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0:00',
  `uniform` varchar(25) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `scarf` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `badge` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `data_sheet` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `device` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `store_card` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `ststatus` tinyint(1) NOT NULL DEFAULT '0',
  `stdate` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `store_chain` (
  `stcid` int NOT NULL,
  `store_chain` varchar(150) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `stcstatus` tinyint(1) NOT NULL DEFAULT '0',
  `stcdate` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `su_attendance` (
  `suatid` int NOT NULL,
  `uid` int NOT NULL,
  `suat_date` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `suatlat` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `suatlong` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `suattimein` int NOT NULL DEFAULT '0',
  `suatremarks` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `suatapp_id` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `suatstatus` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `survey` (
  `surid` int NOT NULL,
  `brid` int NOT NULL DEFAULT '0',
  `surtitle` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `surdescription` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `surstatus` tinyint(1) NOT NULL DEFAULT '0',
  `surdate` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `survey_detail` (
  `surdid` int NOT NULL,
  `surid` int NOT NULL DEFAULT '0',
  `brid` int NOT NULL DEFAULT '0',
  `surtype` tinyint(1) NOT NULL DEFAULT '0',
  `surfield` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' '
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `survey_options` (
  `suroid` int NOT NULL,
  `surdid` int NOT NULL DEFAULT '0',
  `suroption` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' '
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `survey_record` (
  `surrid` int NOT NULL,
  `surid` int NOT NULL DEFAULT '0',
  `asid` int NOT NULL DEFAULT '0',
  `uid` int NOT NULL DEFAULT '0',
  `surrdate` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `survey_record_detail` (
  `surrdid` int NOT NULL,
  `surrid` int NOT NULL DEFAULT '0',
  `surdfield` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `surdvalue` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' '
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `tmp_survey_record` (
  `tmpid` int NOT NULL,
  `surid` int NOT NULL DEFAULT '0',
  `surfield` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `survalue` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' '
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `user_attendance` (
  `uatid` int NOT NULL,
  `uid` int NOT NULL DEFAULT '0',
  `asid` int NOT NULL DEFAULT '0',
  `attendance_date` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `store_starttime` varchar(10) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0:00',
  `store_offtime` varchar(10) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0:00',
  `timein` int NOT NULL DEFAULT '0',
  `timein_image` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `timein_lat` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `timein_long` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `timeout` int NOT NULL DEFAULT '0',
  `timeout_image` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `timeout_lat` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `timeout_long` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `total_hrs` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `stock_status` tinyint(1) NOT NULL DEFAULT '0',
  `price_status` tinyint(1) NOT NULL DEFAULT '0',
  `sale_status` tinyint(1) NOT NULL DEFAULT '0',
  `usership_status` tinyint(1) NOT NULL DEFAULT '0',
  `comsale_status` tinyint(1) NOT NULL DEFAULT '0',
  `deals_sold_status` tinyint(1) NOT NULL DEFAULT '0',
  `samples_status` tinyint(1) NOT NULL DEFAULT '0',
  `uatdeals_title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'None',
  `uatdeals` int NOT NULL DEFAULT '0',
  `uatsamples_title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'None',
  `uatsamples` int NOT NULL DEFAULT '0',
  `uatremarks` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `uatcode` varchar(5) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `uatvalue` varchar(3) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `uatcomments` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `uatapp_id` varchar(75) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `uatstatus` tinyint(1) NOT NULL DEFAULT '0',
  `uatdate` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `users` (
  `uid` int NOT NULL,
  `lid` int NOT NULL DEFAULT '0',
  `utype` int NOT NULL DEFAULT '0',
  `su_no` int NOT NULL DEFAULT '0',
  `su_attendance` tinyint(1) NOT NULL DEFAULT '0',
  `ba_no` varchar(11) NOT NULL DEFAULT '0',
  `username` varchar(50) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `market_name` varchar(150) NOT NULL DEFAULT '',
  `father_name` varchar(150) NOT NULL DEFAULT '',
  `fullname` varchar(150) NOT NULL DEFAULT '',
  `adopted_name` varchar(150) NOT NULL DEFAULT '',
  `email` varchar(75) NOT NULL DEFAULT '',
  `mobileno1` varchar(50) NOT NULL DEFAULT '',
  `mobileno2` varchar(50) NOT NULL DEFAULT '',
  `mobileno3` varchar(50) NOT NULL DEFAULT '',
  `emergencyno` varchar(50) NOT NULL DEFAULT '',
  `education` varchar(75) NOT NULL DEFAULT '',
  `skills` varchar(75) NOT NULL DEFAULT '',
  `marketing_exp` varchar(75) NOT NULL DEFAULT '',
  `covid_cert` tinyint(1) NOT NULL DEFAULT '0',
  `marital_status` varchar(50) NOT NULL DEFAULT '',
  `user_image` varchar(75) NOT NULL DEFAULT '',
  `image1` varchar(150) NOT NULL DEFAULT '',
  `image2` varchar(150) NOT NULL DEFAULT '',
  `permanentaddress` longtext NOT NULL,
  `cnic_no` varchar(50) NOT NULL DEFAULT '',
  `cnic_front` varchar(150) NOT NULL DEFAULT '',
  `cnic_back` varchar(150) NOT NULL DEFAULT '',
  `address` varchar(255) NOT NULL DEFAULT '',
  `area` varchar(150) NOT NULL DEFAULT '',
  `city` varchar(150) NOT NULL DEFAULT '',
  `dob` varchar(150) NOT NULL DEFAULT '',
  `religion` varchar(150) NOT NULL DEFAULT '',
  `cnic_image` varchar(150) NOT NULL DEFAULT '',
  `imtiaz_work` tinyint(1) NOT NULL DEFAULT '0',
  `imtiaz_noc` varchar(150) NOT NULL DEFAULT '',
  `bank_iban` varchar(150) NOT NULL DEFAULT '',
  `bank_name` varchar(150) NOT NULL DEFAULT '',
  `blacklist_status` tinyint(1) NOT NULL DEFAULT '0',
  `blacklist_reason` varchar(255) NOT NULL DEFAULT '',
  `baform_image` varchar(150) NOT NULL DEFAULT '',
  `leave_reason` varchar(255) NOT NULL DEFAULT '',
  `dol` int NOT NULL DEFAULT '0',
  `app_id` varchar(75) NOT NULL DEFAULT '',
  `ustatus` tinyint(1) NOT NULL DEFAULT '0',
  `udate` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `usership` (
  `asuid` int NOT NULL,
  `uid` int NOT NULL DEFAULT '0',
  `asid` int NOT NULL DEFAULT '0',
  `brid` int NOT NULL DEFAULT '0',
  `sale_date` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `sale_status` tinyint(1) NOT NULL DEFAULT '0',
  `asustatus` tinyint(1) NOT NULL DEFAULT '0',
  `asudate` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usership_detail` (
  `asudid` int NOT NULL,
  `asuid` int NOT NULL DEFAULT '0',
  `uid` int NOT NULL DEFAULT '0',
  `brid` int NOT NULL DEFAULT '0',
  `cbrid` int NOT NULL DEFAULT '0',
  `interception` int NOT NULL DEFAULT '0',
  `productive` int NOT NULL DEFAULT '0',
  `com_sale` int NOT NULL DEFAULT '0',
  `sale_date` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ' ',
  `asusale` int NOT NULL DEFAULT '0',
  `asuddate` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `vacant_remarks` (
  `id` int NOT NULL,
  `vacant_remarks` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;