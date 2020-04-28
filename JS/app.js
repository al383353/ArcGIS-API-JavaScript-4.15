//https://developers.arcgis.com/javascript/latest/guide/configure-pop-ups/
    require([
        "esri/Map",
        "esri/views/MapView", //SceneView
        "esri/widgets/BasemapToggle",
        "esri/widgets/BasemapGallery",
        "esri/layers/FeatureLayer"
      ], function(Map, MapView, BasemapToggle, BasemapGallery, FeatureLayer) {//SceneView
  
        var map = new Map({
          basemap: "streets-navigation-vector" //,ground: "world-elevation"  // show elevation
        });
  
        var view = new MapView({
          container: "viewDiv",
          map: map,//camera:{position:{X, Y, Z}, tilt}
          center: [-118.71511,34.09042],
          zoom: 11
        });
        /*var basemapToggle = new BasemapToggle({
            view:view,
            nextBasemap:"satellite"
        });
        view.ui.add(basemapToggle, "top-right");*/
        var basemapGallery= new BasemapGallery({
            view:view,
            source:{
                portal:{
                    url:"https://www.arcgis.com",
                    //useVectorBasemaps:true // Load vector tile basemaps
                    useVectorBasemaps: false  // Load raster tile basemaps
                }
            }
         });
         view.ui.add(basemapGallery, "top-right");
  
         
          // Trails feature layer (lines)
        var trailsLayer = new FeatureLayer({
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
  
          definitionExpression: "ELEV_GAIN < 250",
  
          renderer: {
            type: "simple",
            symbol: {
              type: "simple-line",
              color: "red",
              width: "4px"
            }
          },
  
          //*** ADD ***//
          outFields: ["TRL_NAME","ELEV_GAIN"],
  
          //*** ADD ***//
          popupTemplate: {  // Enable a popup
            title: "{TRL_NAME}", // Show attribute value
            content: "The trail elevation gain is {ELEV_GAIN} ft."  // Display text in pop-up
          }
        });
  
        map.add(trailsLayer, 0);
  
        // Parks and open spaces (polygons)
        function createFillSymbol(value, color) {
          return {
            value: value,
            symbol: {
              color: color,
              type: "simple-fill",
              style: "solid",
              outline: {
                style: "none"
              }
            },
            label: value
          };
        }
  
        var openSpacesRenderer = {
          type: "unique-value",
          field: "TYPE",
          uniqueValueInfos: [
            createFillSymbol("Natural Areas", "#9E559C"),
            createFillSymbol("Regional Open Space", "#A7C636"),
            createFillSymbol("Local Park", "#149ECE"),
            createFillSymbol("Regional Recreation Park", "#ED5151")
          ]
        };
        var parksLayer = new FeatureLayer({
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0",
          renderer: openSpacesRenderer,
          opacity: 0.50
        });
  
        map.add(parksLayer, 0);/* Configure layers tutorial to apply styles on the server-side and the Style 
        feature layers tutorial to apply styles on the client-side*/
        /*
        var trailheadsRenderer = {
          type: "simple",
          symbol: {
            type: "picture-marker",
            url: "http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png",
            width: "18px",
            height: "18px"
          }
        };
        var trailheadsLabels = {
          symbol: {
            type: "text",
            color: "#FFFFFF",
            haloColor: "#5E8D74",
            haloSize: "2px",
            font: {
              size: "12px",
              family: "Noto Sans",
              style: "italic",
              weight: "normal"
            }
          },
          labelPlacement: "above-center",
          labelExpressionInfo: {
            expression: "$feature.TRL_NAME"
          }
        };
        
        var trailHead = new FeatureLayer({
             url:"https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
             renderer: trailheadsRenderer,
             labelingInfo: [trailheadsLabels]
         });
         map.add(trailHead);*/
         var trailsRenderer = {
          type: "simple",
          symbol: {
            color: "#BA55D3",
            type: "simple-line",
            style: "solid"
          },
          visualVariables: [
            {
              type: "size",
              field: "ELEV_GAIN",
              minDataValue: 0,
              maxDataValue: 2300,
              minSize: "3px",
              maxSize: "7px"
            }
          ]
        };
        var trails = new FeatureLayer({
          url:
            "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
          renderer: trailsRenderer,
          opacity: .75
        });
  
        map.add(trails, 1);
        var bikeTrailsRenderer = {
          type: "simple",
          symbol: {
            type: "simple-line",
            style: "short-dot",
            color: "#FF91FF",
            width: "1px"
          }
        };
        var bikeTrails = new FeatureLayer({
          url:
            "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
          renderer: bikeTrailsRenderer,
          definitionExpression: "USE_BIKE = 'YES'"
        });
  
        map.add(bikeTrails, 2);
        //
        var popuptrailHead={
            "title":"{TRL_NAME}",
            "content": "<b>City:</b> {CITY_JUR}<br><b>Cross Street:</b> {X_STREET}<br><b>Parking:</b> {PARKING}<br><b>Elevation:</b> {ELEV_FT} ft"
        }
        var trailHeadPopup = new FeatureLayer({
             url:"https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0",
             outFields:["TRL_NAME", "CITY_JUR","X_STREET","PARKING","ELEV_FT"],
             popupTemplate:popuptrailHead
         });
         map.add(trailHeadPopup);
      });