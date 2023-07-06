// Obtener referencias a los elementos HTML
const questionsContainer = document.getElementById('questions-container');
const submitButton = document.getElementById('submit-btn');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const newTriviaButton = document.getElementById('new-trivia-btn');

// Variables para almacenar los datos de la trivia
let triviaData = null;
let userAnswers = [];
let score = 0;

// Realizar solicitud a la API
function fetchTriviaData(category, difficulty, type) {
  const amount = 10; // Número de preguntas (siempre son 10 en este caso)
  const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      triviaData = data.results;
      generateTrivia();
    })
    .catch(error => console.log(error));
}

// Generar la trivia en el sitio web
function generateTrivia() {
  questionsContainer.innerHTML = '';

  triviaData.forEach((question, index) => {
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.innerHTML = `<p>${index + 1}. ${question.question}</p>`;

    const answersElement = document.createElement('div');
    answersElement.classList.add('answers');

    // Agregar respuestas incorrectas
    question.incorrect_answers.forEach(incorrectAnswer => {
      const answerLabel = document.createElement('label');
      const answerInput = document.createElement('input');
      answerInput.type = 'radio';
      answerInput.name = `question-${index}`;
      answerInput.value = incorrectAnswer;
      answerInput.addEventListener('change', updateAnswer);
      answerLabel.appendChild(answerInput);
      answerLabel.appendChild(document.createTextNode(incorrectAnswer));
      answersElement.appendChild(answerLabel);
    });

    // Agregar respuesta correcta
    const correctAnswerLabel = document.createElement('label');
    const correctAnswerInput = document.createElement('input');
    correctAnswerInput.type = 'radio';
    correctAnswerInput.name = `question-${index}`;
    correctAnswerInput.value = question.correct_answer;
    correctAnswerInput.addEventListener('change', updateAnswer);
    correctAnswerLabel.appendChild(correctAnswerInput);
    correctAnswerLabel.appendChild(document.createTextNode(question.correct_answer));
    answersElement.appendChild(correctAnswerLabel);

    questionElement.appendChild(answersElement);
    questionsContainer.appendChild(questionElement);
  });
}

// Actualizar las respuestas seleccionadas por el usuario
function updateAnswer(event) {
  const questionIndex = parseInt(event.target.name.split('-')[1]);
  const selectedAnswer = event.target.value;
  const question = triviaData[questionIndex];

  // Verificar si la respuesta seleccionada es correcta
  if (selectedAnswer === question.correct_answer) {
    userAnswers[questionIndex] = selectedAnswer;
    score += 10; // Incrementar el puntaje en 10 si la respuesta es correcta
  } else {
    userAnswers[questionIndex] = null; // Respuesta incorrecta
  }
}

// Calcular puntaje final
function calculateScore() {
  score = 0;
  triviaData.forEach((question, index) => {
    if (userAnswers[index] === question.correct_answer) {
      score += 10; // Cada pregunta correcta vale 10 puntos
    }
  });
}

// Mostrar puntaje final y ocultar la trivia
function showScore() {
  calculateScore();
  questionsContainer.style.display = 'none';
  scoreElement.textContent = score;
  scoreContainer.style.display = 'block';
}

// Reiniciar la trivia y permitir al usuario seleccionar nuevos parámetros
function resetTrivia() {
  triviaData = null;
  userAnswers = [];
  score = 0;
  questionsContainer.style.display = 'block';
  scoreContainer.style.display = 'none';
}

// Evento al hacer clic en el botón "Enviar respuestas"
submitButton.addEventListener('click', showScore);

// Evento al hacer clic en el botón "Crear nueva trivia"
newTriviaButton.addEventListener('click', resetTrivia);

// Ejemplo de uso:
const categoryValue = 11; // Categoría (ejemplo: General Knowledge)
const difficultyValue = 'easy'; // Dificultad (ejemplo: Fácil)
const typeValue = 'multiple'; // Tipo de respuesta (ejemplo: Opción múltiple)
fetchTriviaData(categoryValue, difficultyValue, typeValue);