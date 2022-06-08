import { EspecialidadesService } from './services/especialidades.service';
import { Especialidad } from './models/especialidad.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Cliente REST API Especialidades';
  especialidades: Especialidad[] = [];
  espFilter: Especialidad[] = [];
  especialidad?: Especialidad;
  form: FormGroup;
  formUpdate: FormGroup;
  especialidadUpdate?: Especialidad;

  constructor(
    private especialidadService: EspecialidadesService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      especialidad: ['', [ Validators.required ]],
      descripcion: ['', [ Validators.required ]],
      imagen: ['', [ Validators.required ]]
    });
    this.formUpdate = this.fb.group({
      especialidadUp: ['', [ Validators.required ]],
      descripcionUp: ['', [ Validators.required ]],
      imagenUp: ['', [ Validators.required ]]
    });
  }

  ngOnInit(): void {
    this.cargarData();
  }

  cargarData(): void {
    this.especialidadService.getEspecialidades().subscribe({
      next: (res: any) => {
        this.especialidades = res.especialidades;
        this.espFilter = res.especialidades;
      },
      error: (err) => console.log(err)
    });
  }

  search(e: any): void {
    const val = e.target.value;
    if(val.length > 0) {
      this.espFilter = this.especialidades.filter(esp => esp.especialidad.toLowerCase().startsWith(val.toLowerCase().trim()));
    }else this.espFilter = this.especialidades;
  }

  get imagenValue() {
    return this.form.get('imagen')?.value;
  }

  get imagenValueUp() {
    return this.formUpdate.get('imagenUp')?.value;
  }

  verDetalles(data: Especialidad): void {
    this.especialidad = data;
  }

  actualizarEspecialidad(data: Especialidad): void {
    this.especialidadUpdate = data;
    this.formUpdate.patchValue({
      especialidadUp: data.especialidad,
      descripcionUp: data.descripcion,
      imagenUp: data.imagen
    });
  }

  eliminarEspecialidad(data: Especialidad): void {
    Swal.fire({
      title: `¿Estás seguro de eliminar la especialidad de ${data.especialidad}?`,
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then((res) => {
      if(res.isConfirmed) {
        this.especialidadService.deleteEspecialidad(data._id!)
          .subscribe({
            next: (res: any) => {
              this.cargarData();
              Swal.fire({
                title: 'Operación exitosa',
                text: res.message,
                icon: 'success'
              })
            },
            error: (err: any) => console.log(err)
          });
      }
    });
  }

  onSubmit(): void {
    const data = this.form.value;
    this.especialidadService.createEspecialidad(data).subscribe({
      next: (res: any) => {
        const btnClose = document.querySelector("#btnCloseCreate") as HTMLButtonElement;
        btnClose.click();
        Swal.fire({
          title: 'Operación exitosa',
          text: res.message,
          icon: 'success'
        }).then(() => {
          this.cargarData();
          this.form.reset();
        });
      },
      error: (err: any) => console.log(err)
    });
  }

  onSubmitUpdate(): void {
    const { especialidadUp, descripcionUp, imagenUp } = this.formUpdate.value;
    const data = {
      especialidad: especialidadUp,
      descripcion: descripcionUp,
      imagen: imagenUp
    };
    this.especialidadService.updateEspecialidad(this.especialidadUpdate?._id!, data).subscribe({
      next: (res: any) => {
        const btnClose = document.querySelector("#btnCloseUpdate") as HTMLButtonElement;
        btnClose.click();
        Swal.fire({
          title: 'Operación exitosa',
          text: res.message,
          icon: 'success'
        }).then(() => {
          this.cargarData();
          this.formUpdate.reset();
        });
      },
      error: (err: any) => console.log(err)
    });
  }

}
