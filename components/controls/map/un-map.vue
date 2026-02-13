<template>
    <div style="position: relative;">
        <div id="map" :class="{ 'no-height d-none':imageUrl}"></div>
        <img :src="imageUrl" v-if="imageUrl" class="img-fluid map">
        <div v-if="showEuFlag" class="eu-flag-container" :style="flagStyle"
             data-bs-toggle="tooltip" data-bs-placement="top" 
             :title="lstring(europeanUnion?.name, locale)" ref="euFlagRef">
             <img src="/eu-map.png" class="eu-flag">
             <span class="eu-text">{{ lstring(europeanUnion?.name, locale) }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
//@ts-nocheck
    import { useCountriesStore }    from '@/stores/countries';
    import { Tooltip } from 'bootstrap';
    import { lstring } from '~/utils';

    const props = defineProps({
        countryColors : { type:Array<CountryColor>, required:true},
        zoom   : { type:Number, default : 0.8 },
        screenshotOnly: { type:Boolean, default : false }
    });

    const mapActions = inject(UNMapActionsKey);
    const emit       = defineEmits([]);

    const countriesStore = useCountriesStore ();
    const {t, locale }   = useI18n();
    const route          = useRoute()

    const imageUrl = ref();
    const showEuFlag = ref(false);
    const euFlagRef  = ref(null);
    let map;
    let bsTooltip;

    const flagStyle = computed(() => {
        return {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100px',
            height: '70px',
            padding: '5px',
            flexDirection: 'column' // #Alignment for text
        };
    });
    const europeanUnion = computed(()=>{
        if(!countriesStore?.countries?.length)
            return {};

        return countriesStore.countries.find(e=>e.code == 'EU');
    })

    

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
                            id: 'coloredCountries'+color,
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
                            id: 'bnda_border'+color,
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

                        const EU_ISO3 = 'EUR';
                        showEuFlag.value = props.countryColors.some(c => EU_ISO3 == c.code3);
                        if(showEuFlag.value){
                            nextTick(()=>{
                                if(euFlagRef.value){
                                    bsTooltip = new Tooltip(euFlagRef.value);
                                }
                            })  
                        }
                    }
                });

                // Pattern Overlay
                const patternCountries = props.countryColors.filter(e => e.pattern).map(e => e.code3);
         
                if (patternCountries.length) {
                     // Create stripe pattern
                    const createStripePattern = () => {
                         const width = 8;
                         const height = 8;
                         const canvas = document.createElement('canvas');
                         canvas.width = width;
                         canvas.height = height;
                         const ctx = canvas.getContext('2d');
                         
                         // Transparent background
                         ctx.fillStyle = 'rgba(255, 255, 255, 0)';
                         ctx.fillRect(0, 0, width, height);
                         
                         // Stripe
                         ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                         ctx.lineWidth = 2;
                         ctx.beginPath();
                         ctx.moveTo(0, height);
                         ctx.lineTo(width, 0);
                         ctx.stroke();

                         return ctx.getImageData(0, 0, width, height);
                    }
                    
                    if (!map.hasImage('stripe-pattern')) {
                        map.addImage('stripe-pattern', createStripePattern());
                    }

                    map.addLayer({
                        id: 'countries-pattern-overlay',
                        type: 'fill',
                        source: 'v',
                        'source-layer': 'bnda',
                        maxzoom: 4,
                        minzoom: 0,
                        filter: ['in', 'ISO3CD', ...patternCountries],
                        paint: {
                            'fill-pattern': 'stripe-pattern',
                            'fill-opacity': 1
                        }
                    });
                }
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
    onMounted(async()=>{
        await countriesStore.loadCountries()
        await initMap()
    })

    onUnmounted(() => {
        if(bsTooltip)
            bsTooltip.dispose();
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
    .eu-flag-container {
        position: absolute;
        bottom: 35px;
        left: 10px;
        z-index: 5;
    }
    .eu-flag {
        height: auto;
        width: 100%;
        object-fit: contain;
        flex: 1; /* Take available space */
    }
    .eu-text {
        font-size: 10px;
        font-weight: bold;
        color: #333;
        line-height: 1;
        margin-top: 2px;
    }
</style>