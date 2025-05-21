// Global variables
let currentQuizQuestion = 0;
let quizScore = 0;
let expressions = [  
    "It's raining cats and dogs",       // B1
    "Break a leg",                      // B1
    "Piece of cake",                    // B1
    "Hit the hay",                      // B1
    "Under the weather",                // B1
    "Spill the beans",                 // B2
    "Break the ice",                  // B2
    "Let the cat out of the bag",     // B2
    "Bite the bullet",                // B2
    "Once in a blue moon",            // B2
    "Burn the midnight oil",          // C1
    "The ball is in your court",      // C1
    "Throw in the towel",             // C1
    "Jump on the bandwagon",          // C1
    "Bark up the wrong tree"          // C2
];

let quizQuestions = [
    {
        question: "What does 'break the ice' mean?",
        options: [
            "To literally break ice",
            "To start a conversation",
            "To be very cold",
            "To make ice cream"
        ],
        correct: 1
    },
    {
        question: "What does 'piece of cake' mean?",
        options: [
            "A slice of cake",
            "Something very easy",
            "A birthday party",
            "Delicious food"
        ],
        correct: 1
    },
    {
        question: "What does 'hit the hay' mean?",
        options: [
            "To punch something",
            "To work on a farm",
            "To go to sleep",
            "To make noise"
        ],
        correct: 2
    },
    {
        question: "What does 'spill the beans' mean?",
        options: [
            "To make a mess",
            "To cook beans",
            "To reveal a secret",
            "To waste food"
        ],
        correct: 2
    },
    {
        question: "What does 'break a leg' mean?",
        options: [
            "To injure yourself",
            "Good luck",
            "To dance badly",
            "To run fast"
        ],
        correct: 1
    },
    {
        question: "What does 'it's raining cats and dogs' mean?",
        options: [
            "Animals are falling from the sky",
            "It's raining very heavily",
            "It's snowing",
            "There are pets outside"
        ],
        correct: 1
    },
    {
        question: "What does 'under the weather' mean?",
        options: [
            "To be outside",
            "To feel sick",
            "To feel cold",
            "To predict the weather"
        ],
        correct: 1
    },
    {
        question: "What does 'let the cat out of the bag' mean?",
        options: [
            "To release a cat",
            "To spill a secret unintentionally",
            "To hide something",
            "To find a surprise"
        ],
        correct: 1
    },
    {
        question: "What does 'bite the bullet' mean?",
        options: [
            "To eat something hard",
            "To face something difficult bravely",
            "To get hurt",
            "To be silent"
        ],
        correct: 1
    },
    {
        question: "What does 'once in a blue moon' mean?",
        options: [
            "Something that happens rarely",
            "A night festival",
            "Something very strange",
            "A cold evening"
        ],
        correct: 0
    },
    {
        question: "What does 'burn the midnight oil' mean?",
        options: [
            "To cause a fire",
            "To waste energy",
            "To study or work late into the night",
            "To sleep very late"
        ],
        correct: 2
    },
    {
        question: "What does 'the ball is in your court' mean?",
        options: [
            "You are in a game",
            "It’s your decision or move",
            "You play sports",
            "Someone else is watching"
        ],
        correct: 1
    },
    {
        question: "What does 'throw in the towel' mean?",
        options: [
            "To clean something",
            "To stop trying or give up",
            "To throw away old clothes",
            "To help someone"
        ],
        correct: 1
    },
    {
        question: "What does 'jump on the bandwagon' mean?",
        options: [
            "To dance with music",
            "To join a popular trend",
            "To ride a vehicle",
            "To play in a band"
        ],
        correct: 1
    },
    {
        question: "What does 'bark up the wrong tree' mean?",
        options: [
            "To yell at a dog",
            "To be confused about trees",
            "To pursue the wrong idea or person",
            "To climb a tree"
        ],
        correct: 2
    }
];


// Activity management functions
function enableActivity(activityNumber) {
    const activityRow = document.getElementById(`activity-${activityNumber}`);
    const statusElement = activityRow.querySelector('.activity-status');
    const buttonElement = activityRow.querySelector('.activity-button');
    
    // Update status
    statusElement.classList.remove('locked');
    statusElement.classList.add('unlocked');
    statusElement.textContent = '🔓 Ready to go!';
    
    // Update button
    buttonElement.classList.remove('disabled');
    buttonElement.classList.add('enabled');
    buttonElement.disabled = false;
    
    // Add click event based on activity type
    if (activityNumber === 1) {
        buttonElement.onclick = () => openModal('quiz-modal');
    } else if (activityNumber === 2) {
        buttonElement.onclick = () => openModal('guess-modal');
    } else if (activityNumber === 3) {
        buttonElement.onclick = () => openModal('message-modal');
    }
    
    // Add celebration animation
    activityRow.style.animation = 'celebration 0.6s ease';
    setTimeout(() => {
        activityRow.style.animation = '';
    }, 600);
}

function resetAll() {
    for (let i = 1; i <= 3; i++) {
        const activityRow = document.getElementById(`activity-${i}`);
        const statusElement = activityRow.querySelector('.activity-status');
        const buttonElement = activityRow.querySelector('.activity-button');
        
        // Reset status
        statusElement.classList.remove('unlocked');
        statusElement.classList.add('locked');
        
        // Reset button
        buttonElement.classList.remove('enabled');
        buttonElement.classList.add('disabled');
        buttonElement.disabled = true;
        buttonElement.onclick = null;
        
        // Reset specific statuses
        if (i === 1) {
            statusElement.textContent = '🔒 Waiting...';
        } else if (i === 2) {
            statusElement.textContent = '🔒 Get ready!';
        } else if (i === 3) {
            statusElement.textContent = '🔒 Hidden for now';
        }
    }
    
    // Reset quiz
    currentQuizQuestion = 0;
    quizScore = 0;
    updateQuizDisplay();
    
    // Clear message wall (except teacher's message)
    const messagesDisplay = document.getElementById('messages-display');
    messagesDisplay.innerHTML = '<div class="message-item"><strong>Teacher:</strong> Welcome to our celebration! 🎉</div>';
    
    showNotification('All activities have been reset! 🔄');
}

// Modal management functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    
    // Initialize specific modal content
    if (modalId === 'quiz-modal') {
        updateQuizDisplay();
    } else if (modalId === 'guess-modal') {
        newExpression();
    }
    
    // Add opening animation
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'modalSlideIn 0.3s ease';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Moderator panel functions
function toggleModeratorPanel() {
    const panel = document.getElementById('moderator-panel');
    const isVisible = panel.style.display === 'block';
    panel.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
        panel.style.animation = 'slideInRight 0.3s ease';
    }
}

// Quiz functions
function updateQuizDisplay() {
    if (currentQuizQuestion >= quizQuestions.length) {
        // Quiz completed
        document.getElementById('quiz-question').innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h2>🎉 Quiz Completed! 🎉</h2>
                <p style="font-size: 1.5rem; margin: 20px 0;">Your final score: ${quizScore}/${quizQuestions.length}</p>
                <p style="font-size: 1.2rem; color: #27ae60;">
                    ${quizScore === quizQuestions.length ? "Perfect score! Amazing! 🌟" : 
                      quizScore >= quizQuestions.length * 0.8 ? "Great job! Well done! 👏" :
                      quizScore >= quizQuestions.length * 0.6 ? "Good effort! Keep it up! 👍" :
                      "Nice try! Practice makes perfect! 💪"}
                </p>
                <button onclick="restartQuiz()" style="padding: 15px 30px; background: linear-gradient(45deg, #74b9ff, #0984e3); color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 1.1rem; font-weight: bold; margin-top: 20px;">
                    Start Over
                </button>
            </div>
        `;
        return;
    }
    
    const question = quizQuestions[currentQuizQuestion];
    document.getElementById('quiz-question').innerHTML = `
        <h3>Question ${currentQuizQuestion + 1}:</h3>
        <p style="font-size: 1.2rem; margin: 15px 0; color: #2c3e50;">${question.question}</p>
        <div class="quiz-options">
            ${question.options.map((option, index) => 
                `<button class="quiz-option" onclick="checkAnswer(this, ${index === question.correct})" data-index="${index}">
                    ${String.fromCharCode(65 + index)}) ${option}
                </button>`
            ).join('')}
        </div>
    `;
    
    document.getElementById('score').textContent = quizScore;
}

function checkAnswer(button, isCorrect) {
    const allOptions = document.querySelectorAll('.quiz-option');
    
    // Disable all options
    allOptions.forEach(option => {
        option.disabled = true;
        option.style.cursor = 'not-allowed';
    });
    
    // Mark correct and wrong answers
    if (isCorrect) {
        button.classList.add('correct');
        quizScore++;
        showNotification('Correct! Well done! ✅', 'success');
    } else {
        button.classList.add('wrong');
        // Highlight the correct answer
        const correctIndex = quizQuestions[currentQuizQuestion].correct;
        allOptions[correctIndex].classList.add('correct');
        showNotification('Oops! Try to remember this one! ❌', 'error');
    }
    
    // Move to next question after a delay
    setTimeout(() => {
        currentQuizQuestion++;
        updateQuizDisplay();
    }, 2000);
}

function restartQuiz() {
    currentQuizQuestion = 0;
    quizScore = 0;
    updateQuizDisplay();
}

// Guess the expression functions
function newExpression() {
    const randomIndex = Math.floor(Math.random() * expressions.length);
    const expression = expressions[randomIndex];
    document.getElementById('current-expression').textContent = `"${expression}"`;
    
    // Add animation
    const expressionElement = document.getElementById('current-expression');
    expressionElement.style.animation = 'bounce 0.6s ease';
    setTimeout(() => {
        expressionElement.style.animation = '';
    }, 600);
}

// Message wall functions
function addMessage() {
    const nameInput = document.getElementById('student-name');
    const messageInput = document.getElementById('message-text');
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    
    if (!name || !message) {
        showNotification('Please enter both your name and message! 📝', 'warning');
        return;
    }
    
    const messagesDisplay = document.getElementById('messages-display');
    const messageElement = document.createElement('div');
    messageElement.className = 'message-item';
    messageElement.innerHTML = `<strong>${escapeHtml(name)}:</strong> ${escapeHtml(message)}`;
    
    // Add animation
    messageElement.style.animation = 'slideInLeft 0.3s ease';
    messagesDisplay.appendChild(messageElement);
    
    // Clear inputs
    nameInput.value = '';
    messageInput.value = '';
    
    // Scroll to bottom
    messagesDisplay.scrollTop = messagesDisplay.scrollHeight;
    
    showNotification('Message added! 💌', 'success');
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style based on type
    const styles = {
        success: { background: '#27ae60', color: 'white' },
        error: { background: '#e74c3c', color: 'white' },
        warning: { background: '#f39c12', color: 'white' },
        info: { background: '#3498db', color: 'white' }
    };
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '15px 25px',
        borderRadius: '25px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        zIndex: '3000',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
        animation: 'slideDown 0.3s ease',
        ...styles[type]
    });
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add additional CSS animations for JavaScript effects
const additionalStyles = `
    @keyframes celebration {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); background: linear-gradient(45deg, #00b894, #00cec9); }
        100% { transform: scale(1); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideInLeft {
        from { transform: translateX(-20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideDown {
        from { transform: translate(-50%, -20px); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, -20px); opacity: 0; }
    }
`;

// Add the additional styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Add welcome message
    setTimeout(() => {
        showNotification('Welcome to the English 6 Closing Party! 🎉', 'success');
    }, 1000);
    
    // Add some interactive effects to buffet items
    const buffetItems = document.querySelectorAll('.buffet-item');
    buffetItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            item.style.animation = 'bounce 0.6s ease';
            setTimeout(() => {
                item.style.animation = '';
            }, 600);
            
            const foodEmojis = ['🐑', '🧃', '🍍🍉🍓'];
            showNotification(`Yummy! Enjoy your ${item.querySelector('.item-name').textContent}! ${foodEmojis[index]}`, 'success');
        });
    });
    
    // Add hover effects to section headers
    const sectionHeaders = document.querySelectorAll('section h2');
    sectionHeaders.forEach(header => {
        header.addEventListener('mouseenter', () => {
            header.style.transform = 'scale(1.05)';
            header.style.transition = 'transform 0.3s ease';
        });
        
        header.addEventListener('mouseleave', () => {
            header.style.transform = 'scale(1)';
        });
    });
    
    // Initialize quiz
    updateQuizDisplay();
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Press 'M' to toggle moderator panel
    if (event.key.toLowerCase() === 'm' && event.ctrlKey) {
        event.preventDefault();
        toggleModeratorPanel();
    }
    
    // Press 'Escape' to close modals
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
});

// Add party mode (fun Easter egg)
let partyModeClicks = 0;
document.querySelector('.party-banner h1').addEventListener('click', function() {
    partyModeClicks++;
    if (partyModeClicks >= 5) {
        document.body.style.animation = 'rainbow 1s infinite';
        showNotification('🎊 PARTY MODE ACTIVATED! 🎊', 'success');
        
        // Add confetti effect
        for (let i = 0; i < 50; i++) {
            createConfetti();
        }
        
        // Reset after 5 seconds
        setTimeout(() => {
            document.body.style.animation = '';
            partyModeClicks = 0;
        }, 5000);
    }
});

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        top: -10px;
        left: ${Math.random() * 100}%;
        width: 10px;
        height: 10px;
        background: ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)]};
        border-radius: 50%;
        animation: confettiFall 3s linear forwards;
        z-index: 1000;
        pointer-events: none;
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        document.body.removeChild(confetti);
    }, 3000);
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(confettiStyle);