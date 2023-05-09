<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['nhsNumber'])) {
    $nhsNumber = $data['nhsNumber'];

    try {
        $db = new PDO('sqlite:GPSurgery.db');
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "SELECT * FROM appointment WHERE NHSNumber = :nhsNumber";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':nhsNumber', $nhsNumber, PDO::PARAM_INT);

        if ($stmt->execute()) {
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($result) {
                echo json_encode(['status' => 'success', 'data' => $result]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'No record found.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Could not fetch the record.']);
        }

    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'NHS number is required.']);
}
?>
