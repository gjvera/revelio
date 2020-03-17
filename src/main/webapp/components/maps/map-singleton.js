import OpenLayersMap from 'ol/Map'
import View from 'ol/View'
import Tile from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

export default new OpenLayersMap({
          layers: [
            new Tile({
              source: new OSM(),
            }),
          ],
        })
