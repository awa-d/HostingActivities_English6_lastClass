// script.js

class IceBreakerApp {
    constructor() {
        this.students = [];
        this.selectedStudent = null;
        this.timer = null;
        this.timeLeft = 180; // 3 minutes in seconds
        this.defaultTime = 180;
        this.isTimerRunning = false;
        this.usedStudents = new Set();
        
        this.initializeElements();
        this.bindEvents();
        this.loadFromLocalStorage();
        this.updateDisplay();
    }

    initializeElements() {
        this.elements = {
            spinButton: document.getElementById('spinButton'),
            studentName: document.getElementById('studentName'),
            timer: document.getElementById('timer'),
            startTimerButton: document.getElementById('startTimerButton'),
            studentsList: document.getElementById('studentsList'),
            newStudentInput: document.getElementById('newStudent'),
            addStudentButton: document.getElementById('addStudent'),
            decreaseTimeButton: document.getElementById('decreaseTime'),
            increaseTimeButton: document.getElementById('increaseTime'),
            resetButton: document.getElementById('resetApp'),
            currentSpeaker: document.getElementById('currentSpeaker'),
            toggleListButton: document.getElementById('toggleList'),
            studentsContainer: document.getElementById('studentsContainer'),
            customizeButton: document.getElementById('customizeButton'),
            customizeModal: document.getElementById('customizeModal'),
            closeModal: document.querySelector('.close-modal'),
            primaryColorInput: document.getElementById('primaryColor'),
            secondaryColorInput: document.getElementById('secondaryColor'),
            accentColorInput: document.getElementById('accentColor'),
            defaultTimeInput: document.getElementById('defaultTime'),
            saveCustomizationButton: document.getElementById('saveCustomization'),
            buzzerSound: document.getElementById('buzzerSound')
        };
    }

    bindEvents() {
        // Main functionality
        this.elements.spinButton.addEventListener('click', () => this.spinForStudent());
        this.elements.startTimerButton.addEventListener('click', () => this.toggleTimer());
        this.elements.addStudentButton.addEventListener('click', () => this.addStudent());
        this.elements.newStudentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addStudent();
        });
        
        // Timer controls
        this.elements.decreaseTimeButton.addEventListener('click', () => this.adjustTime(-30));
        this.elements.increaseTimeButton.addEventListener('click', () => this.adjustTime(30));
        this.elements.resetButton.addEventListener('click', () => this.resetApp());
        
        // List toggle
        this.elements.toggleListButton.addEventListener('click', () => this.toggleStudentsList());
        
        // Customization
        this.elements.customizeButton.addEventListener('click', () => this.openCustomizeModal());
        this.elements.closeModal.addEventListener('click', () => this.closeCustomizeModal());
        this.elements.saveCustomizationButton.addEventListener('click', () => this.saveCustomization());
        
        // Modal click outside to close
        this.elements.customizeModal.addEventListener('click', (e) => {
            if (e.target === this.elements.customizeModal) {
                this.closeCustomizeModal();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && !e.target.matches('input')) {
                e.preventDefault();
                this.spinForStudent();
            }
            if (e.key === 'Enter' && this.selectedStudent && !this.isTimerRunning) {
                this.toggleTimer();
            }
            if (e.key === 'Escape') {
                this.closeCustomizeModal();
            }
        });
    }

    addStudent() {
        const name = this.elements.newStudentInput.value.trim();
        if (name && !this.students.includes(name)) {
            this.students.push(name);
            this.elements.newStudentInput.value = '';
            this.updateStudentsList();
            this.saveToLocalStorage();
            this.showNotification(`${name} added to the list!`);
        } else if (this.students.includes(name)) {
            this.showNotification(`${name} is already in the list!`, 'warning');
        }
    }

    removeStudent(studentName) {
        const index = this.students.indexOf(studentName);
        if (index > -1) {
            this.students.splice(index, 1);
            this.usedStudents.delete(studentName);
            this.updateStudentsList();
            this.saveToLocalStorage();
            this.showNotification(`${studentName} removed from the list!`);
            
            // Reset selection if the removed student was selected
            if (this.selectedStudent === studentName) {
                this.selectedStudent = null;
                this.elements.studentName.textContent = "Whose turn is it?";
                this.elements.currentSpeaker.textContent = "None";
                this.elements.startTimerButton.disabled = true;
                this.stopTimer();
            }
        }
    }

    spinForStudent() {
        if (this.students.length === 0) {
            this.showNotification('Please add some participants first!', 'warning');
            return;
        }

        if (this.isTimerRunning) {
            this.showNotification('Timer is running! Stop it first.', 'warning');
            return;
        }

        // Reset used students if everyone has been selected
        if (this.usedStudents.size >= this.students.length) {
            this.usedStudents.clear();
            this.showNotification('Everyone has had a turn! Starting fresh.', 'success');
        }

        // Get available students
        const availableStudents = this.students.filter(student => !this.usedStudents.has(student));
        
        if (availableStudents.length === 0) {
            this.showNotification('No more students available!', 'warning');
            return;
        }

        // Add spinning animation
        this.elements.spinButton.classList.add('spinning');
        this.elements.spinButton.disabled = true;

        // Simulate spinning with random names
        let spinCount = 0;
        const maxSpins = 20;
        const spinInterval = setInterval(() => {
            const randomStudent = availableStudents[Math.floor(Math.random() * availableStudents.length)];
            this.elements.studentName.textContent = randomStudent;
            spinCount++;

            if (spinCount >= maxSpins) {
                clearInterval(spinInterval);
                
                // Select final student
                const finalStudent = availableStudents[Math.floor(Math.random() * availableStudents.length)];
                this.selectedStudent = finalStudent;
                this.usedStudents.add(finalStudent);
                
                this.elements.studentName.textContent = finalStudent;
                this.elements.currentSpeaker.textContent = finalStudent;
                this.elements.startTimerButton.disabled = false;
                
                // Remove spinning animation
                this.elements.spinButton.classList.remove('spinning');
                this.elements.spinButton.disabled = false;
                
                // Reset timer
                this.timeLeft = this.defaultTime;
                this.updateTimerDisplay();
                
                // Highlight selected student in list
                this.updateStudentsList();
                
                // Celebration effect
                this.celebrateSelection();
                
                this.saveToLocalStorage();
            }
        }, 100);
    }

    celebrateSelection() {
        // Confetti effect
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
        
        // Sound effect (if audio is working)
        try {
            this.elements.buzzerSound.currentTime = 0;
            this.elements.buzzerSound.play().catch(() => {
                // Ignore audio errors
            });
        } catch (e) {
            // Ignore audio errors
        }
    }

    toggleTimer() {
        if (this.isTimerRunning) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        if (!this.selectedStudent) return;
        
        this.isTimerRunning = true;
        this.elements.startTimerButton.textContent = 'Stop Timer';
        this.elements.spinButton.disabled = true;
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.stopTimer();
                this.showNotification('Time\'s up!', 'warning');
                this.celebrateTimeUp();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.isTimerRunning = false;
        this.elements.startTimerButton.textContent = 'Start the 3 minutes';
        this.elements.spinButton.disabled = false;
        this.elements.timer.classList.remove('warning', 'critical');
    }

    celebrateTimeUp() {
        // More intense confetti
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 200,
                spread: 90,
                origin: { y: 0.6 }
            });
        }
        
        // Flash effect
        document.body.style.background = '#FF4081';
        setTimeout(() => {
            document.body.style.background = '';
        }, 500);
    }

    adjustTime(seconds) {
        if (this.isTimerRunning) return;
        
        this.timeLeft = Math.max(30, Math.min(600, this.timeLeft + seconds));
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        this.elements.timer.textContent = display;
        
        // Add warning/critical classes
        this.elements.timer.classList.remove('warning', 'critical');
        if (this.timeLeft <= 30) {
            this.elements.timer.classList.add('critical');
        } else if (this.timeLeft <= 60) {
            this.elements.timer.classList.add('warning');
        }
    }

    updateStudentsList() {
        this.elements.studentsList.innerHTML = '';
        
        this.students.forEach(student => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${student}</span>
                <button class="remove-student" onclick="app.removeStudent('${student}')">×</button>
            `;
            
            if (student === this.selectedStudent) {
                li.classList.add('selected');
            }
            
            this.elements.studentsList.appendChild(li);
        });
    }

    toggleStudentsList() {
        this.elements.studentsContainer.classList.toggle('hidden');
    }

    openCustomizeModal() {
        this.elements.customizeModal.style.display = 'block';
        
        // Set current values
        const rootStyles = getComputedStyle(document.documentElement);
        this.elements.primaryColorInput.value = this.rgbToHex(rootStyles.getPropertyValue('--primary-color').trim()) || '#FF4081';
        this.elements.secondaryColorInput.value = this.rgbToHex(rootStyles.getPropertyValue('--secondary-color').trim()) || '#6200EA';
        this.elements.accentColorInput.value = this.rgbToHex(rootStyles.getPropertyValue('--accent-color').trim()) || '#FFAB00';
        this.elements.defaultTimeInput.value = this.defaultTime;
    }

    closeCustomizeModal() {
        this.elements.customizeModal.style.display = 'none';
    }

    saveCustomization() {
        const primaryColor = this.elements.primaryColorInput.value;
        const secondaryColor = this.elements.secondaryColorInput.value;
        const accentColor = this.elements.accentColorInput.value;
        const defaultTime = parseInt(this.elements.defaultTimeInput.value);
        
        // Update CSS variables
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--secondary-color', secondaryColor);
        document.documentElement.style.setProperty('--accent-color', accentColor);
        
        // Update default time
        this.defaultTime = defaultTime;
        if (!this.isTimerRunning) {
            this.timeLeft = defaultTime;
            this.updateTimerDisplay();
        }
        
        this.saveToLocalStorage();
        this.closeCustomizeModal();
        this.showNotification('Customization saved!', 'success');
    }

    rgbToHex(rgb) {
        if (rgb.startsWith('#')) return rgb;
        
        const values = rgb.match(/\d+/g);
        if (!values) return '';
        
        return '#' + values.map(val => {
            const hex = parseInt(val).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    resetApp() {
        if (confirm('Are you sure you want to reset everything? This will clear all participants and settings.')) {
            this.students = [];
            this.selectedStudent = null;
            this.usedStudents.clear();
            this.stopTimer();
            this.timeLeft = this.defaultTime;
            
            this.elements.studentName.textContent = "Whose turn is it?";
            this.elements.currentSpeaker.textContent = "None";
            this.elements.startTimerButton.disabled = true;
            this.elements.newStudentInput.value = '';
            
            this.updateStudentsList();
            this.updateTimerDisplay();
            this.saveToLocalStorage();
            
            this.showNotification('App reset successfully!', 'success');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#4CAF50';
                break;
            case 'warning':
                notification.style.backgroundColor = '#FF9800';
                break;
            case 'error':
                notification.style.backgroundColor = '#F44336';
                break;
            default:
                notification.style.backgroundColor = '#2196F3';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    saveToLocalStorage() {
        const data = {
            students: this.students,
            selectedStudent: this.selectedStudent,
            usedStudents: Array.from(this.usedStudents),
            timeLeft: this.timeLeft,
            defaultTime: this.defaultTime,
            customColors: {
                primary: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
                secondary: getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim(),
                accent: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim()
            }
        };
        
        localStorage.setItem('iceBreakerData', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        try {
            const data = JSON.parse(localStorage.getItem('iceBreakerData'));
            if (data) {
                this.students = data.students || [];
                this.selectedStudent = data.selectedStudent || null;
                this.usedStudents = new Set(data.usedStudents || []);
                this.timeLeft = data.timeLeft || this.defaultTime;
                this.defaultTime = data.defaultTime || 180;
                
                // Load custom colors
                if (data.customColors) {
                    document.documentElement.style.setProperty('--primary-color', data.customColors.primary);
                    document.documentElement.style.setProperty('--secondary-color', data.customColors.secondary);
                    document.documentElement.style.setProperty('--accent-color', data.customColors.accent);
                }
            }
        } catch (error) {
            console.log('No saved data found or error loading data');
        }
    }

    updateDisplay() {
        this.updateStudentsList();
        this.updateTimerDisplay();
        
        if (this.selectedStudent) {
            this.elements.studentName.textContent = this.selectedStudent;
            this.elements.currentSpeaker.textContent = this.selectedStudent;
            this.elements.startTimerButton.disabled = false;
        } else {
            this.elements.studentName.textContent = "Whose turn is it?";
            this.elements.currentSpeaker.textContent = "None";
            this.elements.startTimerButton.disabled = true;
        }
    }

    // Additional utility methods
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Keyboard shortcuts help
    showKeyboardShortcuts() {
        const shortcuts = `
            Keyboard Shortcuts:
            • Space: Spin for next student
            • Enter: Start/Stop timer (when student is selected)
            • Escape: Close modals
        `;
        this.showNotification(shortcuts, 'info');
    }

    // Export/Import functionality
    exportData() {
        const data = {
            students: this.students,
            settings: {
                defaultTime: this.defaultTime,
                customColors: {
                    primary: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
                    secondary: getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim(),
                    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim()
                }
            }
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'icebreaker-data.json';
        link.click();
        
        this.showNotification('Data exported successfully!', 'success');
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.students) {
                    this.students = data.students;
                }
                
                if (data.settings) {
                    this.defaultTime = data.settings.defaultTime || 180;
                    
                    if (data.settings.customColors) {
                        document.documentElement.style.setProperty('--primary-color', data.settings.customColors.primary);
                        document.documentElement.style.setProperty('--secondary-color', data.settings.customColors.secondary);
                        document.documentElement.style.setProperty('--accent-color', data.settings.customColors.accent);
                    }
                }
                
                this.timeLeft = this.defaultTime;
                this.selectedStudent = null;
                this.usedStudents.clear();
                
                this.updateDisplay();
                this.saveToLocalStorage();
                
                this.showNotification('Data imported successfully!', 'success');
            } catch (error) {
                this.showNotification('Error importing data. Please check the file format.', 'error');
            }
        };
        
        reader.readAsText(file);
    }

    // Statistics
    getStats() {
        return {
            totalStudents: this.students.length,
            studentsWhoSpoke: this.usedStudents.size,
            remainingStudents: this.students.length - this.usedStudents.size,
            currentSpeaker: this.selectedStudent,
            timeRemaining: this.formatTime(this.timeLeft),
            isTimerRunning: this.isTimerRunning
        };
    }

    displayStats() {
        const stats = this.getStats();
        const statsMessage = `
            Statistics:
            • Total Participants: ${stats.totalStudents}
            • Have Spoken: ${stats.studentsWhoSpoke}
            • Remaining: ${stats.remainingStudents}
            • Current Speaker: ${stats.currentSpeaker || 'None'}
            • Time Left: ${stats.timeRemaining}
        `;
        
        console.log(statsMessage);
        return stats;
    }

    // Auto-save functionality
    startAutoSave() {
        setInterval(() => {
            this.saveToLocalStorage();
        }, 30000); // Save every 30 seconds
    }

    // Initialize features that require user interaction
    initializeAdvancedFeatures() {
        // Add drag and drop for participant reordering
        this.initializeDragAndDrop();
        
        // Add bulk import functionality
        this.initializeBulkImport();
        
        // Start auto-save
        this.startAutoSave();
    }

    initializeDragAndDrop() {
        // This would implement drag and drop reordering of students
        // Simplified implementation
        this.elements.studentsList.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'LI') {
                e.dataTransfer.setData('text/plain', e.target.textContent.replace('×', '').trim());
            }
        });
    }

    initializeBulkImport() {
        // Add ability to paste multiple names at once
        this.elements.newStudentInput.addEventListener('paste', (e) => {
            setTimeout(() => {
                const pastedText = this.elements.newStudentInput.value;
                const names = pastedText.split(/[,\n\t]/).map(name => name.trim()).filter(name => name);
                
                if (names.length > 1) {
                    this.elements.newStudentInput.value = '';
                    names.forEach(name => {
                        if (name && !this.students.includes(name)) {
                            this.students.push(name);
                        }
                    });
                    this.updateStudentsList();
                    this.saveToLocalStorage();
                    this.showNotification(`${names.length} participants added!`, 'success');
                }
            }, 100);
        });
    }
}

// Initialize the app when the page loads
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new IceBreakerApp();
    
    // Initialize advanced features after a short delay
    setTimeout(() => {
        app.initializeAdvancedFeatures();
    }, 1000);
    
    // Add some default students for demo purposes if none exist
    if (app.students.length === 0) {
        const demoStudents = ['Jeanne', 'Sarah', 'Niass', 'PAN', 'Samba','Célina', 'Bousso', 'Malick', 'Hilda', 'KC','Faye','Awa', 'KD', 'Rayan', 'Tamsir', 'Salam'];
        demoStudents.forEach(name => {
            app.students.push(name);
        });
        app.updateStudentsList();
        app.saveToLocalStorage();
    }
});

// Prevent page refresh on spacebar
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
    }
});

// Handle page visibility change to pause timer when tab is not active
document.addEventListener('visibilitychange', () => {
    if (document.hidden && app && app.isTimerRunning) {
        // Optional: pause timer when tab is not visible
        // app.stopTimer();
        // app.showNotification('Timer paused due to tab change', 'info');
    }
});

// Service Worker registration for PWA support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export app instance for debugging
window.iceBreakerApp = app;