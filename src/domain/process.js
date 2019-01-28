export const processNeoDataset = (dataset) => {
  let onlyDatasetNeos = [].concat.apply([], Object.values(dataset.near_earth_objects))

  return onlyDatasetNeos.reduce((acc, neo) => {
    neo.min_close_approach_km = neo.close_approach_data.reduce((comp, approach) => {
      return Math.min(comp, Number(approach.miss_distance.kilometers))
    }, Number.POSITIVE_INFINITY)

    if (neo.min_close_approach_km < (acc[0].min_close_approach_km || Number.POSITIVE_INFINITY)) {
      acc[0] = neo
    }
    
    acc[1].push(neo.absolute_magnitude_h)
    
    if (neo.is_potentially_hazardous_asteroid) {
      acc[2].push(neo.absolute_magnitude_h)
    }

    return acc
  }, [{}, [], []])
}
