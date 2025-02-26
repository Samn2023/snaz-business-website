<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['username']) && isset($_POST['password'])) {
        $username = trim($_POST['username']);
        $password = trim($_POST['password']);

        // Database connection
        $host = "sql3.freesqldatabase.com";
        $dbname = "sql3764580";
        $dbuser = "sql3764580";
        $dbpass = "pMEtj9XqB8";
        $port = "3306";

        $conn = new mysqli($host, $dbuser, $dbpass, $dbname, $port);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // Fetch user details from database
        $sql = "SELECT * FROM users WHERE username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $hashed_password = $user['password'];

            // Verify password
            if (password_verify($password, $hashed_password)) {
                echo "Login successful! Welcome, " . $username;
            } else {
                echo "Invalid password!";
            }
        } else {
            echo "User not found!";
        }

        $stmt->close();
        $conn->close();
    } else {
        echo "Please enter both username and password.";
    }
} else {
    echo "Invalid request method.";
}
?>
