import m from 'mithril'
import stream from 'mithril-stream'
import { addDays } from 'date-fns'
import DatePicker from 'mithril-datepicker'

const apiKeyStorage = 'nasastats::apiKey'
const startDateKey = 'nasastats::startDate'
const endDateKey = 'nasastats::endDate'

export const Home = ({ attrs : { availableDatasets, loadDataset, setActiveDataset } }) => {

  let startDate, endDate, apiKey, error

  apiKey    = localStorage[apiKeyStorage] || ''
  startDate = localStorage[startDateKey] ? new Date(localStorage[startDateKey]) : new Date()
  endDate   = localStorage[endDateKey]   ? new Date(localStorage[endDateKey])   : new Date()

  return {
    onremove : () => {
      localStorage[apiKeyStorage] = apiKey
      localStorage[endDateKey]    = endDate.toJSON()
      localStorage[startDateKey]  = startDate.toJSON()
    },

    view : () => 
      m('.c', 
        m('.row', 
          m('h2', 'Nasastats - NEO API')
        ),
        m('.card',
          m('p', 'Enter your API key here to increase the available requests'),
          m('b', { style : 'margin-right: 1em'}, 'API key'),
          m('input.w-100', {
            value : apiKey,
            oninput : (e) => {
              apiKey = e.target.value
              localStorage[apiKeyStorage] = apiKey
            }
          }),
        ),
        m('.card',
          m('p', 'Select an interval to load data for'),
          m('.row',
            m('.6.col',
              m('', 'Start'),
              m(DatePicker, {
                date     : startDate,
                onchange : (chosen) => startDate = chosen
              }),
            ),
            m('.6.col',
              m('', 'End'),
              m(DatePicker, {
                date     : endDate,
                onchange : (chosen) => endDate = chosen
              }),
            )
          ),
          m('br'),
          m('button.btn', {
            onclick : () => {
              error = null
              const endDateParam = startDate < endDate ? endDate : addDays(new Date(startDate.valueOf), 7) // use 7 days as it is API default end date
              loadDataset(startDate, endDateParam, apiKey)
                .catch((err) => {
                  error = err
                  m.redraw()
                })
            }
          }, 'Load dataset'),
          error && [
            m('', 'An error has ocurred loading the requested dataset:'),
            m('pre', error.stack ? error.stack : error)
          ],
        ),
        m('.card',
          availableDatasets() && availableDatasets().length 
            ? [
                m('h4', 'Datasets:'),
                m('p', 'Click a dataset to explore the information'),
                availableDatasets().map((dataset) => 
                  m('', 
                    m('a[href=/explore]', { 
                      onclick : () => {
                        setActiveDataset(dataset)
                        m.route.set('/explore')
                        return false
                      }
                    }, `Dataset ${ dataset.start } - ${ dataset.end }`)
                  )
                ) 
              ]
            : m('p', 'No datasets available, request some data from NASA API')
        ),
      )
  }
}
