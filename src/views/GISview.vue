<script setup>
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import * as turf from '@turf/turf'
import api from '@/apis'

let map
let draw
const drawnFeatures = ref(null)
const savedAreas = ref([])

onMounted(async () => {
  try {
    const response = await fetch('/style.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const style = await response.json()

    // Modify the tiles URL
    style.sources.openmaptiles.tiles = [import.meta.env.VITE_API_URL+ "/gis/tiles/{z}/{x}/{y}.pbf"]

    map = new maplibregl.Map({
      container: 'map',
      style: style,
      center: [39.20564534600111, 21.58919229802818],
      zoom: 10,
      attributionControl: false, // Remove MapLibre attribution
    })

    // Add drawing controls (fixing Mapbox Draw issue)
    draw = new MapboxDraw({
      displayControlsDefault: false,
    })
    map.addControl(draw)

    // Fix Mapbox Draw `line-dasharray` error
    draw.options.styles.forEach(style => {
      if (style.id?.includes('gl-draw-line') && style.paint?.['line-dasharray']) {
        style.paint['line-dasharray'] = ["literal", [2, 2]]
      }
    })

    map.on('draw.create', (event) => {
      drawnFeatures.value = event.features[0]
    })

    loadAreas()
  } catch (error) {
    console.error('Error loading map style:', error)
  }
})

const saveArea = async () => {
  if (!drawnFeatures.value) return
  const geojson = drawnFeatures.value
  const { data } = await api.gis.createAOI(, {
    name: `Area ${savedAreas.value.length + 1}`,
    geojson,
  })
  savedAreas.value.push({ id: data.id, name: `Area ${savedAreas.value.length + 1}`, geojson })
  alert('Area saved!')
}

const loadAreas = async () => {
  const { data } = await api.gis.getAreas()
  savedAreas.value = data.map(area => ({
    id: area.id,
    name: area.name,
    geojson: area.geojson
  }))

  data.forEach(area => {
    const parsedGeoJSON = JSON.parse(area.geojson)
    map.addSource(`area-${area.id}`, {
      type: 'geojson',
      data: parsedGeoJSON,
    })
    map.addLayer({
      id: `area-${area.id}`,
      type: 'fill',
      source: `area-${area.id}`,
      paint: {
        'fill-color': '#007cbf',
        'fill-opacity': 0.5,
      },
    })
  })
}

const zoomToArea = (area) => {
  if (!map) return
  const parsedGeoJSON = JSON.parse(area.geojson)
  const bbox = turf.bbox(parsedGeoJSON)
  map.fitBounds(bbox, { padding: 20 })
}

const removeAllAOIs = async () => {
  try {
    await api.gis.deleteAOI()
    savedAreas.value.forEach(area => {
      if (map.getLayer(`area-${area.id}`)) {
        map.removeLayer(`area-${area.id}`)
      }
      if (map.getSource(`area-${area.id}`)) {
        map.removeSource(`area-${area.id}`)
      }
    })
    savedAreas.value = []
    alert('All AOIs removed!')
  } catch (error) {
    console.error('Error removing AOIs:', error)
    alert('Failed to remove AOIs!')
  }
}
</script>

<template>
  <div class="container">
    <div id="map"></div>

    <table class="controls">
      <thead>
        <tr>
          <th>Function</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Draw Area of Interest</td>
          <td>
            <button @click="draw.changeMode('draw_polygon')" class="btn">Draw</button>
          </td>
        </tr>
        <tr>
          <td>Save Area</td>
          <td>
            <button @click="saveArea" class="btn">Save</button>
          </td>
        </tr>
        <tr>
          <td>Load Areas</td>
          <td>
            <button @click="loadAreas" class="btn">Load</button>
          </td>
        </tr>
        <tr>
          <td>Remove All AOIs</td>
          <td>
            <button @click="removeAllAOIs" class="btn delete">Remove All</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h3>Saved Areas</h3>
    <table class="controls">
      <thead>
        <tr>
          <th>Area Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="area in savedAreas" :key="area.id">
          <td>{{ area.name }}</td>
          <td><button @click="zoomToArea(area)" class="btn">Go To</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

#map {
  height: 480px;
  width: 680px;
  border: 2px solid #ccc;
  border-radius: 10px;
}

.controls {
  width: 100%;
  max-width: 400px;
  border-collapse: collapse;
  text-align: center;
}

.controls th,
.controls td {
  border: 1px solid #ccc;
  padding: 10px;
}

.controls th {
  background-color: #f4f4f4;
}

.btn {
  background-color: #007cbf;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #005f8f;
}

.btn.delete {
  background-color: red;
}

.btn.delete:hover {
  background-color: darkred;
}
</style>
