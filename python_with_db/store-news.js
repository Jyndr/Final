const axios = require('axios');
const { spawn } = require('child_process');

async function getRealTimeNews(location) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', ['okdone.py', location]);
    let newsData = '';

    pythonProcess.stdout.on('data', (data) => {
      newsData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      // Don't reject on stderr since it might contain non-error messages
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      try {
        // Parse the output to extract news articles
        const lines = newsData.split('\n');
        const articles = [];
        let currentArticle = null;
        let inArticleSection = false;

        for (const line of lines) {
          // Skip empty lines and lines containing setup messages
          if (!line.trim() || line.includes('already installed') || line.includes('downloading') || 
              line.includes('Warning:') || line.includes('weights of') || line.includes('Using device:')) {
            continue;
          }

          // Start collecting articles after seeing the table header
          if (line.includes('Source') && line.includes('Trust Score (%)')) {
            inArticleSection = true;
            continue;
          }

          if (inArticleSection) {
            // Skip separator lines
            if (line.startsWith('---') || line.startsWith('===')) {
              continue;
            }

            // Extract article data
            const parts = line.split('  ').filter(p => p.trim());
            if (parts.length >= 4) {
              articles.push({
                source: parts[0].trim(),
                title: parts[1].trim(),
                url: parts[2].trim(),
                trust_score: parseFloat(parts[3].trim())
              });
            }
          }
        }

        if (articles.length === 0) {
          console.warn('No articles found in Python script output');
        }

        resolve(articles);
      } catch (error) {
        console.error('Error parsing Python output:', error);
        reject(error);
      }
    });
  });
}

async function storeNews() {
  try {
    // Get location from command line arguments or use default
    const location = process.argv[2] || 'India';
    console.log(`Fetching real-time news data for ${location}...`);
    
    // Get real-time news data
    const newsData = await getRealTimeNews(location);
    console.log(`Fetched ${newsData.length} articles`);

    // Transform data to match MongoDB schema
    const transformedData = newsData.map(article => ({
      source: article.source,
      title: article.title,
      url: article.url,
      trust_score: article.trust_score,
      location: location,
      timestamp: new Date()
    }));

    // Store the articles in MongoDB
    const response = await axios.post('http://localhost:3000/api/news', transformedData);
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

storeNews(); 