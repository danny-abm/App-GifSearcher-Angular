import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { SearchGifsResponse, Gif } from '../interface/gif.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _historial: string[] =[];
  private apiKey: string="bXMQojk5c2DRaHKJyIcSv05Xh9b5sHpM";
  private serviciosUrl: string="https://api.giphy.com/v1/gifs"
  public resultados: Gif[]=[];
  

  get historial(){
    return [...this._historial];
  }
 
  constructor (private http:HttpClient){

    this._historial=JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados=JSON.parse(localStorage.getItem('finalResult')!) || [];
    //if(localStorage.getItem('historial')){
      //asigna a el historial el historial guaradado en local storage, el ! es para que el codigo confie de que historial lleva algo
     // this._historial=JSON.parse(localStorage.getItem('historial')!);
   // }
  }

  buscarGifs(query:string){
    //que todo ingrese en MINUSCULA
    query=query.trim().toLocaleLowerCase();

    //validacion: si query no se repetido encuantra dentro del arreglo, se ingresa
    if(!this._historial.includes(query)){
      this._historial.unshift(query);
    }
    //luego se corta el array a 10 posiciones
    this._historial=this._historial.splice(0,10);
    //console.log(this._historial);
    //para que no se borre el historial
    localStorage.setItem('historial',JSON.stringify(this._historial));

    const params = new HttpParams()
    .set('api_key',this.apiKey)
    .set('limit','10')
    .set('q',query);

    this.http.get<SearchGifsResponse>(`${this.serviciosUrl}/search?`,{params})
      .subscribe((resp: SearchGifsResponse) =>{
        console.log(resp.data);
        this.resultados=resp.data;
        //para que no se borre el ultimo resultado
        localStorage.setItem('finalResult',JSON.stringify(this.resultados));
        
      });
  }

 
}
