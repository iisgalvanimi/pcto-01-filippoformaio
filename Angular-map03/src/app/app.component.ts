import { Component, OnInit } from '@angular/core';
import { GEOJSON, GeoFeatureCollection } from './models/geojson.model';
import {Marker } from './models/marker.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ci_vettore } from './models/ci_vettore.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'ang-maps';
  // google maps zoom level
  zoom: number = 12;
  geoJsonObject: GeoFeatureCollection; //Oggetto che conterrà il vettore di GeoJson
  fillColor: string = "#FF0000";  //Colore delle zone catastali
  obsGeoData: Observable<GeoFeatureCollection>;
  lng: number = 9.205331366401035;
  lat: number = 45.45227445505016;
  obsCiVett : Observable<Ci_vettore[]>; //Crea un observable per ricevere i vettori energetici
  markers : Marker[] //Marker va importato
  constructor(public http: HttpClient) {
  }

  prepareData = (data: GeoFeatureCollection) => {
    this.geoJsonObject = data
    console.log(this.geoJsonObject)
  }

  ngOnInit() {
    // Crea un Observable ed Effettua la Subscribe
    this.obsGeoData = this.http.get<GeoFeatureCollection>("https://3000-d8972400-005a-4bf6-8858-170d2411810f.ws-eu01.gitpod.io:3000/"); //tuourl
    this.obsGeoData.subscribe(this.prepareData);

    //Effettua la chiamatata al server per ottenere l’elenco dei vettori energetici
    this.obsCiVett = this.http.get<Ci_vettore[]>("https://3000-d8972400-005a-4bf6-8858-170d2411810f.ws-eu01.gitpod.io/ci_vettore/90");
    //this.obsCiVett = this.http.get<Ci_vettore[]>("http://127.0.0.1:3000/ci_vettore/90");
    this.obsCiVett.subscribe(this.prepareCiVettData);
  }
  styleFunc = (feature) => {
    return ({
      clickable: false,
      fillColor: this.fillColor,
      strokeWeight: 1
    });
  }

  //Metodo che riceve i dati e li aggiunge ai marker
  prepareCiVettData = (data: Ci_vettore[]) =>
  {
    console.log(data); //Verifica di ricevere i vettori energetici
    this.markers = []; //NB: markers va dichiarata tra le proprietà markers : Marker[]
    for (const iterator of data) { //Per ogni oggetto del vettore crea un Marker
     let m = new Marker(iterator.WGS84_X,iterator.WGS84_Y,iterator.CI_VETTORE);
      this.markers.push(m);
    }
 }
}

