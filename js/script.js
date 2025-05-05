// Navigation and section handling
let currentSection = 1;
const totalSections = 8;

// Define questions array in global scope
const questions = [
    {
        id: 'q1',
        correctAnswer: 4,
        feedback: 'Toenemende sportdeelname is geen belangrijke reden voor de inzet van zorgtechnologie. De belangrijkste redenen zijn vergrijzing, personeelstekorten en stijgende zorgkosten.'
    },
    {
        id: 'q2',
        correctAnswer: 4,
        feedback: 'Verdiepen is geen onderdeel van het basis V-model. De basis competenties zijn: Veranderen, Vinden, Vertrouwen, Vaardig gebruiken en Vertellen.'
    },
    {
        id: 'q3',
        correctAnswer: 2,
        feedback: 'Volgens het TAM-model is nuttigheid (perceived usefulness) de belangrijkste factor voor technologie acceptatie, gevolgd door gebruiksgemak (perceived ease of use).'
    },
    {
        id: 'mc2',
        correctAnswer: 2,
        feedback: 'De GGD AppStore is specifiek ontworpen om gezondheidsapps te beoordelen op gebruiksvriendelijkheid, privacy, betrouwbaarheid en onderbouwing. Het is een onafhankelijke bron die apps test volgens landelijke richtlijnen.'
    }
];

// --- Sidebar Navigatie Logica ---
const chapters = [
  { section: 1, title: 'Introductie' },
  { section: 2, title: 'Soorten Zorgtechnologie' },
  { section: 3, title: 'De Kracht van Technologie' },
  { section: 4, title: 'Kritisch Kijken' },
  { section: 5, title: 'Adoptie & Gedrag' },
  { section: 6, title: 'Jij aan Zet' },
  { section: 7, title: 'Vinden van Zorgtechnologie' },
  { section: 8, title: 'Afsluiting' }
];

function updateProgress() {
    const progressPercentage = ((currentSection - 1) / (totalSections - 1)) * 100;
    
    // Update progress fill
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = `${progressPercentage}%`;
    }
    
    // Update percentage text
    const progressText = document.getElementById('progress-percentage');
    if (progressText) {
        progressText.textContent = `${Math.round(progressPercentage)}%`;
    }
    
    // Update chapter points
    document.querySelectorAll('.chapter-point').forEach((point, index) => {
        if (index + 1 < currentSection) {
            point.classList.add('completed');
            point.classList.remove('active');
        } else if (index + 1 === currentSection) {
            point.classList.add('active');
            point.classList.remove('completed');
        } else {
            point.classList.remove('completed', 'active');
        }
    });
}

function showSection(sectionNumber) {
    // First scroll to top immediately
    window.scrollTo(0, 0);
    
    // Hide all sections first
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    
    // Show the selected section
    const targetSection = document.querySelector(`section[data-section="${sectionNumber}"]`);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
    
    // Update current section and progress
    currentSection = sectionNumber;
    updateProgress();
    
    // Sidebar: update active state
    document.querySelectorAll('.sidebar-chapter').forEach(ch => ch.classList.remove('active'));
    const activeSidebar = document.querySelector(`.sidebar-chapter[data-section="${sectionNumber}"]`);
    if (activeSidebar) activeSidebar.classList.add('active');
    
    // Force scroll to top after a small delay to ensure DOM updates are complete
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }, 50);
    }
}

function nextSection() {
    if (currentSection < totalSections) {
        showSection(currentSection + 1);
    }
}

function prevSection() {
    if (currentSection > 1) {
        showSection(currentSection - 1);
    }
}

// Multiple Choice functionality
function initializeMultipleChoice() {
    console.log('Initializing Multiple Choice questions...');
    
    // Add click handlers for all multiple choice options
    const mcOptions = document.querySelectorAll('.mc-option');
    console.log(`Found ${mcOptions.length} MC options`);
    
    mcOptions.forEach((option, index) => {
        console.log(`Setting up click handler for option ${index + 1}`);
        
        option.addEventListener('click', function(e) {
            console.log('MC option clicked:', this.textContent);
            
            // Get the question container and feedback element
            const questionContainer = this.closest('.mc-question');
            const feedbackElement = questionContainer.querySelector('.feedback');
            const questionId = feedbackElement.id.split('-')[0];
            
            console.log('Question ID:', questionId);
            
            // Find the question data
            const question = questions.find(q => q.id === questionId);
            if (!question) {
                console.error(`Question data not found for ID: ${questionId}`);
                return;
            }
            
            const selectedId = parseInt(this.getAttribute('data-id'));
            console.log('Selected answer ID:', selectedId);
            
            // Remove selected class from all options in this question
            questionContainer.querySelectorAll('.mc-option').forEach(opt => {
                opt.classList.remove('selected', 'correct', 'incorrect');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Check if answer is correct
            const isCorrect = selectedId === question.correctAnswer;
            console.log('Answer is:', isCorrect ? 'correct' : 'incorrect');
            
            // Add correct/incorrect class
            this.classList.add(isCorrect ? 'correct' : 'incorrect');
            
            // Show feedback
            feedbackElement.textContent = question.feedback;
            feedbackElement.className = 'feedback ' + (isCorrect ? 'correct' : 'incorrect');
            
            // Save MC score
            saveMCScore(questionId, isCorrect ? 1 : 0, 1);
        });
    });
}

// --- Drag & Drop logica per hoofdstuk ---
function initializeDragAndDrop() {
    // Hoofdstuk 2
    const draggables2 = document.querySelectorAll('#section2 .draggable');
    const dropTargets2 = document.querySelectorAll('#section2 .drop-target');
    draggables2.forEach(draggable => {
        draggable.setAttribute('draggable', true);
        draggable.addEventListener('dragstart', function(e) {
            this.classList.add('dragging');
            e.dataTransfer.setData('text/plain', this.getAttribute('data-id'));
        });
        draggable.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    dropTargets2.forEach(target => {
        target.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        target.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });
        target.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const draggedId = e.dataTransfer.getData('text/plain');
            const draggable = document.querySelector('#section2 .draggable[data-id="' + draggedId + '"]');
            if (draggable && draggable.parentElement) {
                draggable.parentElement.removeChild(draggable);
            }
            this.appendChild(draggable);
            checkDragDropResults2();
        });
    });

    // Hoofdstuk 3
    const draggables3 = document.querySelectorAll('#section3 .draggable');
    const dropTargets3 = document.querySelectorAll('#section3 .drop-target');
    draggables3.forEach(draggable => {
        draggable.setAttribute('draggable', true);
        draggable.addEventListener('dragstart', function(e) {
            this.classList.add('dragging');
            e.dataTransfer.setData('text/plain', this.getAttribute('data-id'));
        });
        draggable.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    dropTargets3.forEach(target => {
        target.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        target.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });
        target.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const draggedId = e.dataTransfer.getData('text/plain');
            const draggable = document.querySelector('#section3 .draggable[data-id="' + draggedId + '"]');
            if (draggable && draggable.parentElement) {
                draggable.parentElement.removeChild(draggable);
            }
            this.appendChild(draggable);
            checkDragDropResults3();
        });
    });
}

// Hoofdstuk 2: Categoriseer de Voorbeelden
function checkDragDropResults2() {
    const dropTargets = document.querySelectorAll('#section2 .drop-target');
    let correctCount = 0;
    let totalPlaced = 0;
    // Juiste combinaties:
    // 1: Fysio.ai, 2: Blazepods, 3: Corpus VR, 4: Physitrack
    const correctCombinations = {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4'
    };
    dropTargets.forEach(target => {
        const targetId = target.getAttribute('data-id');
        const draggable = target.querySelector('.draggable');
        if (draggable) {
            totalPlaced++;
            const draggableId = draggable.getAttribute('data-id');
            if (correctCombinations[targetId] === draggableId) {
                correctCount++;
                draggable.classList.add('correct');
                draggable.classList.remove('incorrect');
            } else {
                draggable.classList.add('incorrect');
                draggable.classList.remove('correct');
            }
        }
    });
    // Feedback
    let feedback = document.getElementById('dragdrop2-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.id = 'dragdrop2-feedback';
        feedback.className = 'dragdrop-feedback';
        dropTargets[dropTargets.length-1].after(feedback);
    }
    if (totalPlaced === dropTargets.length) {
        if (correctCount === totalPlaced) {
            feedback.innerHTML = "Goed gedaan! Je hebt alle voorbeelden correct gecategoriseerd.";
            feedback.classList.remove('incorrect');
            feedback.classList.add('correct');
        } else {
            feedback.innerHTML = "Niet alle voorbeelden zijn correct geplaatst. Probeer het opnieuw.";
            feedback.classList.remove('correct');
            feedback.classList.add('incorrect');
        }
        saveDragDropScore2(correctCount, totalPlaced);
    } else {
        feedback.innerHTML = '';
    }
}
function saveDragDropScore2(correct, total) {
    localStorage.setItem('dragdrop2_correct', correct);
    localStorage.setItem('dragdrop2_total', total);
    updateAllChapterProgress();
}

// Hoofdstuk 3: Koppel technologie aan voordelen
function checkDragDropResults3() {
    const dropTargets = document.querySelectorAll('#section3 .drop-target');
    let correctCount = 0;
    let totalPlaced = 0;
    // Juiste combinaties:
    // 1: Bewegingsanalyse-apps (Fysio.ai), 2: Virtual Reality (Corpus VR), 3: eHealth Platforms (Physitrack)
    const correctCombinations = {
        '1': '1', // Bewegingsanalyse-apps <-> Verhoogde therapietrouw
        '2': '2', // Virtual Reality <-> Objectieve bewegingsanalyse
        '3': '3'  // eHealth Platforms <-> Motiverende gameomgeving
    };
    dropTargets.forEach(target => {
        const targetId = target.getAttribute('data-id');
        const draggable = target.querySelector('.draggable');
        if (draggable) {
            totalPlaced++;
            const draggableId = draggable.getAttribute('data-id');
            if (correctCombinations[targetId] === draggableId) {
                correctCount++;
                draggable.classList.add('correct');
                draggable.classList.remove('incorrect');
            } else {
                draggable.classList.add('incorrect');
                draggable.classList.remove('correct');
            }
        }
    });
    // Feedback
    let feedback = document.getElementById('dragdrop3-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.id = 'dragdrop3-feedback';
        feedback.className = 'dragdrop-feedback';
        dropTargets[dropTargets.length-1].after(feedback);
    }
    if (totalPlaced === dropTargets.length) {
        if (correctCount === totalPlaced) {
            feedback.innerHTML = "Goed gedaan! Je hebt alle technologieën correct gekoppeld aan de voordelen.";
            feedback.classList.remove('incorrect');
            feedback.classList.add('correct');
        } else {
            feedback.innerHTML = "Niet alle koppelingen zijn correct. Probeer het opnieuw.";
            feedback.classList.remove('correct');
            feedback.classList.add('incorrect');
        }
        saveDragDropScore3(correctCount, totalPlaced);
    } else {
        feedback.innerHTML = '';
    }
}
function saveDragDropScore3(correct, total) {
    localStorage.setItem('dragdrop3_correct', correct);
    localStorage.setItem('dragdrop3_total', total);
    updateAllChapterProgress();
}

// Reflection questions
function saveReflection(sectionNumber) {
    const reflectionInput = document.getElementById(`reflection${sectionNumber}`);
    const answer = reflectionInput.value.trim();
    
    if (answer.length < 50) {
        alert('Je antwoord moet minimaal 50 tekens bevatten.');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem(`reflection_${sectionNumber}`, answer);
    
    // Show confirmation
    alert('Je reflectie is opgeslagen!');
}

// Save scores
function saveMCScore(questionNumber, correct, total) {
    localStorage.setItem(`mc${questionNumber}_correct`, correct);
    localStorage.setItem(`mc${questionNumber}_total`, total);
    
    // Update total MC score
    const mc1Correct = parseInt(localStorage.getItem('mc1_correct') || 0);
    const mc2Correct = parseInt(localStorage.getItem('mc2_correct') || 0);
    localStorage.setItem('mc_correct', mc1Correct + mc2Correct);
    localStorage.setItem('mc_total', 2);
}

function updateAllChapterProgress() {
  let chapterProgress = Array(chapters.length).fill(0);
  // Hoofdstuk 1: reflectie ingevuld = compleet
  if (localStorage.getItem('reflection_1')) chapterProgress[0] = 1;
  // Hoofdstuk 2: reflectie én dragdrop2 (beide = 1, één = 0.5)
  let h2 = 0;
  if (localStorage.getItem('reflection_2')) h2++;
  const dragdrop2 = parseInt(localStorage.getItem('dragdrop2_correct') || 0);
  if (dragdrop2 > 0) h2++;
  if (h2 === 2) chapterProgress[1] = 1;
  else if (h2 === 1) chapterProgress[1] = 0.5;
  // Hoofdstuk 3: reflectie én dragdrop3 (beide = 1, één = 0.5)
  let h3 = 0;
  if (localStorage.getItem('reflection_3')) h3++;
  const dragdrop3 = parseInt(localStorage.getItem('dragdrop3_correct') || 0);
  if (dragdrop3 > 0) h3++;
  if (h3 === 2) chapterProgress[2] = 1;
  else if (h3 === 1) chapterProgress[2] = 0.5;
  // ... bestaande code voor hoofdstuk 4 t/m 8 ...
  let h4 = 0;
  if (localStorage.getItem('reflection_4')) h4++;
  if (localStorage.getItem('mc1_correct')) h4++;
  if (localStorage.getItem('critical_analysis')) h4++;
  if (h4 === 3) chapterProgress[3] = 1;
  else if (h4 > 0) chapterProgress[3] = 0.5;
  if (localStorage.getItem('reflection_5')) chapterProgress[4] = 1;
  let h6 = 0;
  if (localStorage.getItem('reflection_6')) h6++;
  if (localStorage.getItem('self_assessment')) h6++;
  if (h6 === 2) chapterProgress[5] = 1;
  else if (h6 === 1) chapterProgress[5] = 0.5;
  let h7 = 0;
  if (localStorage.getItem('reflection_7')) h7++;
  if (localStorage.getItem('mc2_correct')) h7++;
  if (h7 === 2) chapterProgress[6] = 1;
  else if (h7 === 1) chapterProgress[6] = 0.5;
  const section8 = document.getElementById('section8');
  if (section8) {
    const answered = section8.querySelectorAll('.mc-option.selected').length;
    if (answered === 3) chapterProgress[7] = 1;
    else if (answered > 0) chapterProgress[7] = 0.5;
  }
  localStorage.setItem('chapterProgress', JSON.stringify(chapterProgress));
  updateSidebarProgress();
}

// Roep updateAllChapterProgress aan na elke relevante actie:
// Reflectie
const origSaveReflection = saveReflection;
saveReflection = function(sectionNumber) {
  origSaveReflection(sectionNumber);
  updateAllChapterProgress();
};
// MC
const origSaveMCScore = saveMCScore;
saveMCScore = function(questionNumber, correct, total) {
  origSaveMCScore(questionNumber, correct, total);
  updateAllChapterProgress();
};

function updateSidebarProgress() {
  // Simuleer voortgang per hoofdstuk (vervang door echte logica)
  // 0 = niet begonnen, 0.5 = deels, 1 = compleet
  let chapterProgress = JSON.parse(localStorage.getItem('chapterProgress')) || Array(chapters.length).fill(0);
  let completed = chapterProgress.filter(p => p === 1).length;
  let half = chapterProgress.filter(p => p === 0.5).length;
  let total = chapters.length;
  let percent = Math.round((completed + 0.5 * half) / total * 100);

  // Update cirkels
  chapters.forEach((ch, idx) => {
    const circle = document.getElementById(`circle-${ch.section}`);
    circle.classList.remove('completed', 'half');
    if (chapterProgress[idx] === 1) {
      circle.classList.add('completed');
    } else if (chapterProgress[idx] === 0.5) {
      circle.classList.add('half');
    }
  });

  // Update visuele voortgang
  const visual = document.getElementById('sidebarProgressVisual');
  if (visual) {
    visual.style.background = `conic-gradient(var(--primary-purple) 0% ${percent}%, var(--medium-gray) ${percent}% 100%)`;
  }
  const text = document.getElementById('sidebarProgressText');
  if (text) text.textContent = percent + '%';
}

function setChapterProgress(section, value) {
  let chapterProgress = JSON.parse(localStorage.getItem('chapterProgress')) || Array(chapters.length).fill(0);
  chapterProgress[section - 1] = value;
  localStorage.setItem('chapterProgress', JSON.stringify(chapterProgress));
  updateSidebarProgress();
}

function setupSidebarNavigation() {
  const sidebarChapters = document.querySelectorAll('.sidebar-chapter');
  sidebarChapters.forEach(chapter => {
    chapter.addEventListener('click', function() {
      const section = parseInt(this.getAttribute('data-section'));
      showSection(section);
    });
  });
}

function setupSidebarHamburger() {
  console.log('Setting up sidebar hamburger...'); // Debug log
  const sidebarHamburger = document.getElementById('sidebarHamburger');
  const floatingHamburger = document.getElementById('floatingHamburger'); // Get the floating button
  const sidebar = document.getElementById('sidebarNav');

  if (!sidebar) {
    console.error('Sidebar element #sidebarNav not found!');
    return;
  }

  function toggleSidebar(event) {
    console.log('Toggle sidebar triggered by:', event.currentTarget.id); // Debug log
    sidebar.classList.toggle('open');
    document.body.classList.toggle('sidebar-open');
  }

  if (sidebarHamburger) {
      console.log('Found sidebarHamburger, adding listener.'); // Debug log
      sidebarHamburger.addEventListener('click', toggleSidebar);
  } else {
      console.warn('Sidebar hamburger element #sidebarHamburger not found.'); // Debug log
  }

  if (floatingHamburger) {
      console.log('Found floatingHamburger, adding listener.'); // Debug log
      floatingHamburger.addEventListener('click', toggleSidebar); // Add listener to floating button
  } else {
      console.warn('Floating hamburger element #floatingHamburger not found.'); // Debug log
  }

  // Sluit sidebar bij klik buiten (mobiel)
  document.addEventListener('click', function(e) {
    // Check if sidebar exists and is open, and if the click was outside
    if (sidebar && sidebar.classList.contains('open') && window.innerWidth <= 900) {
        // Check if the click target is NOT the sidebar or inside it,
        // AND NOT one of the hamburger buttons or inside them.
        const isClickInsideSidebar = sidebar.contains(e.target);
        const isClickOnSidebarHamburger = sidebarHamburger && sidebarHamburger.contains(e.target);
        const isClickOnFloatingHamburger = floatingHamburger && floatingHamburger.contains(e.target);

        if (!isClickInsideSidebar && !isClickOnSidebarHamburger && !isClickOnFloatingHamburger) {
            console.log('Click outside detected, closing sidebar.'); // Debug log
            sidebar.classList.remove('open');
            document.body.classList.remove('sidebar-open');
       }
    }
  });
}

// --- SINGLE DOMContentLoaded Listener ---
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - Initializing all components');

  // Initialize basic navigation first
  setupSidebarNavigation(); // Sets up clicks on chapter titles
  setupSidebarHamburger();  // Sets up clicks on BOTH hamburger buttons

  // Initialize interactive elements
  initializeMultipleChoice();
  initializeDragAndDrop();

  // Set initial state
  updateSidebarProgress(); // Calculate initial progress display
  showSection(1);          // Show the first section
  updateAllChapterProgress(); // Ensure progress reflects any loaded data

  console.log('All initializations complete.');
});

// Voorbeeld: markeer hoofdstuk als half of compleet (vervang door echte logica)
// setChapterProgress(1, 1); // Hoofdstuk 1 compleet
// setChapterProgress(2, 0.5); // Hoofdstuk 2 half
// setChapterProgress(3, 0); // Hoofdstuk 3 niet begonnen

