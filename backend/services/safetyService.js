const mongoose = require('mongoose');

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://CheetahHeKehde:cheetah123@cluster0.rmm14vv.mongodb.net/CheetahHeKhede', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// Safety Data Schema
const safetySchema = new mongoose.Schema({
    category: String,
    title: String,
    description: String,
    steps: [String],
    warnings: [String],
    keywords: [String]
});

const SafetyData = mongoose.model('FilterData', safetySchema);

// Function to get safety information based on query
const getSafetyInfo = async (query) => {
    try {
        // Convert query to lowercase for case-insensitive search
        const searchQuery = query.toLowerCase();
        
        // Search in the database
        const safetyData = await SafetyData.find({
            $or: [
                { keywords: { $regex: searchQuery, $options: 'i' } },
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } }
            ]
        });

        if (safetyData.length === 0) {
            return null;
        }

        // Format the response
        const response = safetyData.map(data => ({
            category: data.category,
            title: data.title,
            description: data.description,
            steps: data.steps,
            warnings: data.warnings
        }));

        return response;
    } catch (error) {
        console.error('Error fetching safety data:', error);
        throw error;
    }
};

module.exports = {
    connectDB,
    getSafetyInfo
}; 