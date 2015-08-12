declare module "leaflet-src.js" {
	declare class LeafletMap {
		setView(): any;
		fitBounds(bounds: any, options: any): any;
		getBounds(): any;
	}

	declare class LeafletLayer {
		addPoint(point: Array<number>): void;
		bounds20: any;
	}
}
