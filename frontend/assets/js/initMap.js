        // Initialize the platform object:
        var platform = new H.service.Platform({
        'app_id': 'Zt6kgEj7u9XVc3QmoIbI',
        'app_code': 'tfO142v5R0r359GZAdpT_g'
        });

        var pixelRatio = window.devicePixelRatio || 1;
        var defaultLayers = platform.createDefaultLayers({
          tileSize: pixelRatio === 1 ? 256 : 512,
          ppi: pixelRatio === 1 ? undefined : 320
        });
        // Obtain the default map types from the platform object
        var maptypes = platform.createDefaultLayers();
        // Instantiate (and display) a map object:
        var map = new H.Map(
        document.getElementById('mapContainer'),
        maptypes.normal.map,
        {
          pixelRatio: pixelRatio,
          zoom: document.getElementById("zoom").value,
          center: { lng: document.getElementById("long").value ,lat: document.getElementById("lat").value }
        });
        if(document.getElementById("lat").value == '30.0444' && document.getElementById("long").value == '31.2357'){

        }else{
           var  romeMarker = new H.map.Marker({lat:document.getElementById("lat").value, lng: document.getElementById("long").value});
            map.addObject(romeMarker);
        }

  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

