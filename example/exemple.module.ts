import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {ExampleComponent} from "./example.component";
import { Service } from './angular-6-app-jest/src/app/service';

@NgModule({
    declarations: [ExampleComponent],
    imports: [BrowserModule],
    providers: [Service],
    bootstrap: []
})
export class ExempleModule {}
