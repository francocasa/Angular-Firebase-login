import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private API_KEY = ''; //ACA SE PONE EL API KEY DE LA CUENTA DE FIREBASE

  userToken: string;

  constructor(private httpClient:HttpClient) { 
    this.leerToken();
  }

  logout()
  {
    localStorage.removeItem('token');
  }

  login( usuarioModel:UsuarioModel)
  {
    const authData =
    {
      email: usuarioModel.email,
      password: usuarioModel.password,
      returnSecureToken:true
    };


    return this.httpClient.post(
      `${this.URL}signInWithPassword?key=${this.API_KEY}`,
      authData
    ).pipe(
      map(respuesta => {
        this.guardarToken(respuesta['idToken']);
        return respuesta;
      })
    );

  }

  nuevoUsuario( usuarioModel:UsuarioModel)
  {
    const authData =
    {
      email: usuarioModel.email,
      password: usuarioModel.password,
      returnSecureToken:true
    };


    return this.httpClient.post(
      `${this.URL}signUp?key=${this.API_KEY}`,
      authData
    ).pipe(
      map(respuesta => {
        console.log('entro en el map')
        this.guardarToken(respuesta['idToken']);
        return respuesta;
      })
    );

  }


  private guardarToken(idToken:string)
  {
    this.userToken = idToken;
    localStorage.setItem('token', idToken)
  }

  leerToken()
  {
    if (localStorage.getItem('token'))
    {
      this.userToken = localStorage.getItem('token');
    }
    else
    {
      this.userToken = '';
    }

    return this.userToken;
  }

  isAuthenticated()
  {
    if(localStorage.getItem('token') !=null)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

}
