<template>
    <div id="map" :class="{ 'no-height d-none':imageUrl}"></div>
    <img :src="imageUrl" v-if="imageUrl" class="img-fluid map">
</template>

<script setup lang="ts">
//@ts-nocheck
    import { useCountriesStore }    from '@/stores/countries';

    const props = defineProps({
        countryColors : { type:Array<CountryColor>, required:true},
        zoom   : { type:Number, default : 0.8 },
        screenshotOnly: { type:Boolean, default : false },
    });

    const mapActions = inject(UNMapActionsKey);
    const emit       = defineEmits([]);

    const countriesStore = useCountriesStore ();
    const {t, locale }   = useI18n();
    const route          = useRoute()

    const imageUrl = ref();
        
    let map;

    useHead({
        script:[
            {
                hid: 'un-mapbox-gl',
                src : 'https://UN-Geospatial.github.io/cartotile-plain-design/mapbox-gl.js',
                defer: true,
                // callback: initMap
            }
        ],
        link:[
            {rel: 'stylesheet', type: 'text/css', href: 'https://UN-Geospatial.github.io/cartotile-plain-design/mapbox-gl.css'},
        ]
    })

    async function initMap(){
        
        if(!window.mapboxgl){
            await sleep(500)
        }
        if(!window.mapboxgl)return;
        map = new window.mapboxgl.Map({
            container: 'map',
            attributionControl: true, hash: true, renderWorldCopies: false, maxZoom: 3, zoom: props.zoom,
            style: {
                version: 8,
                sources: {
                    v: {
                        type: 'vector',
                        tiles: ['https://UN-Geospatial.github.io/cartotile-plain-design/data/cartotile_v01/{z}/{x}/{y}.pbf'],
                        attribution: '<table><tr><td style="font-size: 7pt; line-height: 100%">The boundaries and names shown and the designations used on this map do not imply official endorsement or acceptance by the United Nations.​ Final boundary between the Republic of Sudan and the Republic of South Sudan has not yet been determined.​<br>* Non-Self Governing Territories<br>** Dotted line represents approximately the Line of Control in Jammu and Kashmir agreed upon by India and Pakistan. The final status of Jammu and Kashmir has not yet been agreed upon by the parties.​<br>*** A dispute exists between the Governments of Argentina and the United Kingdom of Great Britain and Northern Ireland concerning sovereignty over the Falkland Islands (Malvinas).</td><td  style="font-size: 5pt; color: #009EDB" valign="bottom">Powered by<br><img src="https://unopengis.github.io/watermark/watermark.png" alt="UN OpenGIS logo" width="50" height="50"></td></tr></table>',
                        maxzoom: 2,
                        minzoom: 0
                    }
                },
                glyphs: 'https://UN-Geospatial.github.io/cartotile-plain-design/font/{fontstack}/{range}.pbf',
                transition: {
                    duration: 0,
                    delay: 0
                },
                layers: [
                    // {
                    //     id: 'background',
                    //     type: 'background',
                    //     layout: { 'visibility': 'visible' },
                    //     paint: {
                    //         'background-color': ['rgb', 255, 255, 255]
                    //     }
                    // },
                    {
                        id: 'bnda',
                        type: 'fill',
                        source: 'v',
                        'source-layer': 'bnda',
                        maxzoom: 4,
                        minzoom: 0,
                        filter: [
                            'none',
                            ['==', 'ISO3CD', 'ATA']
                        ],
                        paint: {
                            'fill-color': ['rgb', 237, 237, 237]
                        }
                    },
                    {
                        id: 'bndl_solid',
                        type: 'line',
                        source: 'v',
                        'source-layer': 'bndl',
                        maxzoom: 4,
                        minzoom: 0,
                        filter: [
                            'any',
                            ['==', 'BDYTYP', 1],
                            ['==', 'BDYTYP', 0],
                            ['==', 'BDYTYP', 2]
                        ],
                        paint: {
                            'line-color': ['rgb', 77, 77, 77],
                            'line-width': 0.8
                        }
                    },
                    {
                        id: 'bndl_dashed',
                        type: 'line',
                        source: 'v',
                        'source-layer': 'bndl',
                        maxzoom: 4,
                        minzoom: 0,
                        filter: [
                            'all',
                            ['==', 'BDYTYP', 3]
                        ],
                        paint: {
                            'line-color': ['rgb', 77, 77, 77],
                            'line-dasharray': [3, 2],
                            'line-width': 0.8
                        }
                    },
                    {
                        id: 'bndl_dotted',
                        type: 'line',
                        source: 'v',
                        'source-layer': 'bndl',
                        maxzoom: 4,
                        minzoom: 0,
                        filter: [
                            'all',
                            ['==', 'BDYTYP', 4]
                        ],
                        paint: {
                            'line-color': ['rgb', 77, 77, 77],
                            'line-dasharray': [1, 2],
                            'line-width': 0.8
                        }
                    }
                ]
            }
        });
        var popup = new window.mapboxgl.Popup({
            closeButton: true,
            closeOnClick: false
        });

        map.on('mousemove', 'bnda', function (e) {
            map.getCanvas().style.cursor = 'pointer';

            if (e.features[0].properties.STSCOD == 1) {
                var html = "<p class='stscod1'>" + e.features[0].properties.MAPLAB.toUpperCase() + "</p>";

                popup
                    .setLngLat(e.lngLat)
                    .setHTML(html)
                    .addTo(map)
            } else if (e.features[0].properties.STSCOD == 2) {
                var html = "<p class='stscod2'>" + e.features[0].properties.MAPLAB.toUpperCase() + "</p>";

                popup
                    .setLngLat(e.lngLat)
                    .setHTML(html)
                    .addTo(map)
            } else if (e.features[0].properties.STSCOD == 3) {

                if (e.features[0].properties.MAPLAB == "Falkland Islands (Malvinas) ***") {

                    var html = "<p class='stscod3'>" + e.features[0].properties.MAPLAB + "</p>";
                } else {
                    var html = "<p class='stscod3'>" + e.features[0].properties.MAPLAB + "</p>";
                }

                popup
                    .setLngLat(e.lngLat)
                    .setHTML(html)
                    .addTo(map)
            } else if (e.features[0].properties.STSCOD == 4) {
                var html = "<p class='stscod4'>" + e.features[0].properties.MAPLAB + "</p>";

                popup
                    .setLngLat(e.lngLat)
                    .setHTML(html)
                    .addTo(map)
            } else if (e.features[0].properties.STSCOD == 5) {
                var html = "<p class='stscod5'>" + e.features[0].properties.MAPLAB + "</p>";

                popup
                    .setLngLat(e.lngLat)
                    .setHTML(html)
                    .addTo(map)
            } else if (e.features[0].properties.STSCOD == 6) {
                var html = "<p class='stscod6'>" + e.features[0].properties.MAPLAB + "</p>";

                popup
                    .setLngLat(e.lngLat)
                    .setHTML(html)
                    .addTo(map)
            } else if (e.features[0].properties.STSCOD == 99) {

                if (e.features[0].properties.MAPLAB == "Jammu and Kashmir **") {
                    var html = "<p class='stscod6'>" + e.features[0].properties.MAPLAB + "​</p>";

                    popup
                        .setLngLat(e.lngLat)
                        .setHTML(html)
                        .addTo(map)
                } else {
                    popup.remove();
                }
            }

        });

        map.on('load', () => {
            
            map.addControl(new mapboxgl.NavigationControl());   
            
            if(props.countryColors?.length){

                const colors = [...new Set(props.countryColors?.map(e=>e.color))];

                colors?.forEach(color => {
                    
                    const colorCountries = props.countryColors?.filter(e=>e.color == color).map(e=>e.code3)
                    if(colorCountries?.length){
                        const coloredCountries = {
                            id: 'coloredCountries',
                            type: 'fill',
                            source: 'v',
                            'source-layer': 'bnda',
                            maxzoom: 4,
                            minzoom: 0,
                            filter: [
                                'any',
                                ['in', 'ISO3CD', ...colorCountries]
                            ],
                            paint: {
                                'fill-color': color
                            }
                        }
                        const border = {
                            id: 'bnda_border',
                            type: 'line',
                            source: 'v',
                            'source-layer': 'bnda',
                            maxzoom: 4,
                            minzoom: 0,
                            filter: [
                                'any',
                                ['in', 'ISO3CD', ...colorCountries]
                            ],
                            paint: {
                                'line-color': ['rgb', 77, 77, 77],
                                'line-width': 0.2
                            }
                        }
                        map.addLayer(coloredCountries);                       
                        map.addLayer(border);
                    }
                });
            }
            if(props.zoom)
                map.setZoom(props.zoom);
            
            if(props.screenshotOnly){
                
                setTimeout(() => {
                    takeScreenshot(map).then((data)=>{
                        imageUrl.value = data;
                        map.remove();
                        map = undefined;
                    });
                    
                }, 300);
            }

        });
    }
    function takeScreenshot(map) {
        return new Promise(function(resolve, reject) {
            map.once("render", function() {
            resolve(map.getCanvas().toDataURL());
            });
            /* trigger render */
            map.setBearing(map.getBearing());
        })
    }
    onMounted(()=>{
        countriesStore.loadCountries()
        initMap()
    })

    onUnmounted(() => {
        if(window.mapboxgl && map )
            map.remove();
    })
</script>

<style scoped>
    #map, .map {
        /* position: absolute; */
        height: 400px;
        width: 100%;
        border: 1px solid #eee;
        visibility: unset;
    }
    .no-height{
        height: 0px!important;
    }
</style>