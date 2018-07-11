<?php
require __DIR__ . '/vendor/autoload.php';


error_reporting(-1);
ini_set('display_errors', 'On');

setlocale(LC_CTYPE, 'lt_LT');

use Sirius\Upload\Handler as UploadHandler;

$response = [
    'status' => 'error',
    'message' => 'Klaida: forma nepakankamai užpildyta.'
];

if (empty($_POST['name']) || empty($_POST['lastName']) || empty($_POST['city']) || empty($_POST['tel']) || empty(filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) || empty($_POST['year']) || empty($_POST['month']) || empty($_POST['day']) || empty($_POST['text'])) {
    echo json_encode($response);
    die();
} else {
    $tos = !empty($_POST['tos']) ? 1 : 0;

    $dbh = new PDO('mysql:host=localhost;dbname=submits', 'root', 'zhzbf');
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $statement = $dbh->prepare("INSERT INTO submits (name, lastName, tel, email, city, year, month, day, text, agreeWork, tos, file ) VALUES (:name, :lastName, :tel, :email, :city, :year, :month, :day, :text, :agreeWork, :tos, :file)");
    $statement->bindParam(':name', $_POST['name']);
    $statement->bindParam(':lastName', $_POST['lastName']);
    $statement->bindParam(':tel', $_POST['tel']);
    $statement->bindParam(':email', $_POST['email']);
    $statement->bindParam(':city', $_POST['city']);
    $statement->bindParam(':year', $_POST['year']);
    $statement->bindParam(':month', $_POST['month']);
    $statement->bindParam(':day', $_POST['day']);
    $statement->bindParam(':text', $_POST['text']);
    $agreed = ($_POST['agreeWork'] ? '1' : '0');
    $statement->bindParam(':agreeWork', $agreed);
    $statement->bindParam(':tos', $tos);

    $subject = "AS UPLOADINTAS IS MOBILE";
    switch ($_POST['city']) {
        case 'Vilnius':
            $email = 'ambasadoriaivilnius@simplika.lt';
            break;
        case 'Kaunas':
            $email = 'ambasadoriaikaunas@simplika.lt';
            break;
        case 'Klaipėda':
            $email = 'ambasadoriaiklaipeda@simplika.lt';
            break;
        case 'Šiauliai':
            $email = 'ambasadoriaisiauliai@simplika.lt';
            break;
        case 'Panevėžys':
            $email = 'ambasadoriaipanevezys@simplika.lt';
            break;
        case 'Marijampolė':
            $email = 'ambasadoriaimarijampole@simplika.lt';
            break;
        case 'Alytus':
            $email = 'ambasadoriaialytus@simplika.lt';
            break;
        default:
            $email = 'ambasadoriaikitas@simplika.lt';
    }

    if (!empty($_FILES)) {
        $uploadHandler = new UploadHandler(__DIR__ . '/uploads');

        $uploadHandler->addRule('extension', ['allowed' => ['png', 'jpg', 'jpeg', 'xlsm', 'xlsx', 'doc', 'docx', 'pdf' , 'txt']], '{label} turi būti (FORMTAI) formatų.', 'CV');
        $uploadHandler->addRule('size', ['max' => '5M'], '{label} maksimalus dydis yra {max}', 'CV');

        $result = $uploadHandler->process($_FILES['file']);
        $response = [
            'status' => 'error',
            'message' => 'Klaida išsaugant duomenis, bandykite dar kartą.'
        ];

        if ($result->isValid()) {
            try {
                $result->confirm();
                $file = $result->name;

                $subject = "AS UPLOADINTAS IS DESKTOP";
            } catch (\Exception $e) {
                $result->clear();
                $response = [
                    'status' => 'error',
                    'message' => 'Klaida, bandykite dar kartą.'
                ];
                echo json_encode($response);
                die();
            }
        } else {
            $response = [
                'status' => 'error',
                'message' => 'Klaida, blogas failas.'
            ];

            echo json_encode($response);
            die();
        }
    }
    $file = !empty($file) ? $file : null;

    $statement->bindParam(':file', $file);
    $statement->execute();

    $mail = new PHPMailer;
    $mail->CharSet = 'UTF-8';

    $mail->isSMTP();
    $mail->Host = 'smtp.sendgrid.net';
    $mail->SMTPAuth = true;
    $mail->Username = 'aplikacijos.lt';
    $mail->Password = 'FFBbuM7GLJ';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom($_POST['email']);
    $mail->addAddress($email);     // Add a recipient
    $mail->addReplyTo($_POST['email']);

    $mail->addAttachment(__DIR__ . '/uploads/' . $file);         // Add attachments
    $mail->isHTML(true);                                  // Set email format to HTML

    $mail->Subject = $subject;
    $mail->Body = $_POST['name'] . "\r\n\r\n" . $_POST['email'] . "\r\n\r\n" . $_POST['tel'] . "\r\n\r\n" . $_POST['city'] . "\r\n\r\n";

    if (!$mail->send()) {
        $response = [
            'status' => 'error',
            'message' => 'Klaida, bandykite dar kartą.'
        ];

        echo json_encode($response);
        die();
    } else {
        $response = [
            'status' => 'success',
            'message' => 'Sėkmingai išsiųsta'
        ];

        echo json_encode($response);
        die();
    }
}
