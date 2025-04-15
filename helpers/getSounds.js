const getRandomMelody = () => {
  const defaultMelody = { bell: 'bell.mp3', count: 0, melody: 'creep1.wav' }

  switch (Math.floor(Math.random() * 10)) {
    case 1:
      return { ...defaultMelody, bell: 'explosion.mp3', melody: 'ac130.mp3' }
    case 2:
      return { ...defaultMelody, melody: 'spetz.mp3' }
    case 3:
    case 4:
      return {
        ...defaultMelody,
        bell: ['bing.wav', 'bong.wav'],
        melody: 'bingbong.wav',
      }
    case 5:
    case 6:
      return { ...defaultMelody, bell: 'haha.mp3', melody: 'clappingass.mp3' }
    case 7:
      return { ...defaultMelody, bell: 'lobell.mp3', melody: 'lomelody.mp3' }
    case 0:
    case 8:
    case 9:
      return { ...defaultMelody, melody: 'creep1.wav' }
  }
}

module.exports = {
  getRandomMelody,
}
