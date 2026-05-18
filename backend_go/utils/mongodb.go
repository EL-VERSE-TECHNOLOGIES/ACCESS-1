package utils

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var MongoClient *mongo.Client
var MongoDatabase *mongo.Database

func InitMongoDB() {
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		uri = "mongodb+srv://supremeelyon606_db_user:mqZd5xcCdMvtVPE1@eee.osa2knp.mongodb.net/?appName=EEE"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		log.Printf("Failed to connect to MongoDB: %v", err)
		return
	}

	// Ping the primary
	if err := client.Ping(ctx, nil); err != nil {
		log.Printf("Failed to ping MongoDB: %v", err)
		return
	}

	fmt.Println("Successfully connected to MongoDB!")
	MongoClient = client
	MongoDatabase = client.Database("elaccess")
}

func LogAudit(action string, userID string, details string) {
	if MongoDatabase == nil {
		return
	}

	collection := MongoDatabase.Collection("audit_logs")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, map[string]interface{}{
		"action":    action,
		"user_id":   userID,
		"details":   details,
		"timestamp": time.Now(),
	})

	if err != nil {
		fmt.Printf("Failed to log audit to MongoDB: %v\n", err)
	}
}
