
n startup(Cesium) {
    'use strict';
//Sandcastle_Begin
var viewer = new Cesium.Viewer('cesiumContainer', {
    selectionIndicator : false,
    infoBox : false
});
var scene = viewer.scene;
var handler;
Sandcastle.addDefaultToolbarButton('Show Cartographic Position on Mouse Over', function() {
    var entity = viewer.entities.add({
        label : {
            show : false
        }
    });
    // Mouse over the globe to see the cartographic position
    handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function(movement) {
        var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
        if (cartesian) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
            entity.position = cartesian;
            entity.label.show = true;
            entity.label.text = '(' + longitudeString + ', ' + latitudeString + ')';
        } else {
            entity.label.show = false;
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
});
Sandcastle.addToolbarButton('Pick Entity', function() {
    var entity = viewer.entities.add({
        position : Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard : {
            image : '../images/Cesium_Logo_overlay.png'
        }
    });
    // If the mouse is over the billboard, change its scale and color
    handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function(movement) {
        var pickedObject = scene.pick(movement.endPosition);
        if (Cesium.defined(pickedObject) && (pickedObject.id === entity)) {
            entity.billboard.scale = 2.0;
            entity.billboard.color = Cesium.Color.YELLOW;
        } else {
            entity.billboard.scale = 1.0;
            entity.billboard.color = Cesium.Color.WHITE;
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
});
Sandcastle.addToolbarButton('Drill-Down Picking', function() {
    var pickedEntities = new Cesium.EntityCollection();
    var pickColor = Cesium.Color.YELLOW.withAlpha(0.5);
    function makeProperty(entity, color) {
        var colorProperty = new Cesium.CallbackProperty(function(time, result) {
            if (pickedEntities.contains(entity)) {
                return pickColor.clone(result);
            }
            return color.clone(result);
        }, false);
        entity.polygon.material = new Cesium.ColorMaterialProperty(colorProperty);
    }
    var red = viewer.entities.add({
        polygon : {
            hierarchy : Cesium.Cartesian3.fromDegreesArray([-70.0, 30.0,
                                                            -60.0, 30.0,
                                                            -60.0, 40.0,
                                                            -70.0, 40.0]),
            height : 0
        }
    });
    makeProperty(red, Cesium.Color.RED.withAlpha(0.5));
    var blue = viewer.entities.add({
        polygon : {
            hierarchy : Cesium.Cartesian3.fromDegreesArray([-75.0, 34.0,
                                                            -63.0, 34.0,
                                                            -63.0, 40.0,
                                                            -75.0, 40.0]),
            height : 0
        }
    });
    makeProperty(blue, Cesium.Color.BLUE.withAlpha(0.5));
    var green = viewer.entities.add({
        polygon : {
            hierarchy : Cesium.Cartesian3.fromDegreesArray([-67.0, 36.0,
                                                            -55.0, 36.0,
                                                            -55.0, 30.0,
                                                            -67.0, 30.0]),
            height : 0
        }
    });
    makeProperty(green, Cesium.Color.GREEN.withAlpha(0.5));
    // Move the primitive that the mouse is over to the top.
    handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function(movement) {
        // get an array of all primitives at the mouse position
        var pickedObjects = scene.drillPick(movement.endPosition);
        if (Cesium.defined(pickedObjects)) {
            //Update the collection of picked entities.
            pickedEntities.removeAll();
            for (var i = 0; i < pickedObjects.length; ++i) {
                var entity = pickedObjects[i].id;
                pickedEntities.add(entity);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
});
Sandcastle.addToolbarButton('Pick position', function() {
    var modelEntity = viewer.entities.add({
        name : 'milktruck',
        position : Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706),
        model : {
            uri : '../../SampleData/models/CesiumMilkTruck/CesiumMilkTruck-kmc.gltf'
        }
    });
    viewer.zoomTo(modelEntity);
    
    var labelEntity = viewer.entities.add({
        label : {
            show : false,
            horizontalOrigin : Cesium.HorizontalOrigin.LEFT
        }
    });
    // Mouse over the globe to see the cartographic position
    handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function(movement) {
        var foundPosition = false;
        
        var scene = viewer.scene;
        var pickedObject = scene.pick(movement.endPosition);
        if (scene.pickPositionSupported && Cesium.defined(pickedObject) && pickedObject.id === modelEntity) {
            var cartesian = viewer.scene.pickPosition(movement.endPosition);
            
            if (Cesium.defined(cartesian)) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
                var heightString = cartographic.height.toFixed(2);
    
                labelEntity.position = cartesian;
                labelEntity.label.show = true;
                labelEntity.label.text = '(' + longitudeString + ', ' + latitudeString + ', ' + heightString + ')';
                
                var camera = scene.camera;
                labelEntity.label.eyeOffset = new Cesium.Cartesian3(0.0, 0.0, camera.frustum.near * 1.5 - Cesium.Cartesian3.distance(cartesian, camera.position));
                
                foundPosition = true;
            }
        }
        
        if (!foundPosition) {
            labelEntity.label.show = false;
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
});
Sandcastle.reset = function() {
    viewer.entities.removeAll();
    handler = handler && handler.destroy();
};
//Sandcastle_End
Sandcastle.finishedLoading();
}
if (typeof Cesium !== "undefined") {
    startup(Cesium);
} else if (typeof require === "function") {
    require(["Cesium"], startup);
}
