const WORDS = [
  'dog', 'cat', 'elephant', 'giraffe', 'penguin',
  'butterfly', 'shark', 'owl', 'snake', 'crab',
  'bicycle', 'umbrella', 'guitar', 'castle', 'rocket',
  'glasses', 'ladder', 'candle', 'scissors', 'anchor',
  'run', 'swim', 'dance', 'sleep', 'climb',
  'fish', 'sing', 'jump', 'cook', 'paint',
]

class WordController {
  getRandomWords = (req, res) => {
    let randomWords = []
    while (randomWords.length < 3) {
      const word = WORDS[Math.floor(Math.random() * WORDS.length)]
      if (!randomWords.includes(word)) {
        randomWords.push(word)
      }
    }
    res.json(randomWords)
  }
}

export default new WordController()
