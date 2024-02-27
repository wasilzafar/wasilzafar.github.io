    const map = L.map('map').setView([53.28749, -6.37466], 18);

    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

	const marker = L.marker([53.28775,-6.37446]).addTo(map).bindPopup('<b>Hello world!</b><br />I am a popup.').openPopup();

	const circle = L.circle([53.28775,-6.37446], {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5,
		radius: 50
	}).addTo(map).bindPopup('I am a circle.');

 	const polygon = L.polygon([
		[53.28790,-6.37520],
		[53.28762,-6.37418],
		[53.28745,-6.37503]
	]).addTo(map).bindPopup('I am a polygon.');


	const popup = L.popup();

	function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent(`You clicked the map at ${e.latlng.toString()}`)
			.openOn(map);
	}

	map.on('click', onMapClick); 



    const map2 = L.map('map2').setView([53.28749, -6.37466], 4);



    var basemaps = {
        Topography: L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
            layers: 'TOPO-WMS'
        }),
    
        Places: L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
            layers: 'OSM-Overlay-WMS'
        }),

        HILLShades: L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'SRTM30-Colored-Hillshade'
        }),
    
        'Topography, then places': L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
            layers: 'TOPO-WMS,OSM-Overlay-WMS'
        }),
    
        'Places, then topography': L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
            layers: 'OSM-Overlay-WMS,TOPO-WMS'
        })
    };
    
    L.control.layers(basemaps).addTo(map2);
    
    basemaps.Topography.addTo(map2);

    function onMapClick(e) {
		//popup.setLatLng(e.latlng).setContent(`You clicked the map at ${e.latlng.toString()}`).openOn(map2);
        L.circle(e.latlng, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 50
        }).addTo(map2).bindPopup('I am a circle.');
	}

    map2.on('click', onMapClick); 








    var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
        denver    = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
        aurora    = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
        golden    = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');

    var cities = L.layerGroup([littleton, denver, aurora, golden]);

    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    });

    var streets = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});


    var map3 = L.map('map3', {
        center: [39.73, -104.99],
        zoom: 10,
        layers: [osm, cities]
    });

    var baseMaps = {
        "OpenStreetMap": osm,
        "Mapbox Streets": streets
    };

    var overlayMaps = {
        "Cities": cities
    };

    var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map3);


    var baseMaps = {
        "<span style='color: gray'>Grayscale</span>": 0.5,
        "Streets": streets
    };


    var crownHill = L.marker([39.75, -105.09]).bindPopup('This is Crown Hill Park.'),
        rubyHill = L.marker([39.68, -105.00]).bindPopup('This is Ruby Hill Park.');
        
    var parks = L.layerGroup([crownHill, rubyHill]);
    var satellite = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {id: 'MapID', tileSize: 512, zoomOffset: -1, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});

    layerControl.addBaseLayer(satellite, "Satellite");
    layerControl.addOverlay(parks, "Parks");


