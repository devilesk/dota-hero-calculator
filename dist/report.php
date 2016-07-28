<?php
 $to = "admin@devilesk.com";
 $header = "From: support@devilesk.com";
 $subject = "Hero Calculator Report";
 date_default_timezone_set('America/New_York');
 $date = date('m/d/Y h:i:s a', time());
 $body = $date. "\r\nName: " . $_POST["name"] . "\r\nEmail: " . $_POST["email"] . "\r\n\r\n" . $_POST["body"];
 if (mail($to, $subject, $body, $header)) {
   echo("Success");
  } else {
   echo("Fail");
  }
 ?>