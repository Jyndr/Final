# Disaster Safety Dashboard

A comprehensive disaster management and safety information system that provides real-time updates, emergency protocols, and safety guidelines.

## Features

- Real-time disaster news and updates
- Weather monitoring and alerts
- Emergency transport coordination
- Safety chatbot with AI-powered responses
- Emergency medical services information
- Emergency communications system
- Emergency protocols and guidelines
- Emergency responder profiles
- Alert settings and notifications

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- OpenAI GPT-3.5 API
- WebSocket for real-time communication
- OpenWeatherMap API
- Leaflet.js for mapping
- Chart.js for data visualization

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/disaster-safety.git
```

2. Navigate to the project directory:
```bash
cd disaster-safety
```

3. Open `index.html` in your web browser or set up a local server.

4. Configure API keys:
   - Create a `.env` file in the root directory
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_api_key_here
     ```
   - Add your OpenWeatherMap API key:
     ```
     OPENWEATHER_API_KEY=your_api_key_here
     ```

## Project Structure

```
disaster-safety/
├── css/
│   └── dashboard.css
├── js/
│   └── dashboard.js
├── disas-news/
│   ├── news.html
│   ├── news.css
│   └── news.js
├── index.html
├── README.md
└── .env
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for the GPT-3.5 API
- OpenWeatherMap for weather data
- Leaflet.js for mapping functionality
- Chart.js for data visualization 