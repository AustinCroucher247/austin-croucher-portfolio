<?php
header("Content-Type: application/json");

// Get data from the request
$data = json_decode(file_get_contents("php://input"), true);
$name = $data["name"];
$email = $data["email"];
$message = $data["message"];

// Your email address
$to = "austin.croucher@gmail.com";
$subject = "New Message from Contact Form";
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: $email" . "\r\n";
$headers .= "Reply-To: $email" . "\r\n";

// Prepare the email body
$email_body = "
  <html>
  <head>
    <title>$subject</title>
  </head>
  <body>
    <p>Name: $name</p>
    <p>Email: $email</p>
    <p>Message:</p>
    <p>$message</p>
  </body>
  </html>
";

// Send the email
if (mail($to, $subject, $email_body, $headers)) {
  // Success response
  echo json_encode(["success" => true]);
} else {
  // Error response
  echo json_encode(["success" => false, "error" => "Failed to send email"]);
}
?>