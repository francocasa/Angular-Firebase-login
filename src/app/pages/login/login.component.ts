import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuarioModel:UsuarioModel = new UsuarioModel;
  recordarUsuario: boolean =  false;
  
  constructor(private authService:AuthService, private router:Router) { }


  ngOnInit() {
    
    if(localStorage.getItem('token') != null)
    {
      this.router.navigateByUrl("/home");
    }

    if(localStorage.getItem('email'))
    {
      this.usuarioModel.email = localStorage.getItem('email');
      this.recordarUsuario = true;
    }
    
  }


  onSubmit(loginForm:NgForm)
  {
    if(loginForm.invalid){return;}

    Swal.fire({
        allowOutsideClick: false,
        type: 'info',
        icon:'info',
        text:'espere por favor'
      });
    Swal.showLoading();


    this.authService.login(this.usuarioModel)
    .subscribe(
      respuesta => 
        {
          Swal.close();
          if(this.recordarUsuario)
          {
            localStorage.setItem('email', this.usuarioModel.email);
          }
          this.router.navigateByUrl('/home');
        },
      (err) => 
        {
          let mensajeError = "";
          if(err.error.error.message == "INVALID_PASSWORD")
          {
            mensajeError = "Password invalido";
          }
          else if (err.error.error.message == "EMAIL_NOT_FOUND")
          {
            mensajeError = "Email no encontrado";
          }
          Swal.fire({
            icon: 'error',
            title: mensajeError
          })
        }
     );
  }
}
