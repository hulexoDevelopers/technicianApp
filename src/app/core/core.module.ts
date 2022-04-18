import { NgModule } from "@angular/core";
import { ApiService } from './services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const appModules = [
    FormsModule, ReactiveFormsModule
]

@NgModule({
    imports: [
        appModules],
    exports: [
        appModules],
    providers: [ApiService]
})
export class CoreModule { }
