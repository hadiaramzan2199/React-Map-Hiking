import React, { useEffect, useRef, useState  } from 'react';
import mapboxgl from 'mapbox-gl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff, faSearch } from '@fortawesome/free-solid-svg-icons';

// Set your Mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1IjoiYWpuYXBoYXQiLCJhIjoiY2xvZTRpaDM2MDdwcDJscGZoZ3doaWRsMiJ9.yc8qe7XCDwqyf42VdVPxVw';

const Map = () => {
    const mapContainer = useRef(null);
    const satelliteStyle = 'mapbox://styles/ajnaphat/clr6lb9kz01ix01quhbu2gvp3';
    const defaultStyle = 'mapbox://styles/ajnaphat/clr6lb42700iy01p52rb7e257';
    const hikingPointsSource = 'ajnaphat.8e8u639b';
    const trekngRouteSource = 'ajnaphat.27bas61j';
    const map = useRef(null);
    const toggleControl = useRef(null);
    const mapStyle = useRef(defaultStyle);
    const searchInput = useRef(null);
    const [pointNotFound, setPointNotFound] = useState(false);
    const [hikingPointsVisible, setHikingPointsVisible] = useState(true);
    const [trekkingRoutesVisible, setTrekkingRoutesVisible] = useState(true);

    // const popupStyle = {
    //   maxWidth: '300px',
    //   padding: '10px 10px 15px',
    //   background: '#fff',
    //   borderRadius: '10px', // Adjusted border radius
    //   boxShadow: '0 1px 2px rgba(0,0,0,.9)', // Adjusted shadow and values
    //   pointerEvents: 'auto',
    //   position: 'relative',
    // };    
  
    // const popupImgStyle = {
    //   width: '150px',
    //   height: '150px',
    //   marginBottom: '10px',
    // };
  
    // const popupTitleStyle = {
    //   fontSize: '20px',
    //   marginBottom: '8px',
    // };
  
    // const popupLinkStyle = {
    //   color: '#007cbf',
    //   textDecoration: 'none',
    //   padding: '8px 12px', // Added padding
    //   borderRadius: '10px', // Adjusted border radius
    //   border: '1px solid #007cbf', // Added border
    //   transition: 'background-color 0.3s, color 0.3s', // Transition effect
    // };
  
    // const popupLinkHoverStyle = {
    //   color: 'black',
    //   textDecoration: 'none',
    //   padding: '8px 12px', // Added padding
    //   borderRadius: '10px', // Adjusted border radius
    //   border: '1px solid #007cbf', // Added border
    // };
  
    const addDataLayers = () => {
      if (!map.current.getSource('points')) {
        map.current.addSource('points', {
          type: 'vector',
          url: `mapbox://${hikingPointsSource}`,
        });
  
        map.current.addLayer({
          id: 'hikingPoints-layer',
          type: 'symbol', // Change the layer type to symbol
          source: 'points',
          'source-layer': 'Coor_CSV-arz06f',
          layout: {
            'icon-image': 'campsite', // Specify the icon image to be used
            'icon-size': 1.5, // Adjust the icon size if needed
            'icon-allow-overlap': true, // Allow icons to overlap
          },
          paint: {},
        });
      }
  
      if (!map.current.getSource('lines')) {
        map.current.addSource('lines', {
          type: 'vector',
          url: `mapbox://${trekngRouteSource}`,
        });
  
        map.current.addLayer({
          id: 'trekingRoutes-layer',
          type: 'line',
          source: 'lines',
          'source-layer': 'All-2lmvhy',
          paint: {
            'line-color': '#ff3d3d',
            'line-width': 2,
          },
        });
  
        // Add click event listener to the map for showing popups
        map.current.on('click', 'hikingPoints-layer', (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const { name, image, blogURL } = e.features[0].properties; // Assuming these properties exist in your data
        
          const popupContent = `
          <style>
            .mapboxgl-popup-content
            {
              max-width: 300px;
              padding: 20px 20px 25px;
              background: #fff;
              border-radius: 25px;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.9);
              pointer-events: auto;
              position: relative;
            }  
            .mapboxgl-popup-close-button {
              background-color: transparent;
              border: 0;
              border-radius: 0 3px 0 0;
              cursor: pointer;
              position: absolute;
              right: 5px;
              top: 5px;
            }
          </style>
          <div>
            <img src="${image}" alt="${name}" style="
              width: 150px;
              height: 150px;
              margin-bottom: 10px;
              margin-top: 10px;
            ">
            <h3 style="
              font-size: 16px;
              margin-bottom: 8px;
              font-weight: normal;
            ">Name: ${name}</h3>
            <button style="
              color: #007cbf;
              text-decoration: none;
              padding: 8px 12px;
              border-radius: 10px;
              border: 1px solid #007cbf;
              transition: background-color 0.3s, color 0.3s;
            "
            onmouseover="this.style='color: black; text-decoration: none; padding: 8px 12px; border-radius: 10px; border: 1px solid #007cbf;'" 
            onmouseout="this.style='color: #007cbf; text-decoration: none; padding: 8px 12px; border-radius: 10px; border: 1px solid #007cbf;'"
            onclick="window.open('${blogURL}', '_blank')"
            >Read More</button>
          </div>
        `;


        
          // Create a popup
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map.current);
        });
  
        // Change the cursor to a pointer when hovering over the points
        map.current.on('mouseenter', 'hikingPoints-layer', () => {
          map.current.getCanvas().style.cursor = 'pointer';
        });
  
        // Change it back to the default cursor when it leaves
        map.current.on('mouseleave', 'hikingPoints-layer', () => {
          map.current.getCanvas().style.cursor = '';
        });
      }
    };

    const togglePointsLayer = () => {
      setHikingPointsVisible((prevVisibility) => !prevVisibility);
      const visibility = !hikingPointsVisible ? 'visible' : 'none'; // Adjusted logic
      map.current.setLayoutProperty('hikingPoints-layer', 'visibility', visibility);
  };

  const toggleLinesLayer = () => {
      setTrekkingRoutesVisible((prevVisibility) => !prevVisibility);
      const visibility = !trekkingRoutesVisible ? 'visible' : 'none'; // Adjusted logic
      map.current.setLayoutProperty('trekingRoutes-layer', 'visibility', visibility);
  };
  
    // const togglePointsLayer = () => {
    //   const visibility = map.current.getLayoutProperty('hikingPoints-layer', 'visibility');
    //   if (visibility === 'visible') {
    //     map.current.setLayoutProperty('hikingPoints-layer', 'visibility', 'none');
    //   } else {
    //     map.current.setLayoutProperty('hikingPoints-layer', 'visibility', 'visible');
    //   }
    // };
  
    // const toggleLinesLayer = () => {
    //   const visibility = map.current.getLayoutProperty('trekingRoutes-layer', 'visibility');
    //   if (visibility === 'visible') {
    //     map.current.setLayoutProperty('trekingRoutes-layer', 'visibility', 'none');
    //   } else {
    //     map.current.setLayoutProperty('trekingRoutes-layer', 'visibility', 'visible');
    //   }
    // };
  
    const toggleMapStyle = () => {
      mapStyle.current = mapStyle.current === defaultStyle ? satelliteStyle : defaultStyle;
      map.current.setStyle(mapStyle.current);
      console.log('Toggle clicked! Map style switched.');
  
      if (mapStyle.current === satelliteStyle || mapStyle.current === defaultStyle) {
        map.current.on('style.load', addDataLayers);
      } else {
        map.current.off('style.load', addDataLayers);
      }
    };

    const highlightSearchedPoint = (point) => {
        if (!map.current.getSource('searched-point')) {
            map.current.addSource('searched-point', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [],
                },
            });

            map.current.addLayer({
                id: 'searched-point-layer',
                type: 'circle',
                source: 'searched-point',
                paint: {
                    'circle-radius': 8,
                    'circle-color': '#ff0000',
                },
            });
        }

        const searchedPointData = {
            type: 'FeatureCollection',
            features: [point],
        };

        map.current.getSource('searched-point').setData(searchedPointData);
    };

    const handleSearch = () => {
        const searchedPointName = searchInput.current.value.trim();

        const features = map.current.querySourceFeatures('points', {
            sourceLayer: 'Coor_CSV-arz06f',
            filter: ['==', 'name', searchedPointName],
        });

        if (features.length > 0) {
            const coordinates = features[0].geometry.coordinates.slice();
            map.current.flyTo({ center: coordinates, zoom: 8 }); // Adjusted zoom level for better visibility
            highlightSearchedPoint(features[0]);
            displaySearchedPoint(features[0]);
            setPointNotFound(false); // Reset the point not found state
        } else {
            setPointNotFound(true); // Set the point not found state
            displaySearchedPoint(null);
        }
    };

    const displaySearchedPoint = (point) => {
        // Remove existing popup
        const popup = document.querySelector('.mapboxgl-popup');
        if (popup) {
            popup.remove();
        }
    
        if (point) {
            const { name, image, blogURL } = point.properties;
    
            const popupContent = `
          <style>
            .mapboxgl-popup-content
            {
              max-width: 300px;
              padding: 20px 20px 25px;
              background: #fff;
              border-radius: 25px;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.9);
              pointer-events: auto;
              position: relative;
            }  
            .mapboxgl-popup-close-button {
              background-color: transparent;
              border: 0;
              border-radius: 0 3px 0 0;
              cursor: pointer;
              position: absolute;
              right: 5px;
              top: 5px;
            }
          </style>
          <div>
            <img src="${image}" alt="${name}" style="
              width: 150px;
              height: 150px;
              margin-bottom: 10px;
              margin-top: 10px;
            ">
            <h3 style="
              font-size: 16px;
              margin-bottom: 8px;
              font-weight: normal;
            ">Name: ${name}</h3>
            <button style="
              color: #007cbf;
              text-decoration: none;
              padding: 8px 12px;
              border-radius: 10px;
              border: 1px solid #007cbf;
              transition: background-color 0.3s, color 0.3s;
            "
            onmouseover="this.style='color: black; text-decoration: none; padding: 8px 12px; border-radius: 10px; border: 1px solid #007cbf;'" 
            onmouseout="this.style='color: #007cbf; text-decoration: none; padding: 8px 12px; border-radius: 10px; border: 1px solid #007cbf;'"
            onclick="window.open('${blogURL}', '_blank')"
            >Read More</button>
          </div>
        `;


    
            const popupElement = new mapboxgl.Popup()
                .setLngLat(point.geometry.coordinates)
                .setHTML(popupContent);
    
            popupElement.addTo(map.current);
    
            // Close event for the popup
            popupElement.on('close', () => {
                // Reset the zoom level and remove the highlight
                map.current.flyTo({ center: [101.5, 13.68], zoom: 4.7 });
                map.current.getSource('searched-point').setData({
                    type: 'FeatureCollection',
                    features: [],
                });
            });
        }
    };    
        
    useEffect(() => {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle.current,
        center: [101.5, 13.68],
        zoom: 4.7,
        attributionControl: false,
        logoPosition: 'bottom-left',
      });
  
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  
      toggleControl.current = document.createElement('div');
      toggleControl.current.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
      toggleControl.current.style.cursor = 'pointer';
      toggleControl.current.style.position = 'absolute';
      toggleControl.current.style.bottom = '10px';
      toggleControl.current.style.right = '10px';
      toggleControl.current.style.width = '50px';
      toggleControl.current.style.height = '50px';
      toggleControl.current.style.border = '1px solid #ccc';
  
      toggleControl.current.style.backgroundImage = mapStyle.current === defaultStyle ?
        `url('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/0,0,1,0,0/300x300?access_token=${mapboxgl.accessToken}')` :
        `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/0,0,1,0,0/300x300?access_token=${mapboxgl.accessToken}')`;
  
      toggleControl.current.style.backgroundSize = 'cover';
  
      toggleControl.current.addEventListener('click', toggleMapStyle);
      mapContainer.current.appendChild(toggleControl.current);
  
      map.current.on('load', () => {
        // Ensure data layers are added when the map loads initially
        addDataLayers();
      });
  
      return () => {
        map.current.remove();
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    return (
      <div>
        <div ref={mapContainer} style={{ width: '100%', height: '640px', position: 'relative' }} />
        <div style={{
          position: 'absolute',
          top: '70px',
          left: '10px',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
          fontSize: '14px',
      }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                  style={{ background: 'none', border: 'none', marginRight: '5px' }}
                  onClick={togglePointsLayer}
              >
                  {hikingPointsVisible ? <FontAwesomeIcon icon={faToggleOn} /> : <FontAwesomeIcon icon={faToggleOff} />}
              </button>
              <span>Hiking Points</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                  style={{ background: 'none', border: 'none', marginRight: '5px' }}
                  onClick={toggleLinesLayer}
              >
                  {trekkingRoutesVisible ? <FontAwesomeIcon icon={faToggleOn} /> : <FontAwesomeIcon icon={faToggleOff} />}
              </button>
              <span>Trekking Routes</span>
          </div>
      </div>

      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
    }}>
        <input
            type="text"
            placeholder="Search hiking point name..."
            ref={searchInput}
            style={{
                marginRight: '8px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '5px',
            }}
        />
        <button
            style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                color: '#007cbf',
                cursor: 'pointer',
            }}
            onClick={handleSearch}
        >
            <FontAwesomeIcon icon={faSearch} />
        </button>
        {pointNotFound && (
            <p style={{
                backgroundColor: 'white',
                padding: '8px',
                borderRadius: '5px',
                marginTop: '10px',
            }}>
                No hiking point found!
            </p>
        )}
    </div>

      </div>
    );
  };

export default Map;