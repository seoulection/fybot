const getRandomMelody = () => {
  const defaultMelody = { bell: 'bell.mp3', count: 0, melody: 'creep1.wav' }

  switch (Math.floor(Math.random() * 10)) {
    case 0:
      return { bell: 'eee.mp3', count: 1, melody: 'rusheintro.mp3' }
    case 1:
    case 2:
      return { ...defaultMelody, bell: 'explosion.mp3', melody: 'ac130.mp3' }
    case 3:
      return { ...defaultMelody, melody: 'spetz.mp3' }
    case 4:
    case 5:
      return {
        ...defaultMelody,
        bell: ['bing.wav', 'bong.wav'],
        melody: 'bingbong.wav',
      }
    case 6:
    case 7:
      return { ...defaultMelody, bell: 'haha.mp3', melody: 'clappingass.mp3' }
    case 8:
      return { ...defaultMelody, bell: 'lobell.mp3', melody: 'lomelody.mp3' }
    case 9:
      return { ...defaultMelody, melody: 'creep1.wav' }
  }
}

module.exports = {
  getRandomMelody,
}
