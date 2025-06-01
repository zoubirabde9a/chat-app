# AI Chat Application

An interactive chat application with an AI agent and Three.js visualization.

## Features

- Real-time chat interface with AI agent
- Beautiful Three.js particle visualization
- Support for OpenRouter API
- Responsive design
- Environment variable configuration

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_KEY=your_api_key_here
   VITE_API_BASE_URL=https://openrouter.ai/api/v1
   VITE_MODEL_NAME=gpt-3.5-turbo
   ```
   Replace `your_api_key_here` with your actual API key.

## Running the Application

To start the development server:
```bash
npm start
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Technologies Used

- Three.js for 3D visualization
- OpenAI API client
- Vite for development and building
- Modern JavaScript (ES6+)