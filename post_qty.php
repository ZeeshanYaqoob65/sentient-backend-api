<?php
  include("includes/functions.php");
  include("includes/errors.php");
  ba_loggedin();

  if(isset($_REQUEST['btnSave']))
  {
    save_qty($db,$URL);
  }
  
  if(isset($_REQUEST['btnPost']))
  {
    post_qty($db,$URL);
  }
  
?>
<!doctype html>

<html
  lang="en"
  class="light-style layout-menu-fixed layout-compact"
  dir="ltr"
  data-theme="theme-default"
  data-assets-path="assets/"
  data-template="vertical-menu-template-free"
  data-style="light">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />

    <title>Sentient App - Stock Qty</title>

    <meta name="description" content="" />

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="assets/img/favicon/favicon.ico" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&ampdisplay=swap"
      rel="stylesheet" />

    <link rel="stylesheet" href="assets/vendor/fonts/remixicon/remixicon.css" />

    <!-- Menu waves for no-customizer fix -->
    <link rel="stylesheet" href="assets/vendor/libs/node-waves/node-waves.css" />

    <!-- Core CSS -->
    <link rel="stylesheet" href="assets/vendor/css/core.css" class="template-customizer-core-css" />
    <link rel="stylesheet" href="assets/vendor/css/theme-default.css" class="template-customizer-theme-css" />
    <link rel="stylesheet" href="assets/css/demo.css" />

    <!-- Vendors CSS -->
    <link rel="stylesheet" href="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />

    <!-- Page CSS -->
    <style>
      #loader {
        position: fixed;
        z-index: 9999;
        background: white;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      body.loaded #loader {
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.5s ease-out;
      }
      .progress {
        width: 50%;
        height: 20px;
      }
    </style>
    <!-- Page CSS -->

    <!-- Helpers -->
    <script src="assets/vendor/js/helpers.js"></script>
    <!--! Template customizer & Theme config files MUST be included after core stylesheets and helpers.js in the <head> section -->
    <!--? Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.  -->
    <script src="assets/js/config.js"></script>
    <script type="text/javascript" language="javascript">
      function selectText(num) {
      //  alert("MOHSIN");return false;
        const input = document.getElementById("txtQty"+num);
        input.focus();
        input.select();
      }
      function postRecords()
      {
        var cd;
        cd = confirm("Are you sure to post data?");
        if(cd)
        {
          return true;
        }
      }
    </script>

  </head>

  <body>
      <!-- Loader -->
    <div id="loader">
      <h5>Loading, please wait...</h5>
      <div class="progress mt-3">
        <div id="progress-bar" class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: 0%"></div>
      </div>
    </div>
    <!-- Layout wrapper -->
    <div class="layout-wrapper layout-content-navbar">
      <div class="layout-container">
        <!-- Menu -->

        <?php include("left_menu.php"); ?>
        <!-- / Menu -->

        <!-- Layout container -->
        <div class="layout-page">
          <!-- Navbar -->

          <?php include("top_menu.php"); ?>

          <!-- / Navbar -->

          <!-- Content wrapper -->
          <div class="content-wrapper">
            <!-- Content -->

            <form name="Form" method="post">
            <div class="container-xxl flex-grow-1 container-p-y">
              <div class="row g-6">


                <div class="col-xl-6">
                  <!-- HTML5 Inputs -->
                  <div class="card mb-6">
                    <h5 class="card-header">Stock Quantity - <small>Date: <?php echo(date("d-m-Y")); ?></small>
                      <?php if(isset($_REQUEST['err'])){ ?>
                      <br>
                      <small style="color: red;">Qty Updated Successfully!</small><br>
                      <?php }if($user_stock_status == 1){ ?>
                        <small style="color: red;">Qty Posted!</small>
                      <?php } ?>
                    </h5>
                    <div class="card-body">
                      <?php
                          $count = 0;
                          $current_date = date("d-m-Y");
                          $query = $db->prepare("SELECT ASS.assid, ASS.uid, ASS.asdid, ASS.asid, ASS.pid, ASS.stock_qty, ASS.stock_type, ASD.asdid, ASD.asdid, ASD.asdstatus, P.pid, P.pname FROM assignment_sale ASS 
                            INNER JOIN assignment_detail ASD ON ASS.asdid = ASD.asdid 
                            INNER JOIN products P ON ASS.pid = P.pid 
                            WHERE ASS.asid=? AND ASS.sale_date = ? AND ASD.asdstatus = ? ORDER BY P.pname ASC");
                          $query->execute(array($user_asid,$current_date,0));
                          $num_qty = $query->rowCount();
                      ?>
                      <input type="hidden" name="hdnQty" value="<?php echo($num_qty); ?>">
                      <?php
                         
                          while($row = $query->fetch())
                          {
                            $count++;

                            $subcount1 = $count + 1;
                            $subcount2 = $count + 2;
                            $subcount3 = $count + 3;
                      ?>
                      <div class="form-floating form-floating-outline mb-6">
                        <input class="form-control" type="number" name="txtQty<?php echo($count); ?>" value="<?php echo($row['stock_qty']); ?>" placeholder="Enter Quantity" id="txtQty<?php echo($count); ?>" <?php if($user_stock_status == 1) { echo "Disabled"; } ?> step=".001"  onClick="return selectText(<?php echo($count); ?>); " />
                        <input type="hidden" name="hdnid<?php echo($count); ?>" value="<?php echo($row['assid']); ?>">
                        <label for="html5-number-input"><?php echo($row['pname']); ?></label>
                        
                        <table width="30%">
                          <tr>
                            <td align="left">
                              <input type="radio" name="rdoValue<?php echo($count); ?>" checked id="rdoValue<?php echo($count); ?>_<?php echo($subcount1); ?>" value="A" data-skin="square" data-color="blue" <?php if($row['stock_type'] == "A"){ echo("checked"); } ?> <?php if($user_stock_status == 1) { echo "Disabled"; } ?>>
                              <label class='inline' for="rdoValue<?php echo($count); ?>_<?php echo($subcount1); ?>"> <span style="color: green;">A</span></label>
                            </td>
                            <td align="left">
                              <input type="radio" name="rdoValue<?php echo($count); ?>" id="rdoValue<?php echo($count); ?>_<?php echo($subcount2); ?>" value="L" data-skin="square" data-color="blue" <?php if($row['stock_type'] == "L"){ echo("checked"); } ?> <?php if($user_stock_status == 1) { echo "Disabled"; } ?>>
                              <label class='inline' for="rdoValue<?php echo($count); ?>_<?php echo($subcount2); ?>"> <span style="color: orange;">L</span></label>
                            </td>
                            <td align="left">
                              <input type="radio" name="rdoValue<?php echo($count); ?>" id="rdoValue<?php echo($count); ?>_<?php echo($subcount3); ?>" value="Z" data-skin="square" data-color="blue" <?php if($row['stock_type'] == "Z"){ echo("checked"); } ?> <?php if($user_stock_status == 1) { echo "Disabled"; } ?>> 
                              <label class='inline' for="rdoValue<?php echo($count); ?>_<?php echo($subcount3); ?>"> <span style="color: red;">Z</span></label>
                            </td>    
                          </tr>
                        </table>
                      </div>
                      <?php
                          }
                      ?>
                    </div>
                  </div>
                  <div class="mb-6">
                    <table width="100%">
                      <tr>
                        <td><button <?php if($user_stock_status == 1) { echo "Disabled"; } ?> name="btnSave" class="btn btn-warning d-grid w-100" type="submit">Save</button>
                        </td>
                        <td><button <?php if($user_stock_status == 1) { echo "Disabled"; } ?> name="btnPost" class="btn btn-success d-grid w-100" type="submit" onClick="return postRecords();">Post</button>
                  </td>
                      </tr>
                    </table>
                  
                  </div>
                  <div class="mb-3">
                  </div>
                </div>
              </div>
            </div>
            <!-- / Content -->
            </form>
            <!-- Footer -->
            <footer class="content-footer footer bg-footer-theme">
              <div class="container-xxl">
                <div
                  class="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
                  <div class="text-body mb-12 mb-md-0">
                    ©
                    <script>
                      document.write(new Date().getFullYear());
                    </script>
                     - Sentient
                  </div>
                </div>
              </div>
            </footer>
            <!-- / Footer -->

            <div class="content-backdrop fade"></div>
          </div>
          <!-- Content wrapper -->
        </div>
        <!-- / Layout page -->
      </div>

      <!-- Overlay -->
      <div class="layout-overlay layout-menu-toggle"></div>
    </div>
    <!-- / Layout wrapper -->

    <?php // include("post_buttons.php"); ?>
    
    <!-- Core JS -->
    <!-- build:js assets/vendor/js/core.js -->
    <script src="assets/vendor/libs/jquery/jquery.js"></script>
    <script src="assets/vendor/libs/popper/popper.js"></script>
    <script src="assets/vendor/js/bootstrap.js"></script>
    <script src="assets/vendor/libs/node-waves/node-waves.js"></script>
    <script src="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>
    <script src="assets/vendor/js/menu.js"></script>

    <!-- endbuild -->

    <!-- Vendors JS -->

    <!-- Main JS -->
    <script src="assets/js/main.js"></script>

    <!-- Page JS -->

    <script src="assets/js/form-basic-inputs.js"></script>

    <!-- Place this tag before closing body tag for github widget button. -->
    <script async defer src="https://buttons.github.io/buttons.js"></script>
    <script>
      // Simulate progress bar loading
      let progress = 0;
      const progressBar = document.getElementById('progress-bar');
      const interval = setInterval(() => {
        progress += 1;
        progressBar.style.width = progress + '%';
        if (progress >= 100) {
          clearInterval(interval);
          document.body.classList.add('loaded');
        }
      }, 30); // Adjust speed here
    </script>
  </body>
</html>
