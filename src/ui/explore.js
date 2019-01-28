import m from 'mithril'
import JsonViewer from 'mithril-json-viewer'

export const Explore = ({ attrs : { dataset, processDataset, getMedian, getMean }}) => {

  let loading = true
  let closest, median, mean, error

  if (!dataset) {
    m.route.set('/')
  }

  setTimeout(() => {
    try {
      let [closestObject, allAbsoluteMagnitudes, dangerousAbsoluteMagnitudes] = processDataset(dataset.data)
      closest = closestObject
      median = getMedian(allAbsoluteMagnitudes)
      mean = getMean(dangerousAbsoluteMagnitudes)
    } catch (e) {
      console.error(e)
      error = e
    }
    loading = false
    m.redraw()
  }, 0)
  
  return {
    view : () => 
      m('.c',
        m('a[href=/]', { oncreate: m.route.link }, '< Back'),
        m('.card', 
            loading 
              ? m('h4', '... processing')
              : error 
                ? m('.row', 
                    m('h4', 'An error has ocurred processing the dataset:'),
                    m('pre', error.stack)
                  )
                : [
                    m('.row', 
                      m('h3', `Dataset ${ dataset.start } - ${ dataset.end }`),
                    ),
                    m('.row', 
                      m('h4', 'Dataset calculations for Absolute Magnitude:'),
                      m('',  m('b', 'median of all asteroids'), ` ${ median }`),
                      m('',  m('b', 'mean of potentially hazardous asteroids'), ` ${ mean }`)
                    ),
                    m('.row',
                      m('h4', 'Asteroid passing earth closest in dataset: ', m('a', { href : closest.nasa_jpl_url }, closest.name)),
                      m('', `Passby distance ${ closest.min_close_approach_km } km`),
                      m('.card',
                        m('h4', 'Full data on closest passing asteroid in dataset:'),
                        m('.json-tree', { style : 'font-family: Courier; font-size: 0.8em;' },
                          m(JsonViewer, { tree: closest, options: { collapseAfter: 1 } })
                        )
                      )
                    ),
                    m('.row',
                      m('h4', 'Full dataset:'),
                      m('.card', 
                        m('.json-tree', { style : 'font-family: Courier; font-size: 0.8em;' }, 
                          m(JsonViewer, { tree: dataset, options: { collapseAfter: 1 } })
                        )
                      )
                    )
                ]
          )
        )
  }
}
