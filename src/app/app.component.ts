import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  template: `
    <p-toast></p-toast>
    <main class="main-size">
      <div id="container" class="w-full h-full max-w-[1980px]">
        <router-outlet/>
      </div>
    </main>
  `,
})
export class AppComponent {}
