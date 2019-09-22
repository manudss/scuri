import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../../src/collection.json');

describe('Calling update on existing spec with the TestBed.configureTestingModule', () => {
    let tree = Tree.empty();
    beforeEach(() => {
        tree = Tree.empty();

        tree.create(
            'c.ts',
            `import { LogService, BDep } from '@angular/core';

        export class C  {
            constructor(
                private bDep: bDep,
                private logger: LogService
            ) {}
        `
        );

        tree.create(
            'c.spec.ts',
            `
import { bDep } from '@angular/core';
beforeEach(async(() => {
    // does this appear
    TestBed
    // somewhere
    .configureCompiler()
    .configureTestingModule({
        declarations: [AppComponent],
        providers: [{ provide: 'someValue', useValue: 'other value' }]
    }).compileComponents();
}));
describe('C', () => {
});

function setup() {
    const bDep = autoSpy(bDep);
    const logger = autoSpy(LogService);
    const builder = {
        bDep,
        logger,
        default() {
            return builder;
        },
        build() {
            return new C(bDep, logger);
        }
    }
    return builder;
}
        `
        );
    });

    fit('should add a the setup call', () => {
        // arrange
        const runner = new SchematicTestRunner('schematics', collectionPath);
        // act

        const result = runner.runSchematic('spec', { name: './c.ts', update: true }, tree);
        const contents = result.readContent('c.spec.ts');
        // assert
        expect(contents).toContain('C(bDep, logger)'); // used to add a comma like so -> C(bDep, logger, )
    });
});
