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
        
        this.initializeElements();
        this.bindEvents();
        this.showWelcomeScreen();
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
        this.startButton.addEventListener('click', () => this.startTest());
        this.prevButton.addEventListener('click', () => this.previousQuestion());
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        this.submitButton.addEventListener('click', () => this.submitAnswer());
        
        document.getElementById('reviewAnswers').addEventListener('click', () => this.showReviewScreen());
        document.getElementById('restartTest').addEventListener('click', () => this.restartTest());
        document.getElementById('backToResults').addEventListener('click', () => this.showResultsScreen());
        document.getElementById('prevReview').addEventListener('click', () => this.previousReview());
        document.getElementById('nextReview').addEventListener('click', () => this.nextReview());
    }
    
    prepareAllQuestions() {
        const questions = [];
        const sets = ['A', 'B', 'C', 'D', 'E'];
        
        sets.forEach(setLetter => {
            testData.sets[setLetter].questions.forEach((question, index) => {
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
    }
    
    showTestScreen() {
        this.hideAllScreens();
        this.testScreen.classList.remove('hidden');
    }
    
    showResultsScreen() {
        this.hideAllScreens();
        this.resultsScreen.classList.remove('hidden');
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
        this.showTestScreen();
        this.displayQuestion();
        this.startTimer();
    }
    
    startTimer() {
        setInterval(() => {
            if (this.testStartTime && !this.isReviewMode) {
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
            optionElement.addEventListener('click', () => this.selectOption(index));
            
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
    }
    
    updateProgress() {
        const progress = ((this.currentQuestion) / this.totalQuestions) * 100;
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
        this.showResultsScreen();
    }
    
    calculateResults() {
        const totalCorrect = this.userAnswers.filter(answer => answer.isCorrect).length;
        const totalQuestions = this.allQuestions.length;
        const percentage = Math.round((totalCorrect / totalQuestions) * 100);
        
        // Calculate set scores
        const setScores = {};
        ['A', 'B', 'C', 'D', 'E'].forEach(setLetter => {
            const setAnswers = this.userAnswers.filter(answer => 
                answer.questionId.startsWith(setLetter)
            );
            const setCorrect = setAnswers.filter(answer => answer.isCorrect).length;
            setScores[setLetter] = {
                correct: setCorrect,
                total: setAnswers.length,
                percentage: Math.round((setCorrect / setAnswers.length) * 100)
            };
        });
        
        // Determine performance level
        let performanceLevel = 'Below Average';
        if (totalCorrect >= 54) performanceLevel = 'Superior';
        else if (totalCorrect >= 45) performanceLevel = 'Above Average';
        else if (totalCorrect >= 35) performanceLevel = 'Average';
        
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
        
        this.totalScoreDisplay.textContent = `${results.totalCorrect}`;
        this.percentageDisplay.textContent = `${results.percentage}`;
        
        // Display set scores
        this.setScoresContainer.innerHTML = '';
        Object.entries(results.setScores).forEach(([setLetter, score]) => {
            const setScoreElement = document.createElement('div');
            setScoreElement.className = 'set-score';
            setScoreElement.innerHTML = `
                <h5>Level ${setLetter}</h5>
                <div>${score.correct}/12</div>
                <div>${score.percentage}%</div>
            `;
            this.setScoresContainer.appendChild(setScoreElement);
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
        this.showWelcomeScreen();
    }
}

// Initialize the test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RavenTest();
});