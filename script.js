class RavenTest {
    constructor() {
        this.currentSet = 'A';
        this.currentQuestion = 0;
        this.userAnswers = [];
        this.testStartTime = null;
        this.questionStartTime = null;
        this.allQuestions = this.prepareAllQuestions();
        this.totalQuestions = this.allQuestions.length;
        this.isReviewMode = false;
        this.reviewIndex = 0;
        this.isPaused = false;
        this.pausedTime = 0;
        this.selectedOptionIndex = -1;
        
        this.initializeAudio();
        this.initializeElements();
        this.bindEvents();
        this.clearPauseState(); // Ensure clean state on startup
        this.showWelcomeScreen();
    }
    
    initializeAudio() {
        // Initialize audio context for sound effects
        this.audioContext = null;
        this.sounds = {};
        
        // Try to initialize AudioContext
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSoundEffects();
        } catch (e) {
            console.warn('Audio not supported:', e);
        }
    }
    
    createSoundEffects() {
        // Create different sound effects using oscillators
        this.sounds = {
            click: () => this.playTone(800, 0.1, 'sine'),
            correct: () => this.playChord([523.25, 659.25, 783.99], 0.3, 'sine'), // C major chord
            incorrect: () => this.playTone(200, 0.5, 'sawtooth'),
            navigation: () => this.playTone(600, 0.08, 'triangle'),
            complete: () => this.playSequence([523.25, 659.25, 783.99, 1046.50], 0.15, 'sine')
        };
    }
    
    playTone(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playChord(frequencies, duration, type = 'sine') {
        frequencies.forEach(freq => this.playTone(freq, duration, type));
    }
    
    playSequence(frequencies, noteDuration, type = 'sine') {
        frequencies.forEach((freq, index) => {
            setTimeout(() => this.playTone(freq, noteDuration, type), index * noteDuration * 1000);
        });
    }
    
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }
    
    initializeElements() {
        // Screens
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.testScreen = document.getElementById('testScreen');
        this.resultsScreen = document.getElementById('resultsScreen');
        this.reviewScreen = document.getElementById('reviewScreen');
        
        // Progress and info
        this.progressFill = document.getElementById('progressFill');
        this.currentQuestionDisplay = document.getElementById('currentQuestion');
        this.currentSetDisplay = document.getElementById('currentSet');
        this.timeDisplay = document.getElementById('timeDisplay');
        
        // Test elements
        this.matrixPattern = document.getElementById('matrixPattern');
        this.answerOptions = document.getElementById('answerOptions');
        
        // Controls
        this.startButton = document.getElementById('startTest');
        this.prevButton = document.getElementById('prevBtn');
        this.nextButton = document.getElementById('nextBtn');
        this.submitButton = document.getElementById('submitAnswer');
        this.pauseButton = document.getElementById('pauseBtn');
        this.resumeButton = document.getElementById('resumeBtn');
        this.pauseOverlay = document.getElementById('pauseOverlay');
        
        // Force hide pause overlay initially
        if (this.pauseOverlay) {
            this.pauseOverlay.classList.add('hidden');
            this.pauseOverlay.style.display = 'none';
        }
        
        // Results elements
        this.totalScoreDisplay = document.getElementById('totalScore');
        this.percentageDisplay = document.getElementById('percentage');
        this.setScoresContainer = document.getElementById('setScores');
        this.performanceLevelDisplay = document.getElementById('performanceLevel');
        
        // Review elements
        this.reviewCounter = document.getElementById('reviewCounter');
        this.reviewQuestion = document.getElementById('reviewQuestion');
    }
    
    bindEvents() {
        this.startButton.addEventListener('click', () => {
            this.playSound('click');
            this.startTest();
        });
        this.prevButton.addEventListener('click', () => {
            this.playSound('navigation');
            this.previousQuestion();
        });
        this.nextButton.addEventListener('click', () => {
            this.playSound('navigation');
            this.nextQuestion();
        });
        this.submitButton.addEventListener('click', () => {
            this.playSound('click');
            this.submitAnswer();
        });
        this.pauseButton.addEventListener('click', () => {
            this.playSound('click');
            this.pauseTest();
        });
        this.resumeButton.addEventListener('click', () => {
            this.playSound('click');
            this.resumeTest();
        });
        
        // Allow clicking overlay background to resume
        this.pauseOverlay.addEventListener('click', (e) => {
            if (e.target === this.pauseOverlay) {
                this.playSound('click');
                if (!this.testScreen.classList.contains('hidden')) {
                    this.resumeTest();
                } else {
                    this.clearPauseState();
                }
            }
        });
        
        // Double-click anywhere on overlay for emergency clear
        this.pauseOverlay.addEventListener('dblclick', () => {
            this.clearPauseState();
        });
        
        document.getElementById('reviewAnswers').addEventListener('click', () => {
            this.playSound('click');
            this.showReviewScreen();
        });
        document.getElementById('restartTest').addEventListener('click', () => {
            this.playSound('click');
            this.restartTest();
        });
        document.getElementById('backToResults').addEventListener('click', () => {
            this.playSound('navigation');
            this.showResultsScreen();
        });
        document.getElementById('prevReview').addEventListener('click', () => {
            this.playSound('navigation');
            this.previousReview();
        });
        document.getElementById('nextReview').addEventListener('click', () => {
            this.playSound('navigation');
            this.nextReview();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Resume audio context on first user interaction (required by browsers)
        document.addEventListener('click', () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });
    }
    
    prepareAllQuestions() {
        const questions = [];
        const sets = ['A', 'B', 'C', 'D', 'E'];
        
        // Temporarily limit to 10 questions total (2 from each set)
        sets.forEach(setLetter => {
            testData.sets[setLetter].questions.slice(0, 2).forEach((question, index) => {
                questions.push({
                    ...question,
                    set: setLetter,
                    setIndex: index,
                    questionNumber: questions.length + 1,
                    correctAnswer: testData.answerKey[setLetter][index] - 1 // Convert to 0-based index
                });
            });
        });
        
        return questions;
    }
    
    showWelcomeScreen() {
        this.hideAllScreens();
        this.welcomeScreen.classList.remove('hidden');
        this.clearPauseState();
    }
    
    showTestScreen() {
        this.hideAllScreens();
        this.testScreen.classList.remove('hidden');
    }
    
    showResultsScreen() {
        this.hideAllScreens();
        this.resultsScreen.classList.remove('hidden');
        this.clearPauseState();
        this.displayResults();
    }
    
    showReviewScreen() {
        this.hideAllScreens();
        this.reviewScreen.classList.remove('hidden');
        this.isReviewMode = true;
        this.reviewIndex = 0;
        this.displayReviewQuestion();
    }
    
    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
    }
    
    startTest() {
        this.testStartTime = new Date();
        this.currentQuestion = 0;
        this.userAnswers = [];
        this.selectedOptionIndex = -1;
        this.pauseButton.style.display = 'inline-block';
        this.showTestScreen();
        this.displayQuestion();
        this.startTimer();
    }
    
    startTimer() {
        setInterval(() => {
            if (this.testStartTime && !this.isReviewMode && !this.isPaused) {
                const elapsed = new Date() - this.testStartTime;
                const minutes = Math.floor(elapsed / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                this.timeDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
    
    displayQuestion() {
        const question = this.allQuestions[this.currentQuestion];
        if (!question) return;
        
        this.questionStartTime = new Date();
        this.selectedOptionIndex = -1;
        
        // Update progress and info
        this.updateProgress();
        this.currentQuestionDisplay.textContent = `Question ${this.currentQuestion + 1}`;
        this.currentSetDisplay.textContent = `Level ${question.set}`;
        
        // Display matrix pattern
        this.displayMatrix(question);
        
        // Display answer options
        this.displayOptions(question);
        
        // Update controls
        this.updateControls();
    }
    
    displayMatrix(question) {
        this.matrixPattern.innerHTML = '';
        
        // Create 3x3 grid
        let cellIndex = 0;
        question.matrix.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement('div');
                cellElement.className = 'matrix-cell';
                
                if (cell === 'missing') {
                    cellElement.classList.add('missing');
                } else {
                    // Generate pattern based on cell type with unique index
                    const pattern = this.generatePattern(cell, question, cellIndex);
                    cellElement.innerHTML = pattern;
                }
                
                this.matrixPattern.appendChild(cellElement);
                cellIndex++;
            });
        });
    }
    
    generatePattern(patternType, question, cellIndex = 0) {
        // Use pattern rendering functions from testData
        if (testData.patterns[patternType]) {
            return testData.patterns[patternType]();
        }
        
        // Generate unique patterns for each position using the helper function
        if (testData.patterns.generateUniquePattern) {
            const setIndex = ['A', 'B', 'C', 'D', 'E'].indexOf(question.set);
            const questionIndex = question.setIndex || 0;
            return testData.patterns.generateUniquePattern(question.set, questionIndex + setIndex * 12, cellIndex);
        }
        
        // Enhanced fallback with more variation - size constrained
        const patterns = [
            // Dots pattern - constrained
            `<div class="pattern-element">
                <div style="display: grid; grid-template-columns: repeat(${Math.min(1 + (cellIndex % 3), 3)}, 1fr); gap: 2px; width: fit-content; margin: auto; max-width: 50px;">
                    ${Array.from({length: Math.min(1 + (cellIndex % 4), 6)}, () => 
                        `<div style="width: 6px; height: 6px; background: black; border-radius: 50%;"></div>`
                    ).join('')}
                </div>
            </div>`,
            
            // Shape pattern - size limited
            `<div class="pattern-element">
                <div style="width: ${Math.min(15 + cellIndex * 2, 35)}px; height: ${Math.min(15 + cellIndex * 2, 35)}px; background: black; ${cellIndex % 2 ? 'border-radius: 50%;' : ''} margin: auto;"></div>
            </div>`,
            
            // Line pattern - constrained
            `<div class="pattern-element">
                <div style="width: ${cellIndex % 2 ? '2px' : Math.min(25 + cellIndex * 2, 40) + 'px'}; height: ${cellIndex % 2 ? Math.min(25 + cellIndex * 2, 40) + 'px' : '2px'}; background: black; margin: auto;"></div>
            </div>`,
            
            // Triangle pattern - size limited
            `<div class="pattern-element">
                <div style="width: 0; height: 0; border-left: ${Math.min(8 + cellIndex, 15)}px solid transparent; border-right: ${Math.min(8 + cellIndex, 15)}px solid transparent; border-bottom: ${Math.min(12 + cellIndex * 2, 20)}px solid black; margin: auto;"></div>
            </div>`
        ];
        
        return patterns[cellIndex % patterns.length];
    }
    
    displayOptions(question) {
        this.answerOptions.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.dataset.optionIndex = index;
            
            // Generate option pattern with unique index (offset by 10 to differentiate from matrix cells)
            const pattern = this.generatePattern(option, question, index + 10);
            optionElement.innerHTML = pattern;
            
            // Add option label
            const label = document.createElement('div');
            label.className = 'option-label';
            label.textContent = (index + 1).toString();
            optionElement.appendChild(label);
            
            // Add click handler
            optionElement.addEventListener('click', () => {
                this.playSound('click');
                this.selectOption(index);
            });
            
            this.answerOptions.appendChild(optionElement);
        });
        
        // Restore previous selection if exists
        const userAnswer = this.userAnswers[this.currentQuestion];
        if (userAnswer !== undefined) {
            this.selectOption(userAnswer.selectedOption, false);
        }
    }
    
    selectOption(optionIndex, recordTime = true) {
        // Clear previous selections
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Select new option
        const selectedOption = document.querySelector(`[data-option-index="${optionIndex}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
        // Store selected option for keyboard navigation
        this.selectedOptionIndex = optionIndex;
        
        // Record answer
        const responseTime = recordTime ? new Date() - this.questionStartTime : 
                            (this.userAnswers[this.currentQuestion]?.responseTime || 0);
        
        this.userAnswers[this.currentQuestion] = {
            questionId: this.allQuestions[this.currentQuestion].id,
            selectedOption: optionIndex,
            responseTime: responseTime,
            isCorrect: optionIndex === this.allQuestions[this.currentQuestion].correctAnswer
        };
        
        // Enable submit button
        this.submitButton.disabled = false;
        
        // Update progress
        this.updateProgress();
    }
    
    updateProgress() {
        const answeredQuestions = this.userAnswers.filter(answer => answer !== undefined).length;
        const progress = (answeredQuestions / this.totalQuestions) * 100;
        this.progressFill.style.width = `${progress}%`;
    }
    
    updateControls() {
        this.prevButton.disabled = this.currentQuestion === 0;
        this.nextButton.disabled = !this.userAnswers[this.currentQuestion];
        this.submitButton.disabled = !this.userAnswers[this.currentQuestion];
        
        if (this.currentQuestion === this.totalQuestions - 1 && this.userAnswers[this.currentQuestion]) {
            this.nextButton.textContent = 'Finish Test';
        } else {
            this.nextButton.textContent = 'Next';
        }
    }
    
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.displayQuestion();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions - 1) {
            this.currentQuestion++;
            this.displayQuestion();
        } else {
            this.finishTest();
        }
    }
    
    submitAnswer() {
        if (this.userAnswers[this.currentQuestion]) {
            // Play sound feedback based on correctness
            const isCorrect = this.userAnswers[this.currentQuestion].isCorrect;
            this.playSound(isCorrect ? 'correct' : 'incorrect');
            
            if (this.currentQuestion === this.totalQuestions - 1) {
                this.finishTest();
            } else {
                this.nextQuestion();
            }
        }
    }
    
    finishTest() {
        this.updateProgress();
        this.progressFill.style.width = '100%';
        this.pauseButton.style.display = 'none';
        this.playSound('complete');
        this.showResultsScreen();
    }
    
    calculateResults() {
        const totalCorrect = this.userAnswers.filter(answer => answer.isCorrect).length;
        const totalQuestions = this.allQuestions.length;
        const percentage = Math.round((totalCorrect / totalQuestions) * 100);
        
        // Calculate set scores
        const setScores = {};
        ['A', 'B', 'C', 'D', 'E'].forEach(setLetter => {
            const setQuestions = this.allQuestions.filter(q => q.set === setLetter);
            const setAnswers = this.userAnswers.filter((answer, index) => 
                this.allQuestions[index] && this.allQuestions[index].set === setLetter
            );
            const setCorrect = setAnswers.filter(answer => answer && answer.isCorrect).length;
            setScores[setLetter] = {
                correct: setCorrect,
                total: setAnswers.length,
                percentage: setAnswers.length > 0 ? Math.round((setCorrect / setAnswers.length) * 100) : 0
            };
        });
        
        // Determine performance level (adjusted for 10 questions)
        let performanceLevel = 'Below Average';
        if (totalCorrect >= 9) performanceLevel = 'Superior';
        else if (totalCorrect >= 7) performanceLevel = 'Above Average';
        else if (totalCorrect >= 5) performanceLevel = 'Average';
        
        return {
            totalCorrect,
            totalQuestions,
            percentage,
            setScores,
            performanceLevel
        };
    }
    
    displayResults() {
        const results = this.calculateResults();
        
        this.totalScoreDisplay.textContent = `${results.totalCorrect}/${results.totalQuestions}`;
        this.percentageDisplay.textContent = `${results.percentage}%`;
        
        // Display set scores (only show levels with questions)
        this.setScoresContainer.innerHTML = '';
        Object.entries(results.setScores).forEach(([setLetter, score]) => {
            // Only display levels that have questions
            if (score.total > 0) {
                const setScoreElement = document.createElement('div');
                setScoreElement.className = 'set-score';
                setScoreElement.innerHTML = `
                    <h5>Level ${setLetter}:</h5>
                    <div>${score.correct}/${score.total}</div>
                    <div>${score.percentage}%</div>
                `;
                this.setScoresContainer.appendChild(setScoreElement);
            }
        });
        
        // Display performance level
        this.performanceLevelDisplay.textContent = results.performanceLevel;
        this.performanceLevelDisplay.className = `performance-level level-${results.performanceLevel.toLowerCase().replace(' ', '-')}`;
    }
    
    displayReviewQuestion() {
        if (this.reviewIndex < 0 || this.reviewIndex >= this.allQuestions.length) return;
        
        const question = this.allQuestions[this.reviewIndex];
        const userAnswer = this.userAnswers[this.reviewIndex];
        
        this.reviewCounter.textContent = `${this.reviewIndex + 1} / ${this.totalQuestions}`;
        
        // Create review question display
        this.reviewQuestion.innerHTML = `
            <div class="review-matrix">
                <h4>Question ${this.reviewIndex + 1} (Level ${question.set})</h4>
                <div class="matrix-pattern" id="reviewMatrix"></div>
            </div>
            <div class="review-options">
                <h4>Answer Options</h4>
                <div class="answer-options" id="reviewOptions"></div>
            </div>
            <div class="review-answer-info">
                <div class="answer-status ${userAnswer.isCorrect ? 'answer-correct' : 'answer-incorrect'}">
                    ${userAnswer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </div>
                <div>Your answer: Option ${userAnswer.selectedOption + 1}</div>
                <div>Correct answer: Option ${question.correctAnswer + 1}</div>
                <div>Response time: ${(userAnswer.responseTime / 1000).toFixed(1)}s</div>
                <div class="explanation">${question.explanation}</div>
            </div>
        `;
        
        // Display matrix and options for review
        this.displayReviewMatrix(question);
        this.displayReviewOptions(question, userAnswer);
    }
    
    displayReviewMatrix(question) {
        const reviewMatrix = document.getElementById('reviewMatrix');
        reviewMatrix.innerHTML = '';
        
        let cellIndex = 0;
        question.matrix.forEach((row) => {
            row.forEach((cell) => {
                const cellElement = document.createElement('div');
                cellElement.className = 'matrix-cell';
                
                if (cell === 'missing') {
                    cellElement.classList.add('missing');
                } else {
                    const pattern = this.generatePattern(cell, question, cellIndex);
                    cellElement.innerHTML = pattern;
                }
                
                reviewMatrix.appendChild(cellElement);
                cellIndex++;
            });
        });
    }
    
    displayReviewOptions(question, userAnswer) {
        const reviewOptions = document.getElementById('reviewOptions');
        reviewOptions.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            
            // Mark correct and user's answer
            if (index === question.correctAnswer) {
                optionElement.classList.add('correct');
            }
            if (index === userAnswer.selectedOption && !userAnswer.isCorrect) {
                optionElement.classList.add('incorrect');
            }
            
            const pattern = this.generatePattern(option, question, index + 10);
            optionElement.innerHTML = pattern;
            
            const label = document.createElement('div');
            label.className = 'option-label';
            label.textContent = (index + 1).toString();
            optionElement.appendChild(label);
            
            reviewOptions.appendChild(optionElement);
        });
    }
    
    previousReview() {
        if (this.reviewIndex > 0) {
            this.reviewIndex--;
            this.displayReviewQuestion();
        }
    }
    
    nextReview() {
        if (this.reviewIndex < this.totalQuestions - 1) {
            this.reviewIndex++;
            this.displayReviewQuestion();
        }
    }
    
    restartTest() {
        this.currentQuestion = 0;
        this.userAnswers = [];
        this.testStartTime = null;
        this.isReviewMode = false;
        this.isPaused = false;
        this.pausedTime = 0;
        this.selectedOptionIndex = -1;
        this.pauseButton.style.display = 'none';
        this.showWelcomeScreen();
    }
    
    handleKeyPress(event) {
        // Emergency escape - always allow Escape key to clear pause state
        if (event.key === 'Escape') {
            event.preventDefault();
            this.clearPauseState();
            return;
        }
        
        // Handle resume when paused
        if (this.isPaused) {
            if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                if (!this.testScreen.classList.contains('hidden')) {
                    this.resumeTest();
                } else {
                    this.clearPauseState();
                }
                return;
            }
        }
        
        // Only handle keys during test screen and when not paused
        if (!this.testScreen.classList.contains('hidden') && !this.isPaused) {
            switch(event.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    event.preventDefault();
                    this.navigateOptions(-1);
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    event.preventDefault();
                    this.navigateOptions(1);
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (this.selectedOptionIndex >= 0) {
                        this.playSound('click');
                        this.submitAnswer();
                    }
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                    event.preventDefault();
                    const optionIndex = parseInt(event.key) - 1;
                    if (optionIndex < 6) {
                        this.playSound('click');
                        this.selectOption(optionIndex);
                    }
                    break;
                case ' ':
                    event.preventDefault();
                    if (this.testStartTime && !this.testScreen.classList.contains('hidden')) {
                        this.pauseTest();
                    }
                    break;
            }
        }
    }
    
    navigateOptions(direction) {
        const totalOptions = 6;
        if (this.selectedOptionIndex === -1) {
            this.selectedOptionIndex = direction > 0 ? 0 : totalOptions - 1;
        } else {
            this.selectedOptionIndex = (this.selectedOptionIndex + direction + totalOptions) % totalOptions;
        }
        
        this.playSound('navigation');
        this.selectOption(this.selectedOptionIndex);
    }
    
    pauseTest() {
        // Only allow pausing during active test
        if (this.isPaused || this.testScreen.classList.contains('hidden') || !this.testStartTime) return;
        
        this.isPaused = true;
        this.pausedTime = new Date();
        if (this.pauseOverlay) {
            this.pauseOverlay.classList.remove('hidden');
            this.pauseOverlay.style.display = 'flex';
        }
        this.playSound('click');
    }
    
    resumeTest() {
        if (!this.isPaused) return;
        
        this.isPaused = false;
        const pauseDuration = new Date() - this.pausedTime;
        
        // Adjust start times to account for pause
        if (this.testStartTime) {
            this.testStartTime = new Date(this.testStartTime.getTime() + pauseDuration);
        }
        if (this.questionStartTime) {
            this.questionStartTime = new Date(this.questionStartTime.getTime() + pauseDuration);
        }
        
        if (this.pauseOverlay) {
            this.pauseOverlay.classList.add('hidden');
            this.pauseOverlay.style.display = 'none';
        }
        this.playSound('click');
    }
    
    clearPauseState() {
        this.isPaused = false;
        this.pausedTime = 0;
        if (this.pauseOverlay) {
            this.pauseOverlay.classList.add('hidden');
            this.pauseOverlay.style.display = 'none';
        }
    }
}

// Initialize the test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RavenTest();
});