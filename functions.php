<?php
	include("connect.php");
		
	function clean($string)
	{
	   $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
	   return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
	}

	function distance($lat1, $lon1, $lat2, $lon2, $unit)
    {
        if (($lat1 == $lat2) && ($lon1 == $lon2)) {
        	return 0;
        }	
        else {
            $theta = is_numeric($lon1) - is_numeric($lon2);
            $dist = sin(deg2rad(is_numeric($lat1))) * sin(deg2rad(is_numeric($lat2))) +  cos(deg2rad(is_numeric($lat1))) * cos(deg2rad(is_numeric($lat2))) * cos(deg2rad(is_numeric($theta)));
            $dist = acos($dist);
            $dist = rad2deg($dist);
            $miles = $dist * 60 * 1.1515;
            $unit = strtoupper($unit);
        
            if ($unit == "K") {
              return ($miles * 1.609344);
            } else if ($unit == "N") {
              return ($miles * 0.8684);
            } else {
              return $miles;
            }
          }
    }

	function resize_image($file, $w, $h, $crop=FALSE)
	{
	    list($width, $height) = getimagesize($file);
	    $r = $width / $height;
	    if ($crop) {
	        if ($width > $height) {
	            $width = ceil($width-($width*abs($r-$w/$h)));
	        } else {
	            $height = ceil($height-($height*abs($r-$w/$h)));
	        }
	        $newwidth = $w;
	        $newheight = $h;
	    } else {
	        if ($w/$h > $r) {
	            $newwidth = $h*$r;
	            $newheight = $h;
	        } else {
	            $newheight = $w/$r;
	            $newwidth = $w;
	        }
	    }
	    $src = imagecreatefromjpeg($file);
	    $dst = imagecreatetruecolor($newwidth, $newheight);
	    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);

	    return $dst;
	}

	function send_email($from,$from_title,$to,$subject,$message)
	{
		require("../phpmailer/PHPMailerAutoload.php");

		$mail = new PHPMailer;
		   
		$mail->setFrom($from, $from_title);
		$mail->addAddress($to);     // Add a recipient
		//$mail->addAddress('mohsinfighter@gmail.com');            // Name is optional
		//  $mail->addReplyTo('info@example.com', 'Information');
		//  $mail->addCC('cc@example.com');
		$mail->addBCC('info@corios.com.pk');

		//  $mail->addAttachment($pdf_file_name,$pdf_file_name);  // Add attachments
		//  $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
		$mail->isHTML(true);                                  	  // Set email format to HTML

		$mail->Subject = $subject;
		$mail->Body    = $message;
		$mail->AltBody = "This is the body in plain text for non-HTML mail clients";

	  	if(!$mail->send()) {
	    	echo 'Message could not be sent.';
	    	echo 'Mailer Error: ' . $mail->ErrorInfo;
	  	} else {
	    	echo 'Message sent successfully.';
	  	} 
	}

	function sup_loggedin()
	{
		 if(!isset($_COOKIE['sup']) && !isset($_SESSION['sup']))
		 {
	      setcookie('sup', '', -1, '/');
				setcookie('suptype', '', -1, '/'); 
				
				unset($_SESSION['sup']);
				unset($_SESSION['suptype']);
				
				unset($_COOKIE['sup']);
				unset($_COOKIE['suptype']);
				
				header("Location: index.php?");
		 		die;
		 }
	}

	function ba_loggedin()
	{
		 if(!isset($_COOKIE['ba']) || !isset($_SESSION['ba']))
		 {
		 		setcookie('ba', '', -1, '/');
				setcookie('batype', '', -1, '/'); 
				setcookie('ba_asid', '', -1, '/'); 
				
				unset($_SESSION['ba']);
				unset($_SESSION['batype']);
				unset($_SESSION['ba_asid']);

				unset($_COOKIE['ba']);
				unset($_COOKIE['batype']);
				unset($_COOKIE['ba_asid']);

		 		header("Location: index.php?");
		 		die;
		 }
		 else
		 {
		 		setcookie('tmp_ba', '', -1, '/');
				setcookie('tmp_batype', '', -1, '/'); 
				setcookie('tmp_ba_asid', '', -1, '/'); 
				
				unset($_SESSION['tmp_ba']);
				unset($_SESSION['tmp_batype']);
				unset($_SESSION['tmp_ba_asid']);

				unset($_COOKIE['tmp_ba']);
				unset($_COOKIE['tmp_batype']);
				unset($_COOKIE['tmp_ba_asid']);
		 }
	}
	
	function log_entry($log)
	{
		global $db;
		global $URL;
	    $LogQuery = $db->prepare("INSERT INTO logdetail(logdate , deletedate  , detail , date) VALUES(? , ? , ? , ?)");
	    $LogValues = array($_SESSION['logdate'] , $_SESSION['deletedate'] , $log , time());
	    $LogQuery->execute($LogValues);
	}

	function submit_daily_ba_log($db,$URL)
  {
  	$at_date = date("d-m-Y");
  	$at_weekday = date("l");
    /*/// check for active assignment
    $asquery = $db->prepare("SELECT * FROM assignments WHERE asstatus = ?");
    $asquery->execute(array(0));
    if($asquery->rowCount() > 0)
    {
      while($asrow = $asquery->fetch())
      {
      	$asid = $asrow['asid'];
      	$uid = $asrow['uid'];
      	$asoffday = $asrow['asoffday'];
      	$asstarttime = $asrow['asstarttime'];
      	$asofftime = $asrow['asofftime'];
      	
      	if($uid !=0)
      	{
    		    // check attendance record
		      $attquery = $db->prepare("SELECT uid, attendance_date FROM user_attendance WHERE uid = ? AND attendance_date = ?");
		      $attquery->execute(array($uid, $at_date));
		      if($attquery->rowCount() == 0)
		      {
		      	$uaquery = $db->prepare("INSERT INTO user_attendance(uid, asid, attendance_date, store_starttime, store_offtime, uatdate) VALUES(?,?,?,?,?,?)");
		      	$uavalues = array($uid, $asid, $at_date, $asstarttime, $asofftime, time());
		      	$uaquery->execute($uavalues);
		      	// create attendance record
		        $asdquery = $db->prepare("SELECT asdid, asid, brid, pid, asdtarget FROM assignment_detail WHERE asid = ?");
		        $asdquery->execute(array($asid));
		        while($asdrow = $asdquery->fetch())
		        {
		        		$asdid = $asdrow['asdid'];
		        		$asid = $asdrow['asid'];
		        		$brid = $asdrow['brid'];
		        		$pid = $asdrow['pid'];
		        		$sale_target = $asdrow['asdtarget'];

		        		// create ba assignment sale record
				        $uaquery = $db->prepare("INSERT INTO assignment_sale(uid, asdid, asid, brid, pid, sale_date, sale_target, assdate) VALUES(?,?,?,?,?,?,?,?)");
				        $uavalues = array($uid, $asdid, $asid, $brid, $pid, $at_date, $sale_target, time());
				        $uaquery->execute($uavalues);			
		        }
		        
		        // Usership Section
		        $comquery = $db->prepare("SELECT brid, cbrid FROM com_brand WHERE brid = ? ORDER BY combrid ASC");
		        $comquery->execute(array($brid));
		        if($comquery->rowCount() > 0)
		        {
	        		// create usership records
			        $ushquery = $db->prepare("INSERT INTO usership(uid, asid, brid, sale_date, asudate) VALUES(?,?,?,?,?)");
			      	$ushvalues = array($uid, $asid, $brid, $at_date, time());
			      	$ushquery->execute($ushvalues);
			      	$asuid = $db->lastInsertId();

	        		while($comrow = $comquery->fetch())
			        {
			        		$cbrid = $comrow['cbrid'];
			        		// create usership detail
			        	  $ushdquery = $db->prepare("INSERT INTO usership_detail(asuid, uid, brid, cbrid, sale_date, asuddate) VALUES(?,?,?,?,?,?)");
					        $ushdvalues = array($asuid, $uid, $brid, $cbrid, $at_date, time());
					        $ushdquery->execute($ushdvalues);
			        }
		        }
		      }
		      
		      //// Supervisor Visit Record Generation
		      $visitquery = $db->prepare("SELECT uid, vdate FROM visits WHERE uid = ? AND vdate = ?");
		      $visitquery->execute(array($uid, $at_timestamp));
		      if($visitquery->rowCount() == 0)
		      {
		      		$vquery = $db->prepare("INSERT INTO visits(uid, stid, brid, vdate) VALUES(?,?,?,?)");
		      		$vvalues = array($supuid, $stid, $brid, $at_timestamp);
		      		$vquery->execute($vvalues);
		      }
      	}
      }
    }*/
  }
	
  function do_login($db,$URL)
  {
    // Check if database connection is available
    if($db === null) {
      header("Location: index.php?err=5");
      exit();
    }
    
    $UserName = stripslashes($_REQUEST['txtUserName']);
    $Password = md5(stripslashes($_REQUEST['txtPassword']));
    $Type = 		$_REQUEST['cboType'];
    $at_date = date("d-m-Y");

    if($_REQUEST['hdnId'] != "")
    {
    		$app_id = $_REQUEST['hdnId'];
    		$appid = "&id=$app_id";
    }
    else
    {
    		$app_id = "";
    		$appid = "";
    }

    //echo($app_id);die;
    if(isset($_REQUEST['chkRemember'])) { $Remember = stripslashes($_REQUEST['chkRemember']); } else{ $Remember = 0; }

    $Query = $db->prepare("SELECT uid, utype, su_no, ba_no, username, password, fullname, app_id, ustatus, udate, lid, su_attendance FROM users WHERE username = ? AND password = ? AND utype = ? AND ustatus = ?");
    $values = array($UserName , $Password , $Type , 0);
    $Query->execute($values);
    if($Query->rowCount() > 0)
    {

      while($row = $Query->fetch())
      {
        $uid  = $row['uid'];
        $lid  = isset($row['lid']) ? $row['lid'] : 0;
        $su_attendance  = isset($row['su_attendance']) ? $row['su_attendance'] : 0;
        $utype  = $row['utype'];
        $user_app_id  = $row['app_id'];
      }
        
      /// app log entry

      $attlquery = $db->prepare("SELECT atlid, attendance_date, uid, app_id, atimage, atldate FROM attendance_log WHERE uid=? AND attendance_date=? ORDER BY atlid DESC LIMIT 0,1");
      $attlquery->execute(array($uid, $at_date));
      if($attlquery->rowCount() == 0)
      {
      		//echo("MOHSIN");die;
      		$atlquery = $db->prepare("INSERT INTO attendance_log(uid, attendance_date, app_id, atldate) VALUES(?,?,?,?)");
      		$atlquery->execute(array($uid, $at_date, $app_id, time()));
      }
      else
      {
      		//echo("RAZA $uid, $at_date");die;
      		while($atlrow = $attlquery->fetch())
      		{
      				$atldate = $atlrow['atldate'];
      		}		
      		$alt_diff = time() - $atldate;
      		if($alt_diff > 300)
      		{
      				$atlquery = $db->prepare("INSERT INTO attendance_log(uid, attendance_date, app_id, atldate) VALUES(?,?,?,?)");
      				$atlquery->execute(array($uid, $at_date, $app_id, time()));
      		}
      }
	      
      //echo($uid." / ".$app_id);die;
      if($app_id != "")
      {
	      /// assign app id if user has no app id yet
	      if($user_app_id == "")
	      {
	      		$uappquery = $db->prepare("UPDATE users SET app_id = ? WHERE uid = ?");
	      		$uappquery->execute(array($app_id, $uid));
	      }
	  	}
	      
      //echo($uid);die;
      if($utype == 4) /// BA Login
      {
	      /// check for active assignment
	      $asquery = $db->prepare("SELECT asid, stid, brid, uid, asshift, asoffday, asstarttime, asofftime FROM assignments WHERE uid = ? AND asstatus = ?");
	      $asquery->execute(array($uid,0));
	      if($asquery->rowCount() > 0)
	      {
	        $UserExpireDate = time()+18000;
	        while($asrow = $asquery->fetch())
	        {
	        	$asid = $asrow['asid'];
	        	$brid = $asrow['brid'];
	        	$asstarttime = $asrow['asstarttime'];
	        	$asofftime = $asrow['asofftime'];
	        }

	        // check attendance record
	        $attquery = $db->prepare("SELECT uid, attendance_date, timein FROM user_attendance WHERE uid = ? AND attendance_date = ?");
	        $attquery->execute(array($uid, $at_date));
	        if($attquery->rowCount() == 0)
	        {
	        	$uaquery = $db->prepare("INSERT INTO user_attendance(uid, asid, attendance_date, store_starttime, store_offtime, uatapp_id, uatdate) VALUES(?,?,?,?,?,?,?)");
	        	$uavalues = array($uid, $asid, $at_date, $asstarttime, $asofftime, $app_id, time());
	        	$uaquery->execute($uavalues);
	        	// create attendance record
		        $asdquery = $db->prepare("SELECT asdid, asid, brid, pid, asdtarget FROM assignment_detail WHERE asid = ?");
		        $asdquery->execute(array($asid));
		        while($asdrow = $asdquery->fetch())
		        {
		        		$asdid = $asdrow['asdid'];
		        		$asid = $asdrow['asid'];
		        		$brid = $asdrow['brid'];
		        		$pid = $asdrow['pid'];
		        		$sale_target = $asdrow['asdtarget'];

		        		// create ba assignment sale record
				        $uaquery = $db->prepare("INSERT INTO assignment_sale(uid, asdid, asid, brid, pid, sale_date, sale_target, assdate) VALUES(?,?,?,?,?,?,?,?)");
				        $uavalues = array($uid, $asdid, $asid, $brid, $pid, $at_date, $sale_target, time());
				        $uaquery->execute($uavalues);			
		        }
	        }
	        else
	        {
	        	while($attrow = $attquery->fetch())
	        	{
	        		$timein = $attrow['timein'];
	        	}
	        	
	        	if($timein == 0)
	        	{
	        		$uaquery = $db->prepare("UPDATE user_attendance SET uatdate=? WHERE uid = ? AND attendance_date = ?");
	        		$uavalues = array(time(), $uid, $at_date);
	        		$uaquery->execute($uavalues);
	        	}
	        }

	        $us_query = $db->prepare("SELECT asuid, uid, asid, brid, sale_date, sale_status FROM usership WHERE uid = ? AND brid = ? AND sale_date = ?");
	        $us_query->execute(array($uid,$brid,$at_date));
	        if($us_query->rowCount() == 0)
	        {
	        		$comquery = $db->prepare("SELECT brid, cbrid FROM com_brand WHERE brid = ? ORDER BY combrid ASC");
			        $comquery->execute(array($brid));
			        if($comquery->rowCount() > 0)
			        {
		        		// create usership records
				        $ushquery = $db->prepare("INSERT INTO usership(uid, asid, brid, sale_date, asudate) VALUES(?,?,?,?,?)");
				      	$ushvalues = array($uid, $asid, $brid, $at_date, time());
				      	$ushquery->execute($ushvalues);
				      	$asuid = $db->lastInsertId();

		        		while($comrow = $comquery->fetch())
				        {
				        		$cbrid = $comrow['cbrid'];
				        		// create usership detail
				        	  $ushdquery = $db->prepare("INSERT INTO usership_detail(asuid, uid, brid, cbrid, sale_date, asuddate) VALUES(?,?,?,?,?,?)");
						        $ushdvalues = array($asuid, $uid, $brid, $cbrid, $at_date, time());
						        $ushdquery->execute($ushdvalues);
				        }
			        }		
	        }

	        setcookie("tmp_ba", $uid, time() + 64800, "/");       // 18 Hours
	        setcookie("tmp_batype", $utype, time() + 64800, "/"); // 18 Hours
	       	setcookie("tmp_ba_asid", $asid, time() + 64800, "/");// 18 Hours
	       	setcookie("tmp_appid", $app_id, time() + 64800, "/");// 18 Hours
	       
	        $_SESSION['tmp_ba_asid']   = $asid;
	        $_COOKIE['tmp_ba_asid']   = $asid; 

	        $_SESSION['tmp_ba']   = $uid;
	        $_COOKIE['tmp_ba']   = $uid;

	        $_SESSION['tmp_batype']   = $utype;
	        $_COOKIE['tmp_batype']   = $utype;

	        $_SESSION['tmp_appid']   = $app_id;
	        $_COOKIE['tmp_appid']   = $app_id;

	       	//echo($_COOKIE['tmp_user']);die;
	        $lat = stripslashes($_REQUEST['hdnlat']);
	        $long = stripslashes($_REQUEST['hdnlong']);

	      	//echo($uid." , ".$_SESSION['tmp_ba']." , ".$_COOKIE['tmp_ba']." , ".$_SESSION['tmp_batype']." , ".$_COOKIE['tmp_batype']." , ".$_SESSION['tmp_ba_asid']." , ".$_COOKIE['tmp_ba_asid']);die;
	        header ("Location: $URL/verify_location.php?lat=".$lat."&long=".$long."");
	        die;
	      }
	      else
	      {
	        header("Location: $URL/index.php?err=2");
	      }
	    }
	    else
	    { /// Supervisor Login
	  			setcookie("sup", $uid, time() + 64800, "/");       // 18 Hours
	        setcookie("suptype", $utype, time() + 64800, "/"); // 18 Hours
	        setcookie("sup_appid", $app_id, time() + 64800, "/"); // 18 Hours
	       
	        $_SESSION['sup']   = $uid;
	        $_COOKIE['sup']   = $uid;

	        $_SESSION['suptype']   = $utype;
	        $_COOKIE['suptype']   = $utype;

	        $_SESSION['sup_appid']   = $app_id;
	        $_COOKIE['sup_appid']   = $app_id;

	        header("Location: $URL/su_main.php?");
	  			// $suatquery = $db->prepare("SELECT * FROM su_attendance WHERE uid = ? AND suat_date = ?");
    			// $suatvalues = array($uid, $at_date);
    			// $suatquery->execute($suatvalues);
    			// if($suatquery->rowCount() == 0)
    			// {
    			// 		if($lid == 0 && $su_attendance == 0)
			  	// 		{
			  	// 				setcookie("sup", $uid, time() + 43200, "/");       // 12 Hours
					//         setcookie("suptype", $utype, time() + 43200, "/"); // 12 Hours
					       
					//         $_SESSION['sup']   = $uid;
					//         $_COOKIE['sup']   = $uid;

					//         $_SESSION['suptype']   = $utype;
					//         $_COOKIE['suptype']   = $utype;

					//         header("Location: $URL/su_main.php?");	
			  	// 		}
			  	// 		else
			  	// 		{
			  	// 				if($lid == 0 || $su_attendance == 0)
					//   			{
					//   					setcookie("sup", $uid, time() + 43200, "/");       // 12 Hours
					// 		        setcookie("suptype", $utype, time() + 43200, "/"); // 12 Hours
							       
					// 		        $_SESSION['sup']   = $uid;
					// 		        $_COOKIE['sup']   = $uid;

					// 		        $_SESSION['suptype']   = $utype;
					// 		        $_COOKIE['suptype']   = $utype;

					// 		        header("Location: $URL/su_main.php?");	
					//   			}

					//   			if($lid != 0 && $su_attendance != 0)
					//   			{
					//   					$lquery = $db->prepare("SELECT * FROM locations WHERE lid = ?");
					// 						$lquery->execute(array($lid));
					// 						while($lrow = $lquery->fetch())
					// 						{
					// 								$lname = $lrow['lname'];
					// 								$llat = $lrow['llat'];
					// 								$llong = $lrow['llong'];
					// 						}

					//   					$_SESSION['tmp_sup']   = $uid;
					// 		        $_SESSION['tmp_suptype']   = $utype;

					// 		        $su_lat = stripslashes($_REQUEST['hdnlat']);
					// 	 	   	    $su_long = stripslashes($_REQUEST['hdnlong']);
							        
					// 		        header("Location: $URL/verify_su_location.php?sulat=$su_lat&sulong=$su_long&llat=$llat&llong=$llong&lname=$lname");	
					//   			}
			  	// 		}

    			// }
    			// else
    			// {
	  			// 		setcookie("sup", $uid, time() + 43200, "/");       // 12 Hours
			    //     setcookie("suptype", $utype, time() + 43200, "/"); // 12 Hours
			       
			    //     $_SESSION['sup']   = $uid;
			    //     $_COOKIE['sup']   = $uid;

			    //     $_SESSION['suptype']   = $utype;
			    //     $_COOKIE['suptype']   = $utype;

			    //     header("Location: $URL/su_main.php?");	
	  			// }
	    }
    }
    else
    {
      header("Location: $URL/index.php?$appid&err=1");
    }
  }
  function do_verify_su_location($db,$URL,$lat,$long,$remarks)
  {
  	$at_date = date("d-m-Y");
    $date = time();

    // get last login app id

    $atlquery = $db->prepare("SELECT attendance_date, uid, app_id, atldate FROM attendance_log WHERE uid = ? AND attendance_date = ? ORDER BY atlid DESC LIMIT 0,1");
    $atlquery->execute(array($_COOKIE['sup'], $at_date));
    if($atlquery->rowCount() > 0)
    {
    		while($atlrow = $atlquery->fetch())
    		{
    			 $app_id = $atlrow['app_id'];
    		}
    }
    else
    {
    	 $app_id = "";
    }

    $suatquery = $db->prepare("INSERT INTO su_attendance(uid, suat_date, suatlat, suatlong, suattimein, suatremarks, suatapp_id) VALUES(?,?,?,?,?,?,?)");
    $suatvalues = array($_COOKIE['sup'], $at_date, $lat, $long, $date, $remarks, $app_id);

    if($suatquery->execute($suatvalues))
    {

    	/*$tmp_su = $_SESSION['tmp_sup'];
  		$tmp_sutype = 3;

  		setcookie("sup", $tmp_su, time() + 43200, "/");       // 12 Hours
      setcookie("suptype", $tmp_sutype, time() + 43200, "/"); // 12 Hours
     
      $_SESSION['sup']   = $tmp_su;
      $_COOKIE['sup']   = $tmp_su;

      $_SESSION['suptype']   = $tmp_sutype;
      $_COOKIE['suptype']   = $tmp_sutype;

      //echo("sup = ".$_SESSION['tmp_sup']);die;
      
      unset($_SESSION['tmp_sup']);
      unset($_SESSION['tmp_suptype']);*/

      header("Location: $URL/su_main.php?");
      die;
    }
  }

  function do_verify_location($db,$URL,$lat,$long)
  {
    header("Location: upload_selfie.php?lat=$lat&long=$long&err=1");
    die;

    /*$uatquery = $db->prepare("SELECT * FROM user_attendance WHERE uid = ? AND attendance_date = ?");
    $uatquery->execute(array($_SESSION['tmp_ba'], $at_date));
    while($uatrow = $uatquery->fetch())
    {
    		$uat_timein = $uatrow['timein'];
    }
    if($uat_timein == 0)
    {
    		$Query = $db->prepare("UPDATE user_attendance SET timein=?, timein_lat=?, timein_long=? WHERE uid=? AND attendance_date=?");
    		$Values = array($date,$lat, $long , $_SESSION['tmp_ba'], $at_date);
    }
    else
    {
    		$Query = $db->prepare("UPDATE user_attendance SET timein_lat=?, timein_long=? WHERE uid=? AND attendance_date=?");
    		$Values = array($lat, $long , $_SESSION['tmp_ba'], $at_date);
    }
    //echo("$lat, $long , ".$_SESSION['tmp_user']." , $at_date");die;
    if($Query->execute($Values))
    {
    	$tmp_ba = $_SESSION['tmp_ba'];
  		$tmp_batype = $_SESSION['tmp_batype'];
  		$tmp_ba_asid = $_SESSION['tmp_ba_asid'];

  		setcookie("ba", $tmp_ba, time() + (86400 * 30), "/"); // 86400 = 1 day
  		setcookie("batype", $tmp_batype, time() + (86400 * 30), "/"); // 86400 = 1 day
  		setcookie("ba_asid", $tmp_ba_asid, time() + (86400 * 30), "/"); // 86400 = 1 day

  		$_SESSION['ba'] = $tmp_ba;
      $_SESSION['batype'] = $tmp_batype;
      $_SESSION['ba_asid'] = $tmp_ba_asid;
      
      $_COOKIE['ba'] = $tmp_ba;
      $_COOKIE['batype'] = $tmp_batype;
      $_COOKIE['ba_asid'] = $tmp_ba_asid;


/*  	echo($_SESSION['ba']." / ".$_SESSION['batype']." / ".$_COOKIE['ba_asid']."<br>1<br>");
      echo($_SESSION['tmp_ba']." / ".$_SESSION['tmp_batype']." / ".$_SESSION['tmp_ba_asid']."<br><br>");
      die;
*/
      //header("Location: main.php");
      //die;
    	//header("Location: $URL/upload_selfie.php?err=1");
    //}
  }
  /////////////////  Upload Selfie  /////////////////
	function upload_selfie($db,$URL,$lat,$long)
	{
			$at_date = date("d-m-Y");
    	$date = time();

			$uatquery = $db->prepare("SELECT uatid,uid, attendance_date, timein FROM user_attendance WHERE uid = ? AND attendance_date = ?");
	    $uatquery->execute(array($_SESSION['tmp_ba'], $at_date));
	    while($uatrow = $uatquery->fetch())
	    {
	    		$uat_timein = $uatrow['timein'];
	    }
	    if($uat_timein == 0)
	    {
	    		$Query = $db->prepare("UPDATE user_attendance SET timein=?, timein_lat=?, timein_long=? WHERE uid=? AND attendance_date=?");
	    		$Values = array($date,$lat, $long , $_SESSION['tmp_ba'], $at_date);
	    }
	    else
	    {
	    		$Query = $db->prepare("UPDATE user_attendance SET timein_lat=?, timein_long=? WHERE uid=? AND attendance_date=?");
	    		$Values = array($lat, $long , $_SESSION['tmp_ba'], $at_date);
	    }
	    //echo("$lat, $long , ".$_SESSION['tmp_user']." , $at_date");die;
	    if($Query->execute($Values))
	    {
	    	$tmp_ba = $_SESSION['tmp_ba'];
	  		$tmp_batype = $_SESSION['tmp_batype'];
	  		$tmp_ba_asid = $_SESSION['tmp_ba_asid'];
	  		$tmp_appid = $_SESSION['tmp_appid'];

	  		setcookie("ba", $tmp_ba, time() + (86400 * 30), "/"); // 86400 = 1 day
	  		setcookie("batype", $tmp_batype, time() + (86400 * 30), "/"); // 86400 = 1 day
	  		setcookie("ba_asid", $tmp_ba_asid, time() + (86400 * 30), "/"); // 86400 = 1 day
	  		setcookie("ba_appid", $tmp_appid, time() + (86400 * 30), "/"); // 86400 = 1 day

	  		$_SESSION['ba'] = $tmp_ba;
	      $_SESSION['batype'] = $tmp_batype;
	      $_SESSION['ba_asid'] = $tmp_ba_asid;
	      $_SESSION['ba_appid'] = $tmp_appid;
	      
	      $_COOKIE['ba'] = $tmp_ba;
	      $_COOKIE['batype'] = $tmp_batype;
	      $_COOKIE['ba_asid'] = $tmp_ba_asid;
	      $_COOKIE['ba_appid'] = $tmp_appid;

	      header("Location: main.php");
	      die;
	    }  
	}
	/////////////////  Upload Selfie  /////////////////
	function upload_logout_selfie($db,$URL)
	{
		include("thumb.php");

		$image       = $_FILES['image']['name'];
		$photo       = $_FILES['image']['tmp_name'];
		
		if($image != "")
    {
        if ($image) 
        {
            $filename  = stripslashes($_FILES['image']['name']);
            $extension = getExtension($filename);
            $extension = strtolower($extension);
            if (($extension != "jpg") && ($extension != "jpeg") && ($extension != "png")) 
            {
                $errors = 1;
            }
            else
            {
                $size   = getimagesize($_FILES['image']['tmp_name']);
                $sizekb = filesize($_FILES['image']['tmp_name']);
                if ($sizekb > MAX_SIZE * 1024)
                {
                    $errors = 1;
                }
                $A = rand(1000,1000000);
                $image_name = $A.'.'.$extension;
                $newname    = "assets/img/".$image_name;
                $copied     = copy($_FILES['image']['tmp_name'], $newname);
                if (!$copied) 
                {
                    $errors = 1;
                }
                else
                {
                    $thumb_name = "assets/img/ba_log/".$image_name;
                    $thumb      = make_thumb($newname,$thumb_name,WIDTH,HEIGHT);
                   	unlink("assets/img/".$image_name."");
                }
            }
        }
        $selfie_image = $image_name;
        if(isset($_REQUEST['hdnImage']))
        {
        	unlink("assets/img/ba_log/".$_REQUEST['hdnImage']."");	
        }
    }
    else
    {
        $selfie_image = "";
    }

		////////////////////////////////////////////////////
    if($selfie_image != "")
    {
    		$at_date = date("d-m-Y");
    		$query = $db->prepare("UPDATE user_attendance SET timeout_image=? WHERE uid=? AND attendance_date=?");
				$values = array($selfie_image,$_COOKIE['ba'], $at_date);	
    		if($query->execute($values))
    		{
    				header("Location: upload_logout_selfie.php?msg=1");
    		}
    		else
    		{
    			header("Location: upload_logout_selfie.php?msg=2");
    		}
    }
	}


  function do_verify_logout_location($db,$URL,$lat,$long)
  {
    $at_date = date("d-m-Y");
    $date = time();
    $Query = $db->prepare("UPDATE user_attendance SET timeout=?, timeout_lat=?, timeout_long=? WHERE uid=? AND attendance_date=?");
    $Values = array($date, $lat, $long, $_COOKIE['ba'] , $at_date);
		if($Query->execute($Values))
    {
    	setcookie("ba", $tmp_user, time() - 43200, "/");       // 12 Hours
      setcookie("batype", $tmp_usertype, time() - 43200, "/"); // 12 Hours
     	setcookie("ba_asid", $tmp_asid, time() - 43200, "/"); 	  // 12 Hours
     	
     	unset($_SESSION['ba_asid']);
      unset($_COOKIE['ba_asid']); 

      unset($_SESSION['ba']);
      unset($_COOKIE['ba']);

      unset($_SESSION['batype']);
      unset($_COOKIE['batype']);

      unset($_SESSION['ba_appid']);
      unset($_COOKIE['ba_appid']); 

			header("Location: index.php?err=3");
    	//header("Location: $URL/upload_logout_selfie.php?err=1");
    }
  }
  
  function do_cancel_su_login($db,$URL)
  {
      unset($_SESSION['tmp_sup']);
      unset($_COOKIE['tmp_suptype']); 
      header("Location: $URL/index.php?err=3");
  }
  function do_cancel_login($db,$URL)
  {
  		setcookie("tmp_ba", 1, time() - 43200, "/");       // 12 Hours
      setcookie("tmp_batype", 1, time() - 43200, "/"); // 12 Hours
     	setcookie("tmp_asid", 1, time() - 43200, "/"); 	  // 12 Hours
     	setcookie("tmp_appid", 1, time() - 43200, "/"); 	  // 12 Hours
     
      unset($_SESSION['tmp_asid']);
      unset($_COOKIE['tmp_asid']); 

      unset($_SESSION['tmp_ba']);
      unset($_COOKIE['tmp_ba']);

      unset($_SESSION['tmp_batype']);
      unset($_COOKIE['tmp_batype']);

      unset($_SESSION['tmp_appid']);
      unset($_COOKIE['tmp_appid']); 

      header("Location: $URL/index.php?err=1");
  }

  function do_confirm_login($db,$URL)
  {
  		$at_date = date("d-m-Y");

  		$tmp_ba = $_SESSION['tmp_ba'];
  		$tmp_batype = $_SESSION['tmp_batype'];
  		$tmp_ba_asid = $_SESSION['tmp_ba_asid'];
  		$tmp_appid = $_SESSION['tmp_appid'];

  		//echo($tmp_user." / ".$tmp_usertype." / ".$tmp_asid."<br><br>");die;

  		setcookie("ba", $tmp_ba, time() + 43200, "/");       // 12 Hours
      setcookie("batype", $tmp_batype, time() + 43200, "/"); // 12 Hours
     	setcookie("ba_asid", $tmp_ba_asid, time() + 43200, "/"); 	  // 12 Hours
     	setcookie("ba_appid", $tmp_appid, time() + 43200, "/"); 	  // 12 Hours
     	
     	$_SESSION['ba_asid']   = $tmp_ba_asid;
      $_COOKIE['ba_asid']   = $tmp_ba_asid; 

      $_SESSION['ba']   = $tmp_ba;
      $_COOKIE['ba']   = $tmp_ba;

      $_SESSION['batype']   = $tmp_batype;
      $_COOKIE['batype']   = $tmp_batype;

      $_SESSION['ba_appid']   = $tmp_appid;
      $_COOKIE['ba_appid']   = $tmp_appid; 

      //echo($_SESSION['user']." / ".$_SESSION['usertype']." / ".$_SESSION['asid']."<br><br>");die;

      header("Location: main.php");
      die;
  }

	function has_loggedin($db,$URL)
	{
		//echo($_COOKIE['ba']." / ".$_COOKIE['batype']." / ".$_COOKIE['ba_asid']);die;
		if(isset($_COOKIE['ba']) && $db !== null)
		{
			$at_date = date("d-m-Y");

			//echo($at_date);die;
			$at_query = $db->prepare("SELECT uatid, uid, attendance_date, timein  FROM user_attendance WHERE uid = ? AND attendance_date = ? AND timein > ? ORDER BY uatid DESC LIMIT 0,1");
			$at_query->execute(array($_COOKIE['ba'],$at_date,0));
			if($at_query->rowCount() > 0)
			{
					$_SESSION['ba']   = $_COOKIE['ba'];      
		      $_SESSION['batype']   = $_COOKIE['batype'];
		      $_SESSION['ba_asid']   = $_COOKIE['ba_asid'];
		      $_SESSION['ba_appid']   = $_COOKIE['ba_appid'];
		      
					header("Location: main.php?");
			}
			else
			{
					setcookie('ba', '', -1, '/');
					setcookie('batype', '', -1, '/');
					setcookie('ba_asid', '', -1, '/'); 
					setcookie('ba_appid', '', -1, '/'); 
					
					unset($_SESSION['ba']);
					unset($_SESSION['batype']);
					unset($_SESSION['ba_asid']);
					unset($_SESSION['ba_appid']);
					
					unset($_COOKIE['ba']);
					unset($_COOKIE['batype']);
					unset($_COOKIE['ba_asid']);
					unset($_COOKIE['ba_appid']);	
			}	
		}

		if(isset($_COOKIE['sup']))
		{
      $_SESSION['sup']   = $_COOKIE['sup'];      
      $_SESSION['suptype']   = $_COOKIE['suptype'];
      $_SESSION['sup_appid']   = $_COOKIE['sup_appid'];
			header("Location: su_main.php?");	
		}
	}
	function do_logout($db,$URL)
	{
		if(isset($_SESSION['sup']) OR isset($_COOKIE['sup']))
		{
				setcookie('sup', '', -1, '/');
				setcookie('suptype', '', -1, '/'); 
				setcookie('sup_appid', '', -1, '/');
				
				unset($_SESSION['sup']);
				unset($_SESSION['suptype']);
				unset($_SESSION['sup_appid']);

				unset($_COOKIE['sup']);
				unset($_COOKIE['suptype']);
				unset($_COOKIE['sup_appid']);
		}
		else
		{
				setcookie('ba', '', -1, '/');
				setcookie('batype', '', -1, '/');
				setcookie('ba_asid', '', -1, '/'); 
				setcookie('ba_appid', '', -1, '/'); 
				
				unset($_SESSION['ba']);
				unset($_SESSION['batype']);
				unset($_SESSION['ba_asid']);
				unset($_SESSION['ba_appid']);
				
				unset($_COOKIE['ba']);
				unset($_COOKIE['batype']);
				unset($_COOKIE['ba_asid']);
				unset($_COOKIE['ba_appid']);
		}
		header("Location: index.php?err=3");	
	}

	function do_confirm_logout($db,$URL)
  {
  		$date = time();
  		$at_date = date("d-m-Y");

  		$query = $db->prepare("UPDATE user_attendance SET timeout=? WHERE uid=? AND attendance_date=?");
			$values = array($date,$_COOKIE['ba'], $at_date);	
  		if($query->execute($values))
  		{
  				setcookie("ba", 0, time() - 43200, "/");       // 12 Hours
		      setcookie("batype", 0, time() - 43200, "/"); // 12 Hours
		     	setcookie("ba_asid", 0, time() - 43200, "/"); 	  // 12 Hours
		     	setcookie("ba_appid", 0, time() - 43200, "/"); 	  // 12 Hours
		     	
		      unset($_SESSION['ba_asid']);
		      unset($_COOKIE['ba_asid']); 

		      unset($_SESSION['ba']);
		      unset($_COOKIE['ba']);

		      unset($_SESSION['batype']);
		      unset($_COOKIE['batype']);

		      unset($_SESSION['ba_appid']);
		      unset($_COOKIE['ba_appid']);

  				header("Location: index.php?msg=1");
  		}
  }

  function do_cancel_logout($db,$URL)
  {
  		$date = time();
  		$at_date = date("d-m-Y");

  		$query = $db->prepare("UPDATE user_attendance SET timeout_image=?, timeout_lat=?, timeout_long=? WHERE uid=? AND attendance_date=?");
			$values = array('','','',$_COOKIE['ba'], $at_date);	
  		if($query->execute($values))
  		{
  				header("Location: main.php?");
  		}
  }
	

	function save_qty($db,$URL)
	{
		$at_date = date("d-m-Y");
		$hdn_qty = $_REQUEST['hdnQty'];
		$num = 0;
		//echo($hdn_qty);die;

		for ($i = 1; $i <= $hdn_qty; $i++)
		{
			$assid		 = "hdnid$i";
			$qty		 = "txtQty$i";
			$type		 = "rdoValue$i";

			$Query = $db->prepare("UPDATE assignment_sale SET stock_qty = ?, stock_type = ? WHERE assid = ?");

			$Values = array($_REQUEST[$qty] , $_REQUEST[$type] , $_REQUEST[$assid]);

			if(!$Query->execute($Values))
			{
				echo "\nPDO::errorInfo():\n";
				print_r($Query->errorInfo());die;
			}
		}
		header("Location: post_qty.php?err=1");
	}

	function post_qty($db,$URL)
	{
		$at_date = date("d-m-Y");
		$hdn_qty = $_REQUEST['hdnQty'];
		$num = 0;
		//echo($hdn_qty);die;

		for ($i = 1; $i <= $hdn_qty; $i++)
		{
			$assid		 = "hdnid$i";
			$qty		 = "txtQty$i";
			$type		 = "rdoValue$i";

			$Query1 = $db->prepare("UPDATE assignment_sale SET stock_qty = ?, stock_type = ? WHERE assid = ?");
			$Values1 = array($_REQUEST[$qty] , $_REQUEST[$type] , $_REQUEST[$assid]);

			$Query2 = $db->prepare("UPDATE user_attendance SET stock_status = ? WHERE uid = ? AND attendance_date = ?");
			$Values2 = array(1, $_SESSION['ba'] , $at_date);

			//echo("1, ".$_SESSION['ba']." , $at_date");;die;
			//echo("1, ".$_SESSION['user']." , $at_date");die;
			$Query1->execute($Values1);
			$Query2->execute($Values2);	
		}
		header("Location: post_qty.php?err=2");
	}

	function save_price($db,$URL)
	{
		$at_date = date("d-m-Y");
		$hdn_qty = $_REQUEST['hdnQty'];
		$num = 0;
		//echo($hdn_qty);die;

		for ($i = 1; $i <= $hdn_qty; $i++)
		{
			$assid		 = "hdnid$i";
			$price		 = "txtPrice$i";

			$Query = $db->prepare("UPDATE assignment_sale SET sale_price = ? WHERE assid = ?");

			$Values = array($_REQUEST[$price] , $_REQUEST[$assid]);

			if(!$Query->execute($Values))
			{
				echo "\nPDO::errorInfo():\n";
				print_r($Query->errorInfo());die;
			}
			
		}
		
		header("Location: post_price.php?err=1");
	}

	function post_price($db,$URL)
	{
		$at_date = date("d-m-Y");
		$hdn_qty = $_REQUEST['hdnQty'];
		$num = 0;
		//echo($hdn_qty);die;

		for ($i = 1; $i <= $hdn_qty; $i++)
		{
			$assid		 = "hdnid$i";
			$price		 = "txtPrice$i";

			$Query1 = $db->prepare("UPDATE assignment_sale SET stock_qty = ? WHERE assid = ?");
			$Values1 = array($_REQUEST[$price] , $_REQUEST[$assid]);

			$Query2 = $db->prepare("UPDATE user_attendance SET price_status = ? WHERE uid = ? AND attendance_date = ?");
			$Values2 = array(1, $_SESSION['ba'] , $at_date);

			//echo("1, ".$_SESSION['user']." , $at_date");;die;


			//echo("1, ".$_SESSION['user']." , $at_date");die;
			$Query1->execute($Values1);
			$Query2->execute($Values2);	
		}
		
		header("Location: post_price.php?err=2");
	}

	function save_sale($db,$URL)
	{
		$at_date = date("d-m-Y");
		$hdn_qty = $_REQUEST['hdnQty'];
		$num = 0;
		//echo($hdn_qty);die;

		for ($i = 1; $i <= $hdn_qty; $i++)
		{
			$assid		 = "hdnid$i";
			$sale		 = "txtSale$i";

			$Query = $db->prepare("UPDATE assignment_sale SET sale_qty = ? WHERE assid = ?");

			$Values = array($_REQUEST[$sale] , $_REQUEST[$assid]);

			if(!$Query->execute($Values))
			{
				echo "\nPDO::errorInfo():\n";
				print_r($Query->errorInfo());die;
			}
			
		}
		
		header("Location: post_sale.php?err=1");
	}

	function post_sale($db,$URL)
	{
		$at_date = date("d-m-Y");
		$hdn_qty = $_REQUEST['hdnQty'];
		$num = 0;
		//echo($hdn_qty);die;

		for ($i = 1; $i <= $hdn_qty; $i++)
		{
			$assid		 = "hdnid$i";
			$sale		 = "txtSale$i";

			$Query1 = $db->prepare("UPDATE assignment_sale SET sale_qty = ? WHERE assid = ?");
			$Values1 = array($_REQUEST[$sale] , $_REQUEST[$assid]);

			$Query2 = $db->prepare("UPDATE user_attendance SET sale_status = ? WHERE uid = ? AND attendance_date = ?");
			$Values2 = array(1, $_SESSION['ba'] , $at_date);

			//echo("1, ".$_SESSION['user']." , $at_date");;die;


			//echo("1, ".$_SESSION['user']." , $at_date");die;
			$Query1->execute($Values1);
			$Query2->execute($Values2);	
		}
		
		header("Location: post_sale.php?err=2");
	}
	
	///// Usership

	function save_usership($db,$URL)
	{
		$at_date = date("d-m-Y");
		$hdn_qty = $_REQUEST['hdnQty'];
		$num = 0;
		//echo($hdn_qty);die;

		for ($i = 1; $i <= $hdn_qty; $i++)
		{
			$asudid		 = "hdnid$i";
			$int_qty		 = "txtIntQty$i";
			$pro_qty		 = "txtProQty$i";

			//echo("".$_REQUEST[$int_qty].", ".$_REQUEST[$pro_qty].", ".$_REQUEST[$asudid]." <br>");
			$Query = $db->prepare("UPDATE usership_detail SET interception = ?, productive = ? WHERE asudid = ?");
			$Values = array($_REQUEST[$int_qty], $_REQUEST[$pro_qty], $_REQUEST[$asudid]);

			if(!$Query->execute($Values))
			{
				echo "\nPDO::errorInfo():\n";
				print_r($Query->errorInfo());die;
			}
		}
		header("Location: post_usership.php?err=1");
	}

	function post_usership($db,$URL)
	{
		$at_date = date("d-m-Y");
		$hdn_qty = $_REQUEST['hdnQty'];
		$num = 0;
		
		$Query1 = $db->prepare("UPDATE usership SET asustatus = ? WHERE uid = ? AND sale_date = ?");
		$Values1 = array(1, $_COOKIE['ba'], $at_date);
		$Query1->execute($Values1);
		
		$Query2 = $db->prepare("UPDATE user_attendance SET usership_status = ? WHERE uid = ? AND attendance_date = ?");
		$Values2 = array(1, $_COOKIE['ba'], $at_date);
		$Query2->execute($Values2);

		for ($i = 1; $i <= $hdn_qty; $i++)
		{
			$asudid		 = "hdnid$i";
			$int_qty		 = "txtIntQty$i";
			$pro_qty		 = "txtProQty$i";

			$Query3 = $db->prepare("UPDATE usership_detail SET interception = ?, productive = ? WHERE asudid = ?");
			$Values3 = array($_REQUEST[$int_qty], $_REQUEST[$pro_qty], $_REQUEST[$asudid]);

			if(!$Query3->execute($Values3))
			{
				echo "\nPDO::errorInfo():\n";
				print_r($Query->errorInfo());die;
			}	
		}
		header("Location: post_usership.php?err=2");
	}

	///// Competition Sale

	function save_com_sale($db,$URL)
	{
		$at_date = date("d-m-Y");
		$hdn_qty = $_REQUEST['hdnQty'];
		$num = 0;
		//echo($hdn_qty);die;

		for ($i = 1; $i <= $hdn_qty; $i++)
		{
			$asudid		 = "hdnid$i";
			$com_qty		 = "txtComQty$i";
			
			//echo("".$_REQUEST[$int_qty].", ".$_REQUEST[$pro_qty].", ".$_REQUEST[$asudid]." <br>");
			$Query = $db->prepare("UPDATE usership_detail SET com_sale = ? WHERE asudid = ?");
			$Values = array($_REQUEST[$com_qty], $_REQUEST[$asudid]);

			if(!$Query->execute($Values))
			{
				echo "\nPDO::errorInfo():\n";
				print_r($Query->errorInfo());die;
			}
		}
		header("Location: post_com_sale.php?err=1");
	}

	function post_com_sale($db,$URL)
	{
		$at_date = date("d-m-Y");
		$hdn_qty = $_REQUEST['hdnQty'];
		$num = 0;
		
		$Query = $db->prepare("UPDATE user_attendance SET comsale_status = ? WHERE uid = ? AND attendance_date = ?");
		$Values = array(1, $_COOKIE['ba'], $at_date);
		$Query->execute($Values);
		
		for ($i = 1; $i <= $hdn_qty; $i++)
		{
			$asudid		 = "hdnid$i";
			$com_qty		 = "txtComQty$i";

			$Query1 = $db->prepare("UPDATE usership_detail SET com_sale = ? WHERE asudid = ?");
			$Values1 = array($_REQUEST[$com_qty], $_REQUEST[$asudid]);

			if(!$Query1->execute($Values1))
			{
				echo "\nPDO::errorInfo():\n";
				print_r($Query->errorInfo());die;
			}	
		}
		header("Location: post_com_sale.php?err=2");
	}

	///// Deals Data

	function save_deals_sale($db,$URL)
	{
		$at_date = date("d-m-Y");
		$title = $_REQUEST['txtTitle'];
		$data = $_REQUEST['txtData'];
		
		$Query = $db->prepare("UPDATE user_attendance SET uatdeals_title = ?, uatdeals = ? WHERE uid = ? AND attendance_date = ?");
		$Values = array($title, $data, $_COOKIE['ba'], $at_date);

		if(!$Query->execute($Values))
		{
			echo "\nPDO::errorInfo():\n";
			print_r($Query->errorInfo());die;
		}
		else
		{
				header("Location: post_deals.php?err=1");
		}
	}

	function post_deals_sale($db,$URL)
	{
		$at_date = date("d-m-Y");
		$title = $_REQUEST['txtTitle'];
		$data = $_REQUEST['txtData'];
		
		$Query = $db->prepare("UPDATE user_attendance SET deals_sold_status = ?, uatdeals_title = ?, uatdeals = ? WHERE uid = ? AND attendance_date = ?");
		$Values = array(1, $title, $data, $_COOKIE['ba'], $at_date);

		if(!$Query->execute($Values))
		{
			echo "\nPDO::errorInfo():\n";
			print_r($Query->errorInfo());die;
		}
		else
		{
				header("Location: post_deals.php?err=2");
		}
	}

	///// Sample Data

	function save_samples_sale($db,$URL)
	{
		$at_date = date("d-m-Y");
		$title = $_REQUEST['txtTitle'];
		$data = $_REQUEST['txtData'];
		
		$Query = $db->prepare("UPDATE user_attendance SET uatsamples_title = ?, uatsamples = ? WHERE uid = ? AND attendance_date = ?");
		$Values = array($title, $data, $_COOKIE['ba'], $at_date);

		if(!$Query->execute($Values))
		{
			echo "\nPDO::errorInfo():\n";
			print_r($Query->errorInfo());die;
		}
		else
		{
				header("Location: post_samples.php?err=1");
		}
	}

	function post_samples_sale($db,$URL)
	{
		$at_date = date("d-m-Y");
		$title = $_REQUEST['txtTitle'];
		$data = $_REQUEST['txtData'];
		
		$Query = $db->prepare("UPDATE user_attendance SET samples_status = ?, uatsamples_title = ?, uatsamples = ? WHERE uid = ? AND attendance_date = ?");
		$Values = array(1, $title, $data, $_COOKIE['ba'], $at_date);

		if(!$Query->execute($Values))
		{
			echo "\nPDO::errorInfo():\n";
			print_r($Query->errorInfo());die;
		}
		else
		{
				header("Location: post_samples.php?err=2");
		}
	}


	function update_ba_password($db,$URL)
	{
		$new_password = $_REQUEST['txtNewPassword'];
		$confirm_password = $_REQUEST['txtConfirmPassword'];
		
		//echo($new_password." / ".$confirm_password);die;
		if($new_password == $confirm_password)
		{
				$new_ba_password = md5($new_password);
				$Query = $db->prepare("UPDATE users SET password = ? WHERE uid = ?");
				$Values = array($new_ba_password , $_COOKIE['ba']);
				if($Query->execute($Values))
				{
						header("Location: ba_change_password.php?err=1");
				}
		}
		else{
				header("Location: ba_change_password.php?err=2");
		}
	}

	/////////////////  Supervisor Function  /////////////////
	
	function create_visit_plan($db,$URL)
	{
		$date = time();
		$title = $_REQUEST['txtTitle'];
		$description = $_REQUEST['txtDescription'];

		//echo(strtotime($_REQUEST['txtVisitDate'])." / "); echo(date("d-m-Y",1733943600)); die;
		$visit_date = strtotime($_REQUEST['txtVisitDate']);
		$hdn_store = $_REQUEST['hdnStore'];

		$query = $db->prepare("INSERT INTO visit_plan(uid, vptitle, vpdescription, visit_date, vpdate) VALUES(?,?,?,?,?)");
		$values = array($_COOKIE['sup'], $title, $description, $visit_date, $date);
		if($query->execute($values))
		{
				$vpid = $db->lastInsertId();
				for ($i = 1; $i <= $hdn_store; $i++)
				{					
					$stid		 = "hdnStid$i";
					$brid		 = "hdnBrid$i";
					$uid		 = "hdnUid$i";
					$asid		 = "hdnAsid$i";
					$status		 = "chkStatus$i";
					if($_REQUEST[$status] == 1)
					{
						$vpdquery = $db->prepare("INSERT INTO visit_plan_detail(vpid, uid, stid, brid, asid, bauid, vpdstatus, vpddate) VALUES(?,?,?,?,?,?,?,?)");
						$vpdvalues = array($vpid, $_COOKIE['sup'], $_REQUEST[$stid], $_REQUEST[$brid], $_REQUEST[$asid], $_REQUEST[$uid], $_REQUEST[$status], $date);
						if(!$vpdquery->execute($vpdvalues))
						{
							echo "\nPDO::errorInfo():\n";
							print_r($Query->errorInfo());die;
						}	
					}
				}
		}
		header("Location: su_visit_plans.php?err=1");
	}
	
	function create_visit_store($db,$URL,$t)
	{
		$date = time();
		$arr = explode(',', $_REQUEST['cboStore']);
		$stid = $arr[0];
		$brid = $arr[1];
		$ba_uid = $arr[2];
		$sup_uid = $arr[3];
		
		if(isset($_COOKIE['sup_appid']))
		{
			$vapp_id = $_COOKIE['sup_appid'];
		}
		else
		{
			$vapp_id = "";
		}
		//echo($ba_uid."/".$sup_uid);die;
		$description = $_REQUEST['txtDescription'];
		
		if(isset($_REQUEST['chkCritical']))
		{
				$chk_critical = 1;
		}
		else
		{
				$chk_critical = 0;
		}
		
		if(isset($_REQUEST['chkVisitType']))
		{
				$visit_type = 1;
		}
		else
		{
				$visit_type = 0;
		}

		$visit_time = $_REQUEST['rdoVisitTime'];

		//echo(strtotime($_REQUEST['txtVisitDate'])." / "); echo(date("d-m-Y",1733943600)); die;
		$visit_date = time();

		$visitdate = strtotime(date("d-m-Y"));
		$lat = $_REQUEST['hdnlat'];
		$long = $_REQUEST['hdnlong'];

		$vquery = $db->prepare("SELECT vmid, vimage, vimage_date FROM visit_image WHERE vimage_date = ?");
		$vquery->execute(array($t));
		while($vrow = $vquery->fetch())
		{
			 $vimage = $vrow['vimage'];
			 $vimage_date = $vrow['vimage_date'];
		}

		$visitquery = $db->prepare("SELECT vid, uid, stid, brid, ba_uid, sup_uid, vdate FROM visits WHERE uid=? AND stid=? AND brid=? AND vdate=?");
		$visitquery->execute(array($_COOKIE['sup'], $stid, $brid,$visitdate));
		if($visitquery->rowCount() == 0)
		{
				$query = $db->prepare("INSERT INTO visits(uid, stid, brid, ba_uid, sup_uid, remarks, vlat, vlong, vimage, vimage_date, vdate, post_date, critical_type, visit_type, visit_time, vapp_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
				$values = array($_COOKIE['sup'], $stid, $brid, $ba_uid, $sup_uid, $description, $lat, $long, $vimage, $vimage_date, $visit_date, $date, $chk_critical, $visit_type, $visit_time, $vapp_id);
		}
		else
		{
				while($visitrow = $visitquery->fetch())
				{
						$vid = $visitrow['vid'];
				}
				//echo($visitquery->rowCount()."/ $vid / RAZA");die;
				$query = $db->prepare("UPDATE visits SET ba_uid=?, sup_uid=?, remarks=?, vlat=?, vlong=?, vimage=?, vimage_date=?, post_date=?, critical_type=?, visit_type=?, visit_time=?, vapp_id=? WHERE vid=?");
				$values = array($ba_uid, $sup_uid, $description, $lat, $long, $vimage, $vimage_date, $date, $chk_critical, $visit_type, $visit_time, $vapp_id, $vid);  
		}
		if($query->execute($values))
		{
			header("Location: su_visit_stores.php?err=1");		
		}
		else
		{
			 echo "\nPDO::errorInfo():\n";
			 print_r($query->errorInfo());die;
		}
	}
	
    function update_su_password($db,$URL)
	{
		$new_password = $_REQUEST['txtNewPassword'];
		$confirm_password = $_REQUEST['txtConfirmPassword'];
		
		//echo($new_password." / ".$confirm_password);die;
		if($new_password == $confirm_password)
		{
				$new_ba_password = md5($new_password);
				$Query = $db->prepare("UPDATE users SET password = ? WHERE uid = ?");
				$Values = array($new_ba_password , $_COOKIE['sup']);
				if($Query->execute($Values))
				{
						header("Location: su_change_password.php?err=1");
				}
		}
		else{
				header("Location: su_change_password.php?err=2");
		}
	}
    /////////////////  Save Survey  /////////////////
	function save_survey($db,$URL,$surid,$asid)
	{
		$date = time();

		$srquery = $db->prepare("INSERT INTO survey_record(surid, asid, uid, surrdate) VALUES(?,?,?,?)");
		$srvalues = array($surid, $asid, $_COOKIE['ba'], $date);
		if($srquery->execute($srvalues))
		{
			  $surrid = $db->lastInsertId();

			  $surdquery = $db->prepare("SELECT surdid, surid, brid, surtype, surfield FROM survey_detail WHERE surid = ? ORDER BY surdid ASC");
				$surdquery->execute(array($surid));
				while($surdrow = $surdquery->fetch())
				{
					$surdid = $surdrow['surdid'];
		      $surtype = $surdrow['surtype']; // 1 = textfield, 1 = dropdown, 3 = checkbox, 4 = radiobutton, 
		      $surfield = $surdrow['surfield'];
		      
		      if($surtype == 1){ $value_name = "txt_".$surdid; }
		      if($surtype == 2){ $value_name = "cbo_".$surdid; }
		      if($surtype == 3){ $value_name = "chk_".$surdid; }
		      if($surtype == 4){ $value_name = "rdo_".$surdid; }


		      //echo($_REQUEST[$value_name]."<br>");

		      $srdquery = $db->prepare("INSERT INTO survey_record_detail(surrid, surdfield, surdvalue) VALUES(?,?,?)");
		      $srdvalues = array($surrid,$surfield, $_REQUEST[$value_name]);
		      $srdquery->execute($srdvalues);
		    }
		    //die;
		   	header("Location: ba_survey.php?surid=$surid&asid=$asid&err=1");
		}
	}
?>