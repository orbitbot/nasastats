import m from 'mithril'
import DatePicker from 'mithril-datepicker'

import { 
  activeDataset,
  availableDatasets,
  loadDataset,
  setActiveDataset
} from './domain/'

import { processNeoDataset } from './domain/process.js'
import { getMean, getMedian } from './domain/util.js'

import { Home } from './ui/home.js'
import { Explore } from './ui/explore.js'

activeDataset.map(m.redraw)
availableDatasets.map(m.redraw)

DatePicker.localize({ weekStart: 1 }) // set week start to Monday

m.route(document.body, '/', {
  '/'        : { view : () => m(Home, { availableDatasets, loadDataset, setActiveDataset }) },
  '/explore' : { view : () => m(Explore, { dataset : activeDataset(), getMedian, getMean, processDataset : processNeoDataset }) } 
})
