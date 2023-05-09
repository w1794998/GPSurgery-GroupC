<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $selectedDate = $data['selectedDate'];
    $selectedTime = $data['selectedTime'];
    $descBox = $data['descBox'];
    $nhsNumber = $data['nhsNumber'];

    try {
        $db = new PDO('sqlite:GPSurgery.db');
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $db->prepare('INSERT INTO appointment ( Date, TimeSlot, Description, NHSNumber) VALUES (:selectedDate, :selectedTime, :descBox, :nhsNumber)');
        $stmt->bindParam(':selectedDate', $selectedDate);
        $stmt->bindParam(':selectedTime', $selectedTime);
        $stmt->bindParam(':descBox', $descBox);
        $stmt->bindParam(':nhsNumber', $nhsNumber);
        $stmt->execute();

        echo json_encode(['status' => 'success', 'message' => 'Appointment booked successfully']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>