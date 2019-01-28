export const getMedian = (array) => array.sort()[(Math.floor(array.length / 2) - 1)]

export const getMean = (array) => array.reduce((a, b) => a + b) / array.length
