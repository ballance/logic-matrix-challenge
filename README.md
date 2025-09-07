# Logic Matrix Challenge

A web-based implementation of Raven's Progressive Matrices - a visual reasoning and pattern recognition test that challenges users to identify logical patterns and complete visual sequences.

## What It Does

The Logic Matrix Challenge is an interactive cognitive assessment tool that presents users with visual matrix puzzles. Each puzzle consists of a 3x3 grid with one missing piece, and users must identify which of the provided options correctly completes the pattern.

### Features

- **Progressive Difficulty**: 5 levels (A through E) with increasing complexity
- **Comprehensive Testing**: 12 questions per level (60 total questions)
- **Real-time Progress**: Visual progress bar and timer
- **Performance Analytics**: Detailed scoring with percentage breakdown by level
- **Answer Review**: Complete review system to examine all questions and explanations
- **Performance Categorization**: Results categorized into performance levels (Superior, Above Average, Average, etc.)

### Test Structure

- **Level A**: Simple pattern completion (dots, basic shapes)
- **Level B**: Shape sequences and rotations
- **Level C**: More complex pattern recognition
- **Level D**: Advanced logical relationships
- **Level E**: Highest difficulty with intricate visual reasoning

Each question includes:
- Visual matrix pattern with one missing piece
- 6 multiple choice options
- Detailed explanations for learning
- Performance tracking and timing

## Setup and Installation

### Prerequisites

This is a pure HTML/CSS/JavaScript application with no dependencies or build process required.

### Quick Start

1. **Clone or Download**:
   ```bash
   git clone <repository-url>
   cd logic-matrix-challenge
   ```

2. **Run Locally**:
   Simply open `index.html` in any modern web browser:
   - Double-click the `index.html` file, or
   - Use a local development server (recommended):

   **Using Python**:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Using Node.js (if you have it)**:
   ```bash
   npx serve .
   # or
   npx http-server
   ```

   **Using VS Code Live Server**:
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

3. **Access the Application**:
   - If using a development server: Navigate to `http://localhost:8000` (or the port specified)
   - If opening directly: The file will open in your default browser

## File Structure

```
logic-matrix-challenge/
├── index.html          # Main HTML structure and UI
├── script.js           # Core application logic and test management
├── styles.css          # All styling and responsive design
├── testData.js         # Test questions, patterns, and answer data
└── README.md           # This documentation
```

### Key Components

- **`index.html`**: Contains the complete UI structure including welcome screen, test interface, results display, and review system
- **`script.js`**: Implements the `RavenTest` class that manages the entire test lifecycle, scoring, and user interactions
- **`testData.js`**: Contains all 60 test questions organized by difficulty level, including patterns, correct answers, and explanations
- **`styles.css`**: Responsive CSS that handles the visual presentation of matrix patterns, animations, and UI states

## Usage

### Taking the Test

1. **Start**: Click "Start Challenge" on the welcome screen
2. **Navigate**: Use Previous/Next buttons or submit answers to progress
3. **Answer**: Click on one of the 6 options to select your answer
4. **Submit**: Click "Submit Answer" to confirm and move to the next question
5. **Complete**: View your results with detailed performance breakdown
6. **Review**: Use "Review Answers" to see all questions with explanations

### Features During Test

- **Progress Tracking**: Visual progress bar shows completion status
- **Timing**: Real-time timer tracks total test duration
- **Navigation**: Move between questions before final submission
- **Level Indication**: Clear display of current level and question number

### Results Analysis

After completion, you'll see:
- **Total Score**: X/60 questions correct with percentage
- **Level Breakdown**: Performance on each difficulty level
- **Performance Category**: Classification of your cognitive performance
- **Review Option**: Detailed review of all questions with explanations

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Responsive**: Works on tablets and mobile devices
- **No Internet Required**: Fully offline after initial load

## Development Notes

The application uses vanilla JavaScript with no external dependencies, making it lightweight and easy to modify. The modular structure allows for:

- Easy addition of new question sets in `testData.js`
- Simple styling modifications in `styles.css`
- Extensible test logic in the `RavenTest` class

## Performance Considerations

- All assets are loaded locally for fast performance
- Optimized CSS for smooth animations and transitions
- Efficient DOM manipulation for responsive user interactions
- Memory-conscious design suitable for extended test sessions

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.