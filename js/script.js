// Navigation and section handling
let currentSection = 1;
const totalSections = 8;

function updateProgress() {
    const progressPercentage = ((currentSection - 1) / (totalSections - 1)) * 100;
    document.getElementById('progress-fill').style.width = `${progressPercentage}%`;
    document.getElementById('progress-percentage').textContent = `${Math.round(progressPercentage)}%`;
    
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

    // Assessment functionality
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
        }
    ];

    // Add click handlers for all multiple choice options
    document.querySelectorAll('.mc-option').forEach(option => {
        option.addEventListener('click', function() {
            const questionId = this.closest('.mc-question').querySelector('.feedback').id.split('-')[0];
            const question = questions.find(q => q.id === questionId);
            const selectedId = parseInt(this.getAttribute('data-id'));
            
            // Remove selected class from all options in this question
            this.closest('.mc-question').querySelectorAll('.mc-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Show feedback
            const feedbackElement = document.getElementById(`${questionId}-feedback`);
            feedbackElement.textContent = question.feedback;
            feedbackElement.className = 'feedback ' + (selectedId === question.correctAnswer ? 'correct' : 'incorrect');
        });
    });
});

// Multiple Choice functionality
function initializeMultipleChoice() {
    // First MC question in section 4
    const mcOptions = document.querySelectorAll('#section4 .mc-option');
    mcOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            mcOptions.forEach(opt => opt.classList.remove('selected', 'correct', 'incorrect'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Check if answer is correct (option 3 is correct)
            const isCorrect = this.getAttribute('data-id') === '3';
            
            // Add correct/incorrect class
            this.classList.add(isCorrect ? 'correct' : 'incorrect');
            
            // Show feedback
            const feedback = document.getElementById('mc-feedback');
            if (feedback) {
                feedback.innerHTML = isCorrect ? 
                    "Goed gedaan! Hoewel alle genoemde aspecten belangrijk zijn, is het essentieel om eerst te bepalen of er wetenschappelijk bewijs is voor de effectiviteit van de technologie. Als de kwaliteit van zorg niet verbetert of gewaarborgd blijft, zijn andere overwegingen minder relevant." : 
                    "Dat is een belangrijk aspect om te overwegen, maar niet het meest fundamentele. Voordat je investeert in tijd of geld, is het essentieel om te weten of er wetenschappelijk bewijs is dat de technologie daadwerkelijk effectief is voor de beoogde toepassing.";
                
                feedback.classList.remove('correct', 'incorrect');
                feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
            }
            
            // Save MC score
            saveMCScore(1, isCorrect ? 1 : 0, 1);
        });
    });
    
    // Second MC question in section 7
    const mc2Options = document.querySelectorAll('#section7 .mc-option');
    mc2Options.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            mc2Options.forEach(opt => opt.classList.remove('selected', 'correct', 'incorrect'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Check if answer is correct (option 2 is correct)
            const isCorrect = this.getAttribute('data-id') === '2';
            
            // Add correct/incorrect class
            this.classList.add(isCorrect ? 'correct' : 'incorrect');
            
            // Show feedback
            const feedback = document.getElementById('mc2-feedback');
            if (feedback) {
                feedback.innerHTML = isCorrect ? 
                    "Uitstekend! De GGD AppStore is specifiek ontworpen om gezondheidsapps te beoordelen op gebruiksvriendelijkheid, privacy, betrouwbaarheid en onderbouwing. Het is een onafhankelijke bron die apps test volgens landelijke richtlijnen." : 
                    "Dit is een nuttige bron, maar de GGD AppStore is specifiek ontworpen om gezondheidsapps te beoordelen op gebruiksvriendelijkheid, privacy, betrouwbaarheid en onderbouwing volgens landelijke richtlijnen, wat het meest geschikt maakt voor dit doel.";
                
                feedback.classList.remove('correct', 'incorrect');
                feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
            }
            
            // Save MC score
            saveMCScore(2, isCorrect ? 1 : 0, 1);
        });
    });
}

// Drag & Drop functionality
function initializeDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable');
    const dropTargets = document.querySelectorAll('.drop-target');
    let draggedItem = null;

    // Make items draggable
    draggables.forEach(draggable => {
        draggable.setAttribute('draggable', 'true');
        
        draggable.addEventListener('dragstart', function(e) {
            draggedItem = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.id);
        });

        draggable.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            draggedItem = null;
        });
    });

    // Handle drop targets
    dropTargets.forEach(target => {
        target.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            this.classList.add('dragover');
        });

        target.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });

        target.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            if (draggedItem) {
                // Remove from previous parent if exists
                if (draggedItem.parentElement) {
                    draggedItem.parentElement.removeChild(draggedItem);
                }
                
                // Add to new target
                this.appendChild(draggedItem);
                
                // Check results
                checkDragDropResults();
            }
        });
    });
}

function checkDragDropResults() {
    const dropTargets = document.querySelectorAll('.drop-target');
    let correctCount = 0;
    let totalPlaced = 0;
    
    dropTargets.forEach(target => {
        const draggable = target.querySelector('.draggable');
        if (draggable) {
            totalPlaced++;
            const targetId = target.id;
            const draggableId = draggable.id;
            
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
                feedback.textContent = "Goed gedaan! Je hebt alle items correct geplaatst.";
                feedback.classList.remove('incorrect');
                feedback.classList.add('correct');
            } else {
                feedback.textContent = "Niet alle items zijn correct geplaatst. Probeer het opnieuw.";
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
        'target1': 'item1',
        'target2': 'item2',
        'target3': 'item3',
        'target4': 'item4'
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
        const currentDate = new Date().toLocaleDateString('nl-NL');
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Certificaat pagina
        doc.addImage('images/logo-health-transparant1.png', 'PNG', 20, 20, 40, 10);
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
        
    } catch (error) {
        console.error('Error generating PDF:', error);
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
