// Quiz questions with different types
const allQuestions = [
    {
        type: 'single',
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correct: 2,
        points: 10
    },
    {
        type: 'multiple',
        question: 'Which of these are programming languages?',
        options: ['Python', 'Cobra', 'Java', 'Coffee'],
        correct: [0, 2],
        points: 15
    },
    {
        type: 'fill',
        question: 'HTML stands for _____ Text Markup Language.',
        correct: 'Hyper',
        points: 10
    },
    {
        type: 'single',
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correct: 1,
        points: 10
    },
    {
        type: 'multiple',
        question: 'Which of these are web browsers?',
        options: ['Chrome', 'Firefox', 'Window', 'Safari'],
        correct: [0, 1, 3],
        points: 15
    },
    {
        type: 'single',
        question: 'What is the largest ocean on Earth?',
        options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
        correct: 3,
        points: 10
    },
    {
        type: 'multiple',
        question: 'Which of these are primary colors?',
        options: ['Red', 'Green', 'Blue', 'Yellow'],
        correct: [0, 2, 3],
        points: 15
    },
    {
        type: 'fill',
        question: 'The process of converting water into vapor is called _____.',
        correct: 'evaporation',
        points: 10
    },
    {
        type: 'single',
        question: 'Who painted the Mona Lisa?',
        options: ['Van Gogh', 'Da Vinci', 'Picasso', 'Michelangelo'],
        correct: 1,
        points: 10
    },
    {
        type: 'multiple',
        question: 'Which of these countries are in Europe?',
        options: ['France', 'Egypt', 'Spain', 'Italy'],
        correct: [0, 2, 3],
        points: 15
    }
];

// Quiz state
let currentQuestion = 0;
let score = 0;
let questions = [];
let userAnswers = [];
let timeLeft;
let timerInterval;
let usedQuestionIndices = new Set();
let selectedQuestionCount = 5; // Default question count

// Additional DOM Elements
const reviewScreen = document.getElementById('review-screen');
const reviewContainer = document.getElementById('review-container');
const backToResultsBtn = document.getElementById('back-to-results');
const countBtns = document.querySelectorAll('.count-btn');
const questionCountDisplay = document.getElementById('question-count');

// Additional Event Listeners
backToResultsBtn.addEventListener('click', () => {
    reviewScreen.classList.remove('active');
    resultsScreen.classList.add('active');
});

countBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        countBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedQuestionCount = parseInt(btn.dataset.count);
        questionCountDisplay.textContent = `${selectedQuestionCount} Questions`;
    });
});

// Get random questions with specified count
function getRandomQuestions(count = selectedQuestionCount) {
    const availableIndices = [];
    
    for (let i = 0; i < allQuestions.length; i++) {
        if (!usedQuestionIndices.has(i)) {
            availableIndices.push(i);
        }
    }

    if (availableIndices.length < count) {
        usedQuestionIndices.clear();
        for (let i = 0; i < allQuestions.length; i++) {
            availableIndices.push(i);
        }
    }

    for (let i = availableIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
    }

    const selectedQuestions = [];
    for (let i = 0; i < count; i++) {
        const index = availableIndices[i];
        usedQuestionIndices.add(index);
        selectedQuestions.push(allQuestions[index]);
    }

    return selectedQuestions;
}

// Initialize quiz
function initializeQuiz() {
    questions = getRandomQuestions();
    userAnswers = new Array(questions.length).fill(null);
    currentQuestion = 0;
    score = 0;
    updateQuizInfo();
}

// Update quiz information display
function updateQuizInfo() {
    const statsContainer = document.querySelector('.stats');
    if (statsContainer) {
        const questionCountSpan = statsContainer.querySelector('.stat span');
        if (questionCountSpan) {
            questionCountSpan.textContent = `${questions.length} Questions`;
        }
    }
}

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const questionText = document.getElementById('question-text');
const questionType = document.getElementById('question-type');
const optionsContainer = document.getElementById('options-container');
const textInputContainer = document.getElementById('text-input-container');
const fillBlankInput = document.getElementById('fill-blank-input');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const progressBar = document.querySelector('.progress-bar');
const questionNumber = document.getElementById('question-number');
const timerDisplay = document.getElementById('timer');
const scorePercentage = document.getElementById('score-percentage');
const correctAnswers = document.getElementById('correct-answers');
const incorrectAnswers = document.getElementById('incorrect-answers');
const timeTaken = document.getElementById('time-taken');
const reviewBtn = document.getElementById('review-btn');
const restartBtn = document.getElementById('restart-btn');

// Event Listeners
startBtn.addEventListener('click', startQuiz);
prevBtn.addEventListener('click', showPreviousQuestion);
nextBtn.addEventListener('click', showNextQuestion);
submitBtn.addEventListener('click', submitQuiz);
reviewBtn.addEventListener('click', reviewAnswers);
restartBtn.addEventListener('click', restartQuiz);

// Start the quiz
function startQuiz() {
    welcomeScreen.classList.remove('active');
    quizScreen.classList.add('active');
    timeLeft = 15 * 60; // 15 minutes in seconds
    startTimer();
    showQuestion();
}

// Timer functionality
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            submitQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Show question
function showQuestion() {
    const question = questions[currentQuestion];
    questionText.textContent = question.question;
    questionType.textContent = getQuestionTypeText(question.type);
    questionNumber.textContent = `Question ${currentQuestion + 1}/${questions.length}`;
    updateProgressBar();
    
    // Clear previous content
    optionsContainer.innerHTML = '';
    textInputContainer.classList.add('hidden');
    fillBlankInput.value = '';

    if (question.type === 'fill') {
        textInputContainer.classList.remove('hidden');
        if (userAnswers[currentQuestion]) {
            fillBlankInput.value = userAnswers[currentQuestion];
        }
    } else {
        question.options.forEach((option, index) => {
            const optionElement = createOptionElement(option, index, question.type);
            optionsContainer.appendChild(optionElement);
        });
    }

    updateNavigationButtons();
}

function getQuestionTypeText(type) {
    switch (type) {
        case 'single':
            return 'Single Choice Question';
        case 'multiple':
            return 'Multiple Choice Question (Select all that apply)';
        case 'fill':
            return 'Fill in the Blank';
        default:
            return '';
    }
}

function createOptionElement(option, index, type) {
    const div = document.createElement('div');
    div.className = 'option';
    div.textContent = option;

    if (type === 'multiple') {
        if (Array.isArray(userAnswers[currentQuestion]) && 
            userAnswers[currentQuestion].includes(index)) {
            div.classList.add('selected');
        }
    } else if (userAnswers[currentQuestion] === index) {
        div.classList.add('selected');
    }

    div.addEventListener('click', () => handleOptionClick(div, index, type));
    return div;
}

function handleOptionClick(element, index, type) {
    if (type === 'multiple') {
        element.classList.toggle('selected');
        const selected = Array.from(optionsContainer.children)
            .map((option, i) => option.classList.contains('selected') ? i : null)
            .filter(i => i !== null);
        userAnswers[currentQuestion] = selected;
    } else {
        Array.from(optionsContainer.children).forEach(option => {
            option.classList.remove('selected');
        });
        element.classList.add('selected');
        userAnswers[currentQuestion] = index;
    }
}

// Navigation
function showPreviousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function showNextQuestion() {
    if (currentQuestion < questions.length - 1) {
        saveCurrentAnswer();
        currentQuestion++;
        showQuestion();
    }
}

function saveCurrentAnswer() {
    const question = questions[currentQuestion];
    if (question.type === 'fill') {
        userAnswers[currentQuestion] = fillBlankInput.value.trim();
    }
}

function updateNavigationButtons() {
    prevBtn.style.visibility = currentQuestion === 0 ? 'hidden' : 'visible';
    if (currentQuestion === questions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.style.display = 'block';
        submitBtn.classList.add('hidden');
    }
}

function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Submit and Results
function submitQuiz() {
    saveCurrentAnswer();
    clearInterval(timerInterval);
    calculateResults();
    quizScreen.classList.remove('active');
    resultsScreen.classList.add('active');
}

function calculateResults() {
    let correct = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        totalPoints += question.points;

        if (question.type === 'fill') {
            if (userAnswer && userAnswer.toLowerCase() === question.correct.toLowerCase()) {
                correct++;
                earnedPoints += question.points;
            }
        } else if (question.type === 'multiple') {
            if (arraysEqual(userAnswer, question.correct)) {
                correct++;
                earnedPoints += question.points;
            }
        } else {
            if (userAnswer === question.correct) {
                correct++;
                earnedPoints += question.points;
            }
        }
    });

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    scorePercentage.textContent = `${percentage}%`;
    correctAnswers.textContent = correct;
    incorrectAnswers.textContent = questions.length - correct;
    
    const timeSpent = 15 * 60 - timeLeft;
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    timeTaken.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function arraysEqual(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    return sorted1.every((value, index) => value === sorted2[index]);
}

// Review answers functionality
function reviewAnswers() {
    resultsScreen.classList.remove('active');
    reviewScreen.classList.add('active');
    
    reviewContainer.innerHTML = '';
    questions.forEach((question, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        // Question text and type
        reviewItem.innerHTML = `
            <h3>${index + 1}. ${question.question}</h3>
            <div class="review-question-type">${getQuestionTypeText(question.type)}</div>
        `;

        if (question.type === 'fill') {
            // Fill in the blank review
            const userAnswer = userAnswers[index] || '';
            const isCorrect = userAnswer.toLowerCase() === question.correct.toLowerCase();
            
            reviewItem.innerHTML += `
                <div class="review-fill">
                    <p>Your Answer: <span class="answer ${isCorrect ? 'correct' : 'incorrect'}">${userAnswer || '(No answer)'}</span></p>
                    <p>Correct Answer: <span class="answer correct">${question.correct}</span></p>
                </div>
            `;
        } else {
            // Multiple choice review
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'review-options';
            
            question.options.forEach((option, optionIndex) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'review-option';
                
                const isCorrect = question.type === 'multiple' 
                    ? question.correct.includes(optionIndex)
                    : question.correct === optionIndex;
                
                const isSelected = question.type === 'multiple'
                    ? Array.isArray(userAnswers[index]) && userAnswers[index].includes(optionIndex)
                    : userAnswers[index] === optionIndex;

                if (isSelected) optionElement.classList.add('user-selected');
                if (isCorrect) optionElement.classList.add('correct');
                if (isSelected && !isCorrect) optionElement.classList.add('incorrect');

                optionElement.innerHTML = `
                    ${isCorrect ? '<i class="fas fa-check"></i>' : ''}
                    ${isSelected && !isCorrect ? '<i class="fas fa-times"></i>' : ''}
                    ${option}
                `;
                
                optionsContainer.appendChild(optionElement);
            });
            
            reviewItem.appendChild(optionsContainer);
        }

        reviewContainer.appendChild(reviewItem);
    });
}

function restartQuiz() {
    initializeQuiz(); // Get new random questions
    resultsScreen.classList.remove('active');
    welcomeScreen.classList.add('active');
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', initializeQuiz); 