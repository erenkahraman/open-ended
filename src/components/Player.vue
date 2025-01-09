props: {
  question: {
    type: Object,
    required: true,
    default: () => ({
      text: '',
      correctAnswer: ''
    }),
    validator: function(value) {
      return value && 
        typeof value.text === 'string' && 
        typeof value.correctAnswer === 'string';
    }
  }
}, 