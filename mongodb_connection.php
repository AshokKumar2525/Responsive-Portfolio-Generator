<?php
require 'vendor/autoload.php';

class MongoDBManager {
    private static $client = null;
    private static $uri;

    public static function initialize() {
        self::$uri = "mongodb+srv://ashokkumarmalineni25:" . urlencode("Ashok@123") . "@cluster0.cbkwvdk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    }

    public static function getClient() {
        if (self::$uri === null) {
            self::initialize();
        }
        if (self::$client === null || !self::ping()) {
            self::reconnect();
        }
        return self::$client;
    }

    private static function ping() {
        try {
            self::$client->listDatabases();
            return true;
        } catch (Exception $e) {
            error_log("MongoDB ping failed: " . $e->getMessage());
            return false;
        }
    }

    private static function reconnect() {
        $maxRetries = 3;
        $retryDelay = 1;

        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            try {
                self::$client = new MongoDB\Client(self::$uri);
                self::$client->listDatabases();
                return true;
            } catch (Exception $e) {
                error_log("MongoDB connection attempt $attempt failed: " . $e->getMessage());
                sleep($retryDelay);
                $retryDelay *= 2;
            }
        }

        throw new Exception("Failed to connect to MongoDB after $maxRetries attempts");
    }
}

// Initialize the connection URI when the class is first loaded
MongoDBManager::initialize();
?>