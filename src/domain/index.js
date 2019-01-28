import m from 'mithril'
import stream from 'mithril-stream'
import {
  addDays, subDays, differenceInDays, format
} from 'date-fns'

const availableDatasets = stream([])
const activeDataset = stream()

const localStorageKey = 'nasastats::datasets'

availableDatasets((localStorage[localStorageKey] && JSON.parse(localStorage[localStorageKey])) || [])
availableDatasets.map((allDatasets) => {
  if (allDatasets.length) {
    localStorage[localStorageKey] = JSON.stringify(allDatasets)
  }
})

const loadDataset = (start, end, apiKey) => {
  const requests     = []
  const requestDates = []
  const weeksBetween = Math.floor(differenceInDays(end, start) / 7)
  const remainder    = differenceInDays(end, start) % 7

  Array.from({ length : weeksBetween } , (x, i) => i)
    .map((week) => requestDates.push([addDays(start, week * 7)]))

  requestDates.push([subDays(end, remainder), end])

  requestDates.map((dates) =>
    requests.push(
      m.request('https://api.nasa.gov/neo/rest/v1/feed', {
        data : {
          start_date : format(dates[0], 'YYYY-MM-DD'),
          end_date   : dates[1] && format(dates[1], 'YYYY-MM-DD'),
          api_key    : apiKey || 'DEMO_KEY'
        }
      })
    )
  )

  return Promise.all(requests)
    .then((results) => {
      const merged = Object.assign.apply({}, results.map((result) => result.near_earth_objects))
      availableDatasets(availableDatasets().concat({
        start : format(start, 'YYYY-MM-DD'),
        end   : format(end, 'YYYY-MM-DD'), 
        data  : { near_earth_objects : merged }
      }))
    })
}

const setActiveDataset = (dataset) => activeDataset(dataset)

export { activeDataset, availableDatasets, loadDataset, setActiveDataset }
