import { Router } from '@angular/core';
import { MyComComponent } from './my-com.component';
import { autoSpy } from 'autoSpy';

describe('MyComComponent', () => {
    it('when ngOnInit is called it should', () => {
        // arrange
        const { build } = setup().default();
        const c = build();
        // act
        c.ngOnInit();
        // assert
        // expect(c).toEqual
    });
});

function setup() {
    const router = autoSpy(Router);
    const builder = {
        router,
        default() {
            return builder;
        },
        build() {
            return new MyComComponent(router);
        }
    };

    return builder;
}
