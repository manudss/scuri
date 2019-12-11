import {Service} from "./angular-6-app-jest/src/app/service";

import { Component } from '@angular/core';

@Component({
    selector: 'exemple'
})
export class ExampleComponent {
    publicProperty: boolean;

    private privateProperty: string;

    aMethod(dep: string, service: Object): Object {
        return service;
    }

    //a constructor comment
    constructor(/** shows in full text and is hidden in text */mep: string, private service1: Service) {}

    // a comment
    async anotherMethod(param1 : string, parame2: Object, param3: any) {

        this.publicProperty = true;
        this.privateProperty = param1;
    }
    private third() {
        this.service1.method()
    }
    public fourth(): string {
        return 'hello'
    }
  }
