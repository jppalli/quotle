# Quotle - Daily Quote Puzzle Game

A daily word puzzle game where you unscramble quotes from famous authors and thinkers.

## Features

- 🎯 Daily quote puzzles with scrambled words
- 🏆 Achievement system with rewards
- 💧 Ink drops currency system
- 📅 Calendar view of past puzzles
- 📊 Statistics tracking
- 🎵 Background music and sound effects
- 📱 Mobile-responsive design

## Tech Stack

- Vanilla JavaScript (ES6+)
- HTML5 & CSS3
- Arkadium SDK integration
- LocalStorage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jppalli/quotle.git
cd quotle
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm start
```

The game will be available at `http://localhost:8080`

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy with default settings

Alternatively, deploy directly:
```bash
npm install -g vercel
vercel
```

## Project Structure

```
quotle/
├── index.html              # Main HTML file
├── game-modern.js          # Core game logic
├── quote-manager.js        # Quote management system
├── quotes_calendar.js      # Quote data
├── achievements-manager.js # Achievement system
├── arkadium-integration.js # Arkadium SDK integration
├── scramble-utils.js       # Word scrambling utilities
├── server.js              # Development server
├── assets/                # Images and logos
├── sounds/                # Audio files
└── vercel.json           # Vercel configuration

```

## Game Mechanics

1. **Daily Puzzle**: A new quote puzzle is available each day
2. **Word Scrambling**: Select scrambled words to unscramble them
3. **Letter Selection**: Click available letters to form the correct word
4. **Hints**: Use ink drops to reveal letters or unscramble words
5. **Achievements**: Complete challenges to earn rewards

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - see LICENSE file for details

## Author

Created with ❤️ for word puzzle enthusiasts
