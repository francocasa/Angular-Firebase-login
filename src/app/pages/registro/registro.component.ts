import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuarioModel:UsuarioModel;

  constructor( private authService:AuthService, private router:Router) { }

  ngOnInit() { 
    if(localStorage.getItem('token') != null)
    {
      this.router.navigateByUrl("/home");
    }
    this.usuarioModel = new UsuarioModel();
  }

  onSubmit(registroForm:NgForm)
  {
    if(registroForm.invalid){return;}

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      icon:'info',
      text:'espere por favor'
    });
    Swal.showLoading();

    this.authService.nuevoUsuario(this.usuarioModel)
    .subscribe(
      respuesta => 
      {
        Swal.close();
        this.router.navigateByUrl('/login');
      },
      (err) => 
      {
        let mensajeError = "";
        if(err.error.error.message == "EMAIL_EXISTS")
          {
            mensajeError = "El email ya existe";
            Swal.fire({
              icon: 'error',
              title: mensajeError
            })
          }
      }
     );
  }

}
