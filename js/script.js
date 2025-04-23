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
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(`section${sectionNumber}`);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
    }
    
    // Update current section and progress
    currentSection = sectionNumber;
    updateProgress();
    
    // Force scroll to top after a small delay to ensure DOM updates are complete
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }, 50);
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

// Initialize navigation and progress
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    // Add click handlers to chapter points
    document.querySelectorAll('.chapter-point').forEach(point => {
        point.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionNumber = parseInt(this.getAttribute('data-section'));
            showSection(sectionNumber);
        });
    });
    
    // Show first section and initialize progress
    showSection(1);
    
    // Initialize Multiple Choice questions
    initializeMultipleChoice();
    
    // Initialize Drag & Drop
    initializeDragAndDrop();

    console.log('Multiple Choice questions initialized'); // Debug log
});

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

// Make sure initializeMultipleChoice is called when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    initializeMultipleChoice();
});

// Drag & Drop functionality
function initializeDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable');
    const dropTargets = document.querySelectorAll('.drop-target');
    
    draggables.forEach(draggable => {
        draggable.setAttribute('draggable', true);
        
        draggable.addEventListener('dragstart', function(e) {
            this.classList.add('dragging');
            e.dataTransfer.setData('text/plain', this.getAttribute('data-id'));
        });
        
        draggable.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    dropTargets.forEach(target => {
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
            const draggable = document.querySelector(`.draggable[data-id="${draggedId}"]`);
            
            // Remove from previous parent if exists
            if (draggable.parentElement) {
                draggable.parentElement.removeChild(draggable);
            }
            
            // Add to new target
            this.appendChild(draggable);
            
            // Check if all items are placed
            checkDragDropResults();
        });
    });
}

function checkDragDropResults() {
    const dropTargets = document.querySelectorAll('.drop-target');
    let correctCount = 0;
    let totalPlaced = 0;
    
    dropTargets.forEach(target => {
        const targetId = target.getAttribute('data-id');
        const draggable = target.querySelector('.draggable');
        
        if (draggable) {
            totalPlaced++;
            const draggableId = draggable.getAttribute('data-id');
            
            // Check if the combination is correct
            if (isCorrectCombination(targetId, draggableId)) {
                correctCount++;
                draggable.classList.add('correct');
                draggable.classList.remove('incorrect');
            } else {
                draggable.classList.add('incorrect');
                draggable.classList.remove('correct');
            }
        }
    });
    
    // Show feedback if all items are placed
    if (totalPlaced === dropTargets.length) {
        const feedback = document.getElementById('dragdrop-feedback');
        if (feedback) {
            if (correctCount === totalPlaced) {
                feedback.innerHTML = "Goed gedaan! Je hebt alle items correct geplaatst.";
                feedback.classList.remove('incorrect');
                feedback.classList.add('correct');
            } else {
                feedback.innerHTML = "Niet alle items zijn correct geplaatst. Probeer het opnieuw.";
                feedback.classList.remove('correct');
                feedback.classList.add('incorrect');
            }
            
            // Save score
            saveDragDropScore(correctCount, totalPlaced);
        }
    }
}

function isCorrectCombination(targetId, draggableId) {
    // Define correct combinations based on your specific exercise
    const correctCombinations = {
        '1': '2', // Example: target 1 should have draggable 2
        '2': '3', // Example: target 2 should have draggable 3
        '3': '1'  // Example: target 3 should have draggable 1
    };
    
    return correctCombinations[targetId] === draggableId;
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

function saveDragDropScore(correct, total) {
    localStorage.setItem('dragdrop_correct', correct);
    localStorage.setItem('dragdrop_total', total);
}

// Save critical analysis
function saveAnalysis() {
    const techChoice = document.getElementById('tech-choice').value;
    const strengths = document.getElementById('strengths').value;
    const challenges = document.getElementById('challenges').value;
    const implementation = document.getElementById('implementation').value;

    if (!techChoice || !strengths || !challenges || !implementation) {
        alert('Vul alstublieft alle velden in voordat je de analyse opslaat.');
        return;
    }

    const analysis = {
        techChoice,
        strengths,
        challenges,
        implementation,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('critical_analysis', JSON.stringify(analysis));
    alert('Je kritische analyse is opgeslagen!');
}

// Save self-assessment
function saveSelfAssessment() {
    const veranderen = document.getElementById('veranderen').value;
    const vinden = document.getElementById('vinden').value;
    const vertrouwen = document.getElementById('vertrouwen').value;
    const vaardig = document.getElementById('vaardig').value;
    const vertellen = document.getElementById('vertellen').value;

    if (!veranderen || !vinden || !vertrouwen || !vaardig || !vertellen) {
        alert('Vul alstublieft alle competenties in voordat je de zelfbeoordeling opslaat.');
        return;
    }

    const assessment = {
        veranderen,
        vinden,
        vertrouwen,
        vaardig,
        vertellen,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('self_assessment', JSON.stringify(assessment));
    alert('Je zelfbeoordeling is opgeslagen!');
}

// Update checkUnansweredQuestions to include critical analysis and self-assessment
function checkUnansweredQuestions() {
    const unansweredSections = [];
    
    // Check reflection questions
    for (let i = 1; i <= 7; i++) {
        const answer = localStorage.getItem(`reflection_${i}`);
        if (!answer || answer.trim() === '') {
            unansweredSections.push(i);
        }
    }
    
    // Check critical analysis
    const criticalAnalysis = localStorage.getItem('critical_analysis');
    if (!criticalAnalysis) {
        unansweredSections.push(4);
    }
    
    // Check self-assessment
    const selfAssessment = localStorage.getItem('self_assessment');
    if (!selfAssessment) {
        unansweredSections.push(6);
    }
    
    // Check MC questions in section 4
    const mc1Correct = localStorage.getItem('mc1_correct');
    if (mc1Correct === null) unansweredSections.push(4);
    
    // Check MC questions in section 7
    const mc2Correct = localStorage.getItem('mc2_correct');
    if (mc2Correct === null) unansweredSections.push(7);
    
    // Check Drag & Drop
    const dragDropCorrect = localStorage.getItem('dragdrop_correct');
    if (dragDropCorrect === null) unansweredSections.push(3);
    
    // Check final assessment questions
    const finalAssessmentAnswers = document.querySelectorAll('#section8 .mc-option.selected');
    if (finalAssessmentAnswers.length < 3) {
        unansweredSections.push(8);
    }
    
    // Remove duplicates and sort
    return [...new Set(unansweredSections)].sort((a, b) => a - b);
}

function generatePDF() {
    const studentName = document.getElementById('student-name').value;
    if (!studentName) {
        alert('Vul alstublieft je naam in voordat je het certificaat genereert.');
        return;
    }
    
    const unansweredSections = checkUnansweredQuestions();
    if (unansweredSections.length > 0) {
        const sectionNames = {
            1: "Introductie",
            2: "Soorten Zorgtechnologie",
            3: "De Kracht van Technologie",
            4: "Kritisch Kijken",
            5: "Adoptie & Gedrag",
            6: "Jij aan Zet",
            7: "Vinden van Zorgtechnologie",
            8: "Afsluiting"
        };
        
        const unansweredList = unansweredSections.map(section => 
            `- Hoofdstuk ${section}: ${sectionNames[section]}`
        ).join('\n');
        
        const proceed = confirm(
            `Je hebt nog niet alle vragen beantwoord in de volgende hoofdstukken:\n\n${unansweredList}\n\nWil je toch doorgaan met het genereren van het certificaat?`
        );
        
        if (!proceed) {
            return;
        }
    }
    
    try {
        // Load the logo image first
        const img = new Image();
        img.src = 'images/logo-health-transparant1.png';
        
        img.onload = function() {
            const currentDate = new Date().toLocaleDateString('nl-NL');
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            // Convert the loaded image to a data URL
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const logoDataUrl = canvas.toDataURL('image/png');
            
            // Certificaat pagina
            doc.addImage(logoDataUrl, 'PNG', 20, 20, 40, 10);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(22);
            doc.setTextColor(123, 32, 130); // Paars #7b2082
            doc.text('Certificaat van Afronding', 105, 60, { align: 'center' });
            doc.setFontSize(18);
            doc.text('Basis E-learning Zorgtechnologie in de Fysiotherapie', 105, 70, { align: 'center' });
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text('Dit certificaat is uitgereikt aan:', 105, 90, { align: 'center' });
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(20);
            doc.setTextColor(0, 161, 154); // Turquoise #00a19a
            doc.text(studentName, 105, 105, { align: 'center' });
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Datum van afronding:', 105, 125, { align: 'center' });
            doc.text(currentDate, 105, 135, { align: 'center' });
            
            // Voeg leerdoelen toe aan het voorblad
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(123, 32, 130); // Paars #7b2082
            doc.text('Leerdoelen van deze e-learning:', 20, 160);
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            
            const learningObjectives = [
                "1. De relevantie en urgentie van zorgtechnologie voor de fysiotherapie uitleggen, gekoppeld aan maatschappelijke uitdagingen.",
                "2. Concrete voorbeelden van zorgtechnologie herkennen en hun potentiële toepassing benoemen.",
                "3. De belangrijkste voordelen van zorgtechnologie in de fysiotherapie benoemen.",
                "4. Kritisch nadenken over de selectie en implementatie van zorgtechnologie.",
                "5. Het Technology Acceptance Model (TAM) uitleggen en de link leggen met gedragsverandering.",
                "6. Het V-model voor digitale competenties in de zorg uitleggen en de relevantie erkennen.",
                "7. Betrouwbare bronnen voor zorgtechnologie informatie vinden.",
                "8. Reflecteren op je eigen houding en vaardigheden t.o.v. zorgtechnologie."
            ];
            
            let yPosition = 170;
            learningObjectives.forEach(objective => {
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }
                const splitObjective = doc.splitTextToSize(objective, 170);
                doc.text(splitObjective, 20, yPosition);
                yPosition += splitObjective.length * 5 + 5;
            });
            
            // Reflecties pagina's
            doc.addPage();
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.setTextColor(123, 32, 130); // Paars #7b2082
            doc.text('Mijn Reflecties en Resultaten', 105, 20, { align: 'center' });
            
            yPosition = 40;
            
            // Voor elke sectie met reflectievraag
            for (let i = 1; i <= 7; i++) {
                const reflectionQuestion = getReflectionQuestion(i);
                const reflectionAnswer = getReflectionAnswer(i);
                
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(14);
                doc.setTextColor(0, 161, 154); // Turquoise #00a19a
                doc.text(`Sectie ${i}:`, 20, yPosition);
                yPosition += 10;
                
                doc.setFont('helvetica', 'italic');
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                
                const splitQuestion = doc.splitTextToSize(reflectionQuestion, 170);
                doc.text(splitQuestion, 20, yPosition);
                yPosition += splitQuestion.length * 7;
                
                doc.setFont('helvetica', 'normal');
                
                const splitAnswer = doc.splitTextToSize(reflectionAnswer, 170);
                doc.text(splitAnswer, 20, yPosition);
                yPosition += splitAnswer.length * 7 + 15;
            }
            
            // Voeg resultaten van interactieve elementen toe
            if (yPosition > 220) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(123, 32, 130); // Paars #7b2082
            doc.text('Resultaten van interactieve oefeningen:', 20, yPosition);
            yPosition += 10;
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            
            const mcScore = getMCScore();
            doc.text(`Multiple Choice vragen: ${mcScore.correct} van ${mcScore.total} correct`, 20, yPosition);
            yPosition += 10;
            
            const dragDropScore = getDragDropScore();
            doc.text(`Drag & Drop oefening: ${dragDropScore.correct} van ${dragDropScore.total} correct geplaatst`, 20, yPosition);
            yPosition += 10;
            
            // Add final assessment results
            const finalAssessmentAnswers = document.querySelectorAll('#section8 .mc-option.selected');
            const correctAnswers = Array.from(finalAssessmentAnswers).filter(option => {
                const questionId = option.closest('.mc-question').querySelector('.feedback').id.split('-')[0];
                const question = questions.find(q => q.id === questionId);
                return parseInt(option.getAttribute('data-id')) === question.correctAnswer;
            }).length;
            
            doc.text(`Eindtoets: ${correctAnswers} van 3 vragen correct`, 20, yPosition);
            
            // Add critical analysis to PDF
            const criticalAnalysis = JSON.parse(localStorage.getItem('critical_analysis') || '{}');
            if (criticalAnalysis.techChoice) {
                if (yPosition > 220) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(14);
                doc.setTextColor(123, 32, 130);
                doc.text('Kritische Analyse:', 20, yPosition);
                yPosition += 10;
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                
                doc.text(`Gekozen technologie: ${criticalAnalysis.techChoice}`, 20, yPosition);
                yPosition += 10;
                
                const strengths = doc.splitTextToSize(`Sterke punten: ${criticalAnalysis.strengths}`, 170);
                doc.text(strengths, 20, yPosition);
                yPosition += strengths.length * 7;
                
                const challenges = doc.splitTextToSize(`Uitdagingen: ${criticalAnalysis.challenges}`, 170);
                doc.text(challenges, 20, yPosition);
                yPosition += challenges.length * 7;
                
                const implementation = doc.splitTextToSize(`Implementatieplan: ${criticalAnalysis.implementation}`, 170);
                doc.text(implementation, 20, yPosition);
                yPosition += implementation.length * 7 + 15;
            }
            
            // Add self-assessment to PDF
            const selfAssessment = JSON.parse(localStorage.getItem('self_assessment') || '{}');
            if (selfAssessment.veranderen) {
                if (yPosition > 220) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(14);
                doc.setTextColor(123, 32, 130);
                doc.text('Zelfbeoordeling V-competenties:', 20, yPosition);
                yPosition += 10;
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                
                doc.text(`Veranderen: Niveau ${selfAssessment.veranderen}`, 20, yPosition);
                yPosition += 10;
                doc.text(`Vinden: Niveau ${selfAssessment.vinden}`, 20, yPosition);
                yPosition += 10;
                doc.text(`Vertrouwen: Niveau ${selfAssessment.vertrouwen}`, 20, yPosition);
                yPosition += 10;
                doc.text(`Vaardig gebruiken: Niveau ${selfAssessment.vaardig}`, 20, yPosition);
                yPosition += 10;
                doc.text(`Vertellen: Niveau ${selfAssessment.vertellen}`, 20, yPosition);
                yPosition += 15;
            }
            
            // Download de PDF
            doc.save(`Certificaat_Zorgtechnologie_${studentName.replace(/\s+/g, '_')}.pdf`);
        };
        
        img.onerror = function() {
            console.error('Error loading logo image');
            alert('Er is een probleem met het laden van het logo. Het certificaat wordt gegenereerd zonder logo.');
            generatePDFWithoutLogo(studentName);
        };
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Er is een fout opgetreden bij het genereren van het PDF-bestand. Probeer het later opnieuw.');
    }
}

// Backup function to generate PDF without logo
function generatePDFWithoutLogo(studentName) {
    try {
        const currentDate = new Date().toLocaleDateString('nl-NL');
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Skip logo and start with title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(123, 32, 130); // Paars #7b2082
        doc.text('Certificaat van Afronding', 105, 60, { align: 'center' });
        
        // ... rest of the PDF generation code ...
        
        // Download de PDF
        doc.save(`Certificaat_Zorgtechnologie_${studentName.replace(/\s+/g, '_')}.pdf`);
        
    } catch (error) {
        console.error('Error generating PDF without logo:', error);
        alert('Er is een fout opgetreden bij het genereren van het PDF-bestand. Probeer het later opnieuw.');
    }
}

// Helper functies
function getReflectionQuestion(sectionNumber) {
    const questions = {
        1: "Welke van de genoemde uitdagingen in de zorg verwacht jij het meest tegen te komen in je toekomstige werkveld, en waarom?",
        2: "Welk van deze vijf voorbeelden lijkt jou het meest vernieuwend of interessant voor de fysiotherapie? Licht kort toe waarom.",
        3: "Stel je voor dat je één van deze voordelen direct zou kunnen toepassen in een stage-casus. Welk voordeel kies je en waarom?",
        4: "Privacy en veiligheid zijn belangrijke thema's. Welke vraag over privacy zou jij stellen voordat je een nieuwe zorg-app aan een patiënt aanbeveelt?",
        5: "Denkend aan het TAM-model: wat denk jij dat voor fysiotherapeuten zwaarder weegt bij het adopteren van nieuwe technologie: het verwachte nut (Usefulness) of het gebruiksgemak (Ease of Use)? Waarom denk je dat?",
        6: "Het V-model benadrukt verschillende competentiegebieden. Op welk gebied zou jij jezelf de komende twee jaar het meest willen ontwikkelen met betrekking tot technologie?",
        7: "Bekijk de lijst met bronnen. Welke bron ga je na deze e-learning als eerste bekijken en wat hoop je daar te vinden?"
    };
    return questions[sectionNumber] || "";
}

function getReflectionAnswer(sectionNumber) {
    // Haal het antwoord op uit de opgeslagen gebruikersgegevens
    return localStorage.getItem(`reflection_${sectionNumber}`) || "Geen antwoord gegeven";
}

function getMCScore() {
    // Haal de score op uit de opgeslagen gebruikersgegevens
    return {
        correct: parseInt(localStorage.getItem('mc_correct') || 0),
        total: 2
    };
}

function getDragDropScore() {
    // Haal de score op uit de opgeslagen gebruikersgegevens
    return {
        correct: parseInt(localStorage.getItem('dragdrop_correct') || 0),
        total: 3
    };
}
