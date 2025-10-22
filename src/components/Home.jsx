import React, { useState } from "react";
import axios from "axios";
import "./PixelQuiz.css"; // Import the new stylesheet

const Home = () => {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!topic) {
      setError("Please enter a topic");
      return;
    }
    setError("");
    setLoading(true);
    setQuiz(null);
    setCurrentQ(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setShowScore(false);

    try {
      // NOTE: Update the URL to your actual backend if deployed
      const res = await axios.post(
        "http://localhost:7653/api/quiz/generateQuiz",
        { Topic: topic, countof: numQuestions },
        { withCredentials: true }
      );
      setQuiz(res.data.quiz);
    } catch (err) {
      console.error(err);
      setError("Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerClick = (index) => {
    if (selectedOption !== null) return; // prevent multiple clicks

    setSelectedOption(index);
    // Find the correct option index in the current question
    const correctOptionIndex = quiz.question[currentQ].options.findIndex(
      (opt) => opt === quiz.question[currentQ].correctAnswer
    );
    
    // NOTE: If your backend returns `correctOptionIndex` directly, use that instead.
    // Assuming backend returns a `correctAnswer` string:
    const correct = quiz.question[currentQ].correctAnswer === quiz.question[currentQ].options[index];

    setIsCorrect(correct);
    if (correct) setScore((prev) => prev + 1);
  };

  const handleNextQuestion = () => {
    if (currentQ + 1 < quiz.question.length) {
      setCurrentQ((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setShowScore(true);
    }
  };

  const handleRestart = () => {
    setQuiz(null);
    setShowScore(false);
    setTopic("");
    setNumQuestions(5);
    setScore(0);
    setCurrentQ(0);
  };

  return (
    <div className="game-screen-container">
      <div className="game-screen">
        <div className="platform-layer"></div>
        <h1 className="title">QUIZ GENERATOR</h1>

        {/* Input Section */}
        <div className="input-section">
          <input
            type="text"
            placeholder="Enter topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="pixel-input"
          />
          <input
            type="number"
            min={1}
            max={20}
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            className="pixel-input num-input"
          />
          <button onClick={handleGenerateQuiz} className="pixel-button start-button">
            {loading ? "GENERATING..." : "START QUIZ"}
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {/* Quiz Section */}
        {quiz && quiz.question && !showScore && (
          <div className="quiz-container">
            <h2 className="subtitle">TOPIC: {quiz.Topic.toUpperCase()}</h2>
            <div className="hearts-container">
                {Array.from({ length: 4 }).map((_, i) => (
                    <span key={i} className="heart">❤️</span> // Placeholder for pixel hearts
                ))}
            </div>
            
            <p className="question-counter">
              Question {currentQ + 1} / {quiz.question.length}
            </p>

            <p className="question-text">
              {quiz.question[currentQ].questiontext}
            </p>

            <div className="options-container">
              {quiz.question[currentQ].options.map((opt, index) => {
                let optionClass = "option-button";
                if (selectedOption === index) {
                  optionClass += isCorrect ? " correct-answer" : " incorrect-answer";
                }
                
                // Add the correct class if an option is selected to reveal the right answer
                if (selectedOption !== null && quiz.question[currentQ].correctAnswer === opt) {
                    optionClass += " revealed-correct";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    className={optionClass}
                    disabled={selectedOption !== null}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Next button appears after answer */}
            {selectedOption !== null && (
              <button
                onClick={handleNextQuestion}
                className="pixel-button next-button"
              >
                {currentQ + 1 === quiz.question.length ? "FINISH" : "NEXT Q"}
              </button>
            )}
          </div>
        )}

        {/* Final score */}
        {showScore && (
          <div className="score-screen">
            <h2 className="title">QUIZ COMPLETED!</h2>
            <p className="score-text">
              YOUR SCORE: {score} / {quiz.question.length}
            </p>
            <button
              onClick={handleRestart}
              className="pixel-button restart-button"
            >
              RESTART
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;