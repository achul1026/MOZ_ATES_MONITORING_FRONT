/**
 * MozAtes Map Core js
 * @param elementId
 * @param center_lng
 * @param center_lat
 * @param loadedGeoCodeCallback
 * @param useGeoLocation
 * @param isInitDrawCenterMarker
 * @returns {MozAtesMap}
 * @constructor
 */
const MozAtesMap = function(elementId){
    "use strict"

    const _core = this;
    const _pbkey = "pk.eyJ1IjoiZGVzaW1pbjIiLCJhIjoiY2xvbzMwN2t3Mm52dzJrcXR6em5lZ3hmMyJ9.pu7IdtCJVHme2QXzu4sT7w";
    let _center = [32.609310,-25.907068];
    let _map = null;
    let _userLng = null;
    let _userLat = null;
    let _centerMarker = null;
    let _loadingCoverRoot = null;


    _core.init = function(){
        const element = document.getElementById(elementId);
        if(!element) {
            alert("Not found element.");
            return;
        }
        mapboxgl.accessToken = _pbkey;
        window.mbox = _map = new mapboxgl.Map({
            container: elementId, // container ID
            style: 'mapbox://styles/mapbox/streets-v12', // style URL
            center: _center, // starting position [lng, lat]
            zoom: 13, // starting zoom
        });

        _map.on('load', function() {
            
        });
        
    }
    _core.drawIcon = function(){
        
    }

    _core.drawMarker = function(lngLat){
        return new mapboxgl.Marker({ color: 'red'})
            .setLngLat(lngLat)
            .addTo(_map);
    }
    _core.init();


    /* Util */
    _core.util = {
        
    }
    return _core;
};

(function Initialize(){
    window.map = new MozAtesMap("map");

    // map menu event;
    const mapMenuToggleButton = document.getElementById("mapMenuToggleButton");
    const mapMenuToggleTarget = document.getElementById("mapMenu");
    mapMenuToggleButton.addEventListener("click", () => {
        mapMenuToggleButton.getElementsByTagName("svg")[0].classList.toggle("rotate-180");        
        mapMenuToggleTarget.classList.toggle("-translate-x-full");
        document.getElementById("mapMenuContainer").classList.toggle("left-3");
    });
})()