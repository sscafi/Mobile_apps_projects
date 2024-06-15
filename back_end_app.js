// MongoDB.js

import { MongoClient } from 'mongodb';

// Create a new MongoClient
const client = new MongoClient('mongodb+srv://saherscafi:Dataatad101!@cluster0.qzf4owe.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to the database
const db = client.db('yourDatabaseName'); // Specify the database name
const collection = db.collection('licenses'); // Specify the collection name

// Function to upload an image to MongoDB
const uploadImage = async (imageUri) => {
  try {
    // Fetch the image from the URI
    const response = await fetch(imageUri);
    // Convert the image to a buffer
    const buffer = await response.arrayBuffer();
    // Insert the image buffer into the collection
    const upload = await collection.insertOne({ image: Buffer.from(buffer) });
    // Return the ID of the inserted image
    return upload.insertedId;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Function to store license information with references to front and back image IDs
const storeLicense = async (frontImageId, backImageId) => {
  try {
    // Insert the front and back image IDs into the collection
    await collection.insertOne({ frontImageId, backImageId });
  } catch (error) {
    console.error('Error storing license:', error);
    throw error;
  }
};

// Export the functions for use in other modules
export { uploadImage, storeLicense };
