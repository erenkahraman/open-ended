// src/helpers/demo-questions.js
export const sampleQuestions = [
  {
    id: 1,
    question: "What is the process by which plants convert carbon dioxide and water into glucose and oxygen using sunlight?",
    correctAnswer: "Photosynthesis is the process by which plants use sunlight to convert carbon dioxide and water into glucose and oxygen.",
    sampleAnswers: [
      {
        text: "Plants use sunlight to turn CO2 and water into glucose and oxygen through photosynthesis.",
        expectedScore: 9.5,
        comment: "Excellent answer with all key concepts"
      },
      {
        text: "Plants use sunlight to turn CO2 and water into glucose and oxygen.",
        expectedScore: 8.0,
        comment: "Good answer but missing the term 'photosynthesis'"
      },
      {
        text: "Plants make food using sunlight and water.",
        expectedScore: 5.0,
        comment: "Partial answer, missing key components"
      },
      {
        text: "They use the sun to make energy.",
        expectedScore: 3.0,
        comment: "Very incomplete answer"
      },
      {
        text: "Plants grow in sunlight.",
        expectedScore: 1.5,
        comment: "Minimal relevant information"
      }
    ]
  },
  {
    id: 2,
    question: "Explain how the water cycle works in nature.",
    correctAnswer: "The water cycle is a continuous process where water evaporates from oceans and land, forms clouds through condensation, and returns to Earth as precipitation in the form of rain or snow.",
    sampleAnswers: [
      {
        text: "Water evaporates from oceans and land, forms clouds through condensation, and falls back as rain or snow in a continuous cycle.",
        expectedScore: 9.5,
        comment: "Complete explanation with all key processes"
      },
      {
        text: "Water evaporates, forms clouds, and falls as rain in a continuous cycle.",
        expectedScore: 8.0,
        comment: "Good but missing some details"
      },
      {
        text: "Water goes up into clouds and comes down as rain.",
        expectedScore: 6.0,
        comment: "Basic understanding but oversimplified"
      },
      {
        text: "Rain falls from clouds and goes back up.",
        expectedScore: 4.0,
        comment: "Very simplified, missing key terms"
      },
      {
        text: "It rains sometimes.",
        expectedScore: 1.0,
        comment: "Insufficient answer"
      }
    ]
  },
  {
    id: 3,
    question: "What is the theory of evolution by natural selection?",
    correctAnswer: "Evolution by natural selection is the process where organisms with favorable traits are more likely to survive and reproduce, passing these traits to their offspring, leading to gradual changes in populations over time.",
    sampleAnswers: [
      {
        text: "Natural selection occurs when organisms with beneficial traits survive and reproduce more successfully, passing these traits to offspring, causing species to evolve over time.",
        expectedScore: 9.5,
        comment: "Excellent comprehensive answer"
      },
      {
        text: "Organisms with good traits survive better and pass these traits to their offspring, causing evolution.",
        expectedScore: 7.5,
        comment: "Good understanding but less technical"
      },
      {
        text: "Animals adapt to their environment and evolve over time.",
        expectedScore: 5.5,
        comment: "Basic understanding but missing mechanism"
      },
      {
        text: "Species change over time to survive better.",
        expectedScore: 4.0,
        comment: "Oversimplified, missing key concepts"
      },
      {
        text: "Animals change to survive.",
        expectedScore: 2.0,
        comment: "Too vague and incomplete"
      }
    ]
  }
];