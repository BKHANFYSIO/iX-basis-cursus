// Navigation and section handling
let currentSection = 1;
const totalSections = 8;

function updateProgress() {
    const progressPercentage = ((currentSection - 1) / (totalSections - 1)) * 100;
    document.getElementById('progress-fill').style.width = `${progressPercentage}%`;
}

function showSection(sectionNumber) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    document.getElementById(`section${sectionNumber}`).classList.add('active');
    
    // Update active link in navigation
    document.querySelectorAll('.section-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.section-link[data-section="${sectionNumber}"]`).classList.add('active');
    
    // Update current section and progress
    currentSection = sectionNumber;
    updateProgress();
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

// Initialize section links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.section-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionNumber = parseInt(this.getAttribute('data-section'));
            showSection(sectionNumber);
        });
    });
    
    // Initialize Multiple Choice questions
    initializeMultipleChoice();
    
    // Initialize Drag & Drop
    initializeDragAndDrop();
    
    // Initialize progress bar
    updateProgress();
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
            feedback.innerHTML = isCorrect ? 
                "Goed gedaan! Hoewel alle genoemde aspecten belangrijk zijn, is het essentieel om eerst te bepalen of er wetenschappelijk bewijs is voor de effectiviteit van de technologie. Als de kwaliteit van zorg niet verbetert of gewaarborgd blijft, zijn andere overwegingen minder relevant." : 
                "Dat is een belangrijk aspect om te overwegen, maar niet het meest fundamentele. Voordat je investeert in tijd of geld, is het essentieel om te weten of er wetenschappelijk bewijs is dat de technologie daadwerkelijk effectief is voor de beoogde toepassing.";
            
            feedback.classList.remove('correct', 'incorrect');
            feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
            
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
            feedback.innerHTML = isCorrect ? 
                "Uitstekend! De GGD AppStore is specifiek ontworpen om gezondheidsapps te beoordelen op gebruiksvriendelijkheid, privacy, betrouwbaarheid en onderbouwing. Het is een onafhankelijke bron die apps test volgens landelijke richtlijnen." : 
                "Dit is een nuttige bron, maar de GGD AppStore is specifiek ontworpen om gezondheidsapps te beoordelen op gebruiksvriendelijkheid, privacy, betrouwbaarheid en onderbouwing volgens landelijke richtlijnen, wat het meest geschikt maakt voor dit doel.";
            
            feedback.classList.remove('correct', 'incorrect');
            feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
            
            // Save MC score
            saveMCScore(2, isCorrect ? 1 : 0, 1);
        });
    });
}

// Drag & Drop functionality
function initializeDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable');
    const dropTargets = document.querySelectorAll('.drop-target');
    
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', function() {
            this.classList.add('dragging');
        });
        
        draggable.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            checkDragDropResults();
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
            
            const dragging = document.querySelector('.dragging');
            if (dragging) {
                // Remove from previous parent if it was in a drop target
                const previousParent = dragging.parentElement;
                if (previousParent.classList.contains('drop-target')) {
                    previousParent.removeChild(dragging);
                }
                
                // Add to new drop target
                this.appendChild(dragging);
            }
        });
    });
}

function checkDragDropResults() {
    const dropTargets = document.querySelectorAll('.drop-target');
    let correctCount = 0;
    let totalPlaced = 0;
    
    dropTargets.forEach(target => {
        const targetId = target.getAttribute('data-id');
        const children = target.children;
        
        for (let i = 0; i < children.length; i++) {
            if (children[i].classList.contains('draggable')) {
                totalPlaced++;
                const draggableId = children[i].getAttribute('data-id');
                
                // Correct combinations:
                // draggable 2 -> target 1 (Bewegingsanalyse-apps)
                // draggable 3 -> target 2 (Virtual Reality)
                // draggable 1 -> target 3 (eHealth platforms)
                let isCorrect = false;
                
                if (targetId === '1' && draggableId === '2') isCorrect = true;
                if (targetId === '2' && draggableId === '3') isCorrect = true;
                if (targetId === '3' && draggableId === '1') isCorrect = true;
                
                if (isCorrect) {
                    correctCount++;
                    children[i].classList.add('correct');
                } else {
                    children[i].classList.remove('correct');
                }
            }
        }
    });
    
    // Show feedback if all items are placed
    if (totalPlaced === 3) {
        const feedback = document.getElementById('dragdrop-feedback');
        
        if (correctCount === 3) {
            feedback.innerHTML = "Goed gedaan! Je hebt de voordelen correct gekoppeld aan de meest relevante technologiecategorieën.";
            feedback.classList.remove('incorrect');
            feedback.classList.add('correct');
        } else {
            feedback.innerHTML = "Niet helemaal juist. Bekijk de eigenschappen van elke technologie nog eens en probeer opnieuw.";
            feedback.classList.remove('correct');
            feedback.classList.add('incorrect');
        }
        
        // Save Drag & Drop score
        saveDragDropScore(correctCount, 3);
    }
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

// PDF Generation
function generatePDF() {
    const studentName = document.getElementById('student-name').value;
    if (!studentName) {
        alert('Vul alstublieft je naam in voordat je het certificaat genereert.');
        return;
    }
    
    const currentDate = new Date().toLocaleDateString('nl-NL');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Certificaat pagina
    doc.addImage('/home/ubuntu/elearning/html/images/ixperium_health_logo.png', 'PNG', 20, 20, 40, 10);
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
    
    doc.setFontSize(12);
    doc.text('Deze e-learning module is ontwikkeld door iXperium Health', 105, 160, { align: 'center' });
    doc.text('en biedt een introductie in zorgtechnologie voor fysiotherapie.', 105, 170, { align: 'center' });
    
    // Reflecties pagina's
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(123, 32, 130); // Paars #7b2082
    doc.text('Mijn Reflecties en Resultaten', 105, 20, { align: 'center' });
    
    let yPosition = 40;
    
    // Voor elke sectie met reflectievraag
    for (let i = 1; i <= 7; i++) {
        const reflectionQuestion = getReflectionQuestion(i);
        const reflectionAnswer = getReflectionAnswer(i);
        
        // Voeg nieuwe pagina toe indien nodig
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
        
        // Splits lange reflectievragen in meerdere regels
        const splitQuestion = doc.splitTextToSize(reflectionQuestion, 170);
        doc.text(splitQuestion, 20, yPosition);
        yPosition += splitQuestion.length * 7;
        
        doc.setFont('helvetica', 'normal');
        
        // Splits lange antwoorden in meerdere regels
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
    
    // Download de PDF
    doc.save(`Certificaat_Zorgtechnologie_${studentName.replace(/\s+/g, '_')}.pdf`);
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
