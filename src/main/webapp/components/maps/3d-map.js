import Cesium from 'cesium/Cesium'
window.Cesium = Cesium // expose Cesium to the OL-Cesium library
require('cesium/Widgets/widgets.css')
import OLCesium from 'ol-cesium'

import Map from './map-singleton'

const ol3d = new OLCesium({ map: Map })
