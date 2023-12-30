<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");

$method = $_SERVER['REQUEST_METHOD'];

$servername = "127.0.0.1:3306";
$username = "u583832022_api_vrzn";
$password = "=OCqbuo~x3M";
$dbname = "u583832022_db_vrzn";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

function sanitizeInput($conn, $input) {
    return $conn->real_escape_string($input);
}

switch ($method) {
    case 'POST':
        $action = isset($_POST['action']) ? $_POST['action'] : '';

        switch ($action) {
            case 'POST':
                $title = sanitizeInput($conn, $_POST['title']);
                $author = sanitizeInput($conn, $_POST['author']);
                $language = sanitizeInput($conn, $_POST['language']);
                $genre = sanitizeInput($conn, $_POST['genre']);
                $shelf = sanitizeInput($conn, $_POST['shelf']);

                $stmt = $conn->prepare("INSERT INTO 
                    books (title, author, language, genre, shelf) 
                        VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param("sssss", $title, $author, 
                    $language, $genre, $shelf);

                if ($stmt->execute()) {
                    echo json_encode(["message" => "Book added!"]);
                } else {
                    http_response_code(500);
                    echo json_encode(["message" => "Error"]);
                }

                $stmt->close();
                break;

            case 'PATCH':
                $id = sanitizeInput($conn, $_POST['id']);
                $title = sanitizeInput($conn, $_POST['title']);
                $author = sanitizeInput($conn, $_POST['author']);
                $language = sanitizeInput($conn, $_POST['language']);
                $genre = sanitizeInput($conn, $_POST['genre']);
                $shelf = sanitizeInput($conn, $_POST['shelf']);

                $stmt = $conn->prepare("UPDATE books SET title=?, author=?, 
                    language=?, genre=?, shelf=? WHERE id=?");
                $stmt->bind_param("sssssi", $title, $author, $language, 
                    $genre, $shelf, $id);

                if ($stmt->execute()) {
                    echo json_encode(["message" => "Book updated!"]);
                } else {
                    http_response_code(500);
                    echo json_encode(["message" => "Error"]);
                }

                $stmt->close();
                break;

            case 'DELETE':
                $id = sanitizeInput($conn, $_POST['id']);
                $stmt = $conn->prepare("DELETE FROM books WHERE id=?");
                $stmt->bind_param("i", $id);

                if ($stmt->execute()) {
                    echo json_encode(["message" => "Book deleted"]);
                } else {
                    http_response_code(500);
                    echo json_encode(["message" => "Error"]);
                }

                $stmt->close();
                break;

            default:
                http_response_code(400);
                echo json_encode(["message" => "An Error Occurred"]);
                break;
        }
        break;

    case 'GET':
        $result = $conn->query("SELECT * FROM books");
        $books = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($books);
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method Not Allowed"]);
        break;
}

$conn->close();
?>
