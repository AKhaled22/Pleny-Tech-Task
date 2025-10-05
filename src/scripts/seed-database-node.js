const { MongoClient } = require('mongodb');

async function seedDatabase() {
  const uri = 'mongodb://localhost:27017';
  const dbName = 'PlenyDB';
  
  const client = new MongoClient(uri);

  try {
    console.log('🌱 Starting database seeding...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(dbName);

    // Clear existing data and indexes
    console.log('🗑️ Clearing existing data and problematic indexes...');
    
    try {
      // Drop the problematic unique index if it exists
      await db.collection('restaurants').dropIndex('uniqueName_1');
      console.log('✅ Dropped problematic uniqueName index');
    } catch (error) {
      console.log('ℹ️ uniqueName index not found (this is fine)');
    }
    
    await db.collection('restaurants').deleteMany({});
    await db.collection('users').deleteMany({});

    // Sample restaurant data
    const restaurantData = [
      {
        englishName: "Cairo Kitchen",
        arabicName: "مطبخ القاهرة",
        slug: "cairo-kitchen",
        cuisines: ["Egyptian", "Mediterranean"],
        followers: [],
        location: { type: "Point", coordinates: [31.2357, 30.0444] }
      },
      {
        englishName: "Alexandria Seafood",
        arabicName: "أسماك الإسكندرية",
        slug: "alexandria-seafood",
        cuisines: ["Seafood", "Mediterranean"],
        followers: [],
        location: { type: "Point", coordinates: [29.9187, 31.2001] }
      },
      {
        englishName: "Luxor Grill",
        arabicName: "شواء الأقصر",
        slug: "luxor-grill",
        cuisines: ["Grilled", "Egyptian"],
        followers: [],
        location: { type: "Point", coordinates: [32.6396, 25.6872] }
      },
      {
        englishName: "Aswan Spices",
        arabicName: "توابل أسوان",
        slug: "aswan-spices",
        cuisines: ["Nubian", "Egyptian", "Spicy"],
        followers: [],
        location: { type: "Point", coordinates: [32.8998, 24.0889] }
      },
      {
        englishName: "Hurghada Beach Cafe",
        arabicName: "مقهى شاطئ الغردقة",
        slug: "hurghada-beach-cafe",
        cuisines: ["International", "Seafood"],
        followers: [],
        location: { type: "Point", coordinates: [33.8116, 27.2574] }
      },
      {
        englishName: "Giza Pyramid View",
        arabicName: "إطلالة أهرام الجيزة",
        slug: "giza-pyramid-view",
        cuisines: ["Egyptian", "International"],
        followers: [],
        location: { type: "Point", coordinates: [31.1313, 29.9765] }
      },
      {
        englishName: "Sharm El Sheikh Delights",
        arabicName: "لذائذ شرم الشيخ",
        slug: "sharm-delights",
        cuisines: ["International", "Mediterranean"],
        followers: [],
        location: { type: "Point", coordinates: [34.33, 27.9158] }
      },
      {
        englishName: "Fayoum Oasis",
        arabicName: "واحة الفيوم",
        slug: "fayoum-oasis",
        cuisines: ["Egyptian", "Traditional"],
        followers: [],
        location: { type: "Point", coordinates: [30.8418, 29.2743] }
      },
      {
        englishName: "Port Said Marina",
        arabicName: "مارينا بورسعيد",
        slug: "port-said-marina",
        cuisines: ["Seafood", "International"],
        followers: [],
        location: { type: "Point", coordinates: [32.3018, 31.2653] }
      },
      {
        englishName: "Minya Heritage",
        arabicName: "تراث المنيا",
        slug: "minya-heritage",
        cuisines: ["Egyptian", "Traditional"],
        followers: [],
        location: { type: "Point", coordinates: [30.7618, 28.0871] }
      }
    ];

    // Sample user data
    const userData = [
      { fullName: "Ahmed Hassan", favoriteCuisines: ["Egyptian", "Mediterranean"], following: [] },
      { fullName: "Fatma Ali", favoriteCuisines: ["Seafood", "International"], following: [] },
      { fullName: "Mohamed Omar", favoriteCuisines: ["Grilled", "Egyptian", "Spicy"], following: [] },
      { fullName: "Nour Ibrahim", favoriteCuisines: ["Mediterranean", "International"], following: [] },
      { fullName: "Sara Mahmoud", favoriteCuisines: ["Traditional", "Egyptian"], following: [] },
      { fullName: "Khaled Mostafa", favoriteCuisines: ["Seafood", "Mediterranean", "International"], following: [] },
      { fullName: "Mona Abdel Rahman", favoriteCuisines: ["Egyptian", "Spicy"], following: [] },
      { fullName: "Youssef Farouk", favoriteCuisines: ["Grilled", "International"], following: [] },
      { fullName: "Rania Said", favoriteCuisines: ["Traditional", "Mediterranean"], following: [] },
      { fullName: "Amr Tarek", favoriteCuisines: ["Nubian", "Egyptian", "Spicy"], following: [] }
    ];

    // Insert restaurants
    console.log('📍 Creating restaurants...');
    const restaurantResult = await db.collection('restaurants').insertMany(restaurantData);
    console.log(`✅ Created ${restaurantResult.insertedCount} restaurants`);

    // Insert users
    console.log('👥 Creating users...');
    const userResult = await db.collection('users').insertMany(userData);
    console.log(`✅ Created ${userResult.insertedCount} users`);

    // Get the inserted documents to use their ObjectIds
    const restaurants = await db.collection('restaurants').find().toArray();
    const users = await db.collection('users').find().toArray();

    console.log('🔗 Creating user-restaurant relationships...');

    // Define relationships - each user follows restaurants that match their favorite cuisines
    const relationships = [
      { userIndex: 0, restaurantIndexes: [0, 5] }, // Ahmed Hassan -> Cairo Kitchen, Giza Pyramid View
      { userIndex: 1, restaurantIndexes: [1, 4, 8] }, // Fatma Ali -> Alexandria Seafood, Hurghada Beach Cafe, Port Said Marina
      { userIndex: 2, restaurantIndexes: [2, 3] }, // Mohamed Omar -> Luxor Grill, Aswan Spices
      { userIndex: 3, restaurantIndexes: [0, 4, 5, 6] }, // Nour Ibrahim -> Cairo Kitchen, Hurghada Beach Cafe, Giza Pyramid View, Sharm El Sheikh Delights
      { userIndex: 4, restaurantIndexes: [7, 9] }, // Sara Mahmoud -> Fayoum Oasis, Minya Heritage
      { userIndex: 5, restaurantIndexes: [1, 4, 6, 8] }, // Khaled Mostafa -> Alexandria Seafood, Hurghada Beach Cafe, Sharm El Sheikh Delights, Port Said Marina
      { userIndex: 6, restaurantIndexes: [0, 3] }, // Mona Abdel Rahman -> Cairo Kitchen, Aswan Spices
      { userIndex: 7, restaurantIndexes: [2, 5, 8] }, // Youssef Farouk -> Luxor Grill, Giza Pyramid View, Port Said Marina
      { userIndex: 8, restaurantIndexes: [6, 7, 9] }, // Rania Said -> Sharm El Sheikh Delights, Fayoum Oasis, Minya Heritage
      { userIndex: 9, restaurantIndexes: [3, 9] }, // Amr Tarek -> Aswan Spices, Minya Heritage
    ];

    // Create relationships
    for (const relation of relationships) {
      const user = users[relation.userIndex];
      const followingRestaurants = relation.restaurantIndexes.map(idx => restaurants[idx]._id);

      // Update user with following relationships
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { following: followingRestaurants } }
      );

      // Update restaurants with follower relationships
      for (const restaurantIndex of relation.restaurantIndexes) {
        await db.collection('restaurants').updateOne(
          { _id: restaurants[restaurantIndex]._id },
          { $addToSet: { followers: user._id } }
        );
      }

      console.log(`✅ User ${user.fullName} now follows ${followingRestaurants.length} restaurants`);
    }

    // Create geospatial index for location-based queries
    console.log('🗺️ Creating geospatial index...');
    await db.collection('restaurants').createIndex({ "location": "2dsphere" });
    console.log('✅ Geospatial index created');

    // Display summary
    console.log('\n📊 Database seeding completed successfully!');
    console.log(`📍 Created ${restaurants.length} restaurants`);
    console.log(`👥 Created ${users.length} users`);
    console.log(`🔗 Created ${relationships.length} user-restaurant relationships`);

    // Show some sample data
    console.log('\n🔍 Sample data verification:');
    
    const sampleUser = await db.collection('users').findOne(
      { fullName: "Ahmed Hassan" },
      { populate: { path: 'following' } }
    );
    console.log(`User: ${sampleUser.fullName}`);
    console.log(`Favorite Cuisines: ${sampleUser.favoriteCuisines.join(', ')}`);
    console.log(`Following ${sampleUser.following.length} restaurants`);

    const sampleRestaurant = await db.collection('restaurants').findOne(
      { slug: "cairo-kitchen" }
    );
    console.log(`\nRestaurant: ${sampleRestaurant.englishName}`);
    console.log(`Cuisines: ${sampleRestaurant.cuisines.join(', ')}`);
    console.log(`Followers: ${sampleRestaurant.followers.length}`);
    console.log(`Location: [${sampleRestaurant.location.coordinates.join(', ')}]`);

  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  } finally {
    await client.close();
    console.log('📤 MongoDB connection closed');
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✨ Seeding process finished successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding process failed:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;