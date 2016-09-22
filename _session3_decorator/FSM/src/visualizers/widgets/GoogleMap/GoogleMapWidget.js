/*globals define, WebGMEGlobal, $, google*/
/*jshint browser: true*/

/**
 * Generated by VisualizerGenerator 1.7.0 from webgme on Thu Sep 22 2016 18:48:17 GMT-0500 (Central Daylight Time).
 */

define(['css!./styles/GoogleMapWidget.css'], function () {
    'use strict';

    var GoogleMapWidget,
        WIDGET_CLASS = 'google-map';

    GoogleMapWidget = function (logger, container) {
        this._logger = logger.fork('Widget');

        this._el = container;
        this.map = null;
        this.mapEl = null;
        this.nodes = {};
        this._initialize();

        this._logger.debug('ctor finished');
    };

    GoogleMapWidget.prototype._initialize = function () {
        var width = this._el.width(),
            height = this._el.height(),
            self = this;

        // set widget class
        this._el.addClass(WIDGET_CLASS);

        // Add the map element
        this.mapEl = $('<div id="map"/>');
        this.mapEl.height(height);
        this.mapEl.width(width);
        this._el.append(this.mapEl);

        // Load the map API from google
        $.getScript('https://www.google.com/jsapi', function () {
            google.load('maps', '3', {
                other_params: 'sensor=false', callback: function () {
                    self.onMapLoaded();
                }
            });
        });

        // Registering to events can be done with jQuery (as normal)
        this._el.on('dblclick', function (event) {
            event.stopPropagation();
            event.preventDefault();
            self.onBackgroundDblClick();
        });
    };

    GoogleMapWidget.prototype.onMapLoaded = function () {
        // At this point google is available as a global variable
        var self = this,
            mapOptions = {
                center: new google.maps.LatLng(51.508742, -0.120850),
                zoom: 7,
                disableDefaultUI: true
            };

        this.map = new google.maps.Map(this.mapEl.get(0), mapOptions);

        this.map.addListener('click', function (event, asf) {
            // Add a google marker
            var marker = new google.maps.Marker({
                position: event.latLng,
                map: self.map
            });
        });
    };

    GoogleMapWidget.prototype.onWidgetContainerResize = function (width, height) {
        this.mapEl.height(height);
        this.mapEl.width(width);
    };

    // Adding/Removing/Updating items
    GoogleMapWidget.prototype.addNode = function (desc) {
        if (desc) {
            // Add node to a table of nodes
            var node = document.createElement('div'),
                label = 'children';

            if (desc.childrenIds.length === 1) {
                label = 'child';
            }

            this.nodes[desc.id] = desc;
            node.innerHTML = 'Adding node "' + desc.name + '" (click to view). It has ' + 
                desc.childrenIds.length + ' ' + label + '.';

            this._el.append(node);
            node.onclick = this.onNodeClick.bind(this, desc.id);
        }
    };

    GoogleMapWidget.prototype.removeNode = function (gmeId) {
        var desc = this.nodes[gmeId];
        this._el.append('<div>Removing node "' + desc.name + '"</div>');
        delete this.nodes[gmeId];
    };

    GoogleMapWidget.prototype.updateNode = function (desc) {
        if (desc) {
            this._logger.debug('Updating node:', desc);
            this._el.append('<div>Updating node "' + desc.name + '"</div>');
        }
    };

    /* * * * * * * * Visualizer event handlers * * * * * * * */

    GoogleMapWidget.prototype.onNodeClick = function (/*id*/) {
        // This currently changes the active node to the given id and
        // this is overridden in the controller.
    };

    GoogleMapWidget.prototype.onBackgroundDblClick = function () {
        this._el.append('<div>Background was double-clicked!!</div>');
    };

    /* * * * * * * * Visualizer life cycle callbacks * * * * * * * */
    GoogleMapWidget.prototype.destroy = function () {
    };

    GoogleMapWidget.prototype.onActivate = function () {
        this._logger.debug('GoogleMapWidget has been activated');
    };

    GoogleMapWidget.prototype.onDeactivate = function () {
        this._logger.debug('GoogleMapWidget has been deactivated');
    };

    return GoogleMapWidget;
});
