import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../../src/collection.json');

describe('spec', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = Tree.empty();
    });

    it('creates one file - auto-spy.ts', () => {
        const runner = new SchematicTestRunner('schematics', collectionPath);
        const res = runner.runSchematic('autospy', {}, tree);
        expect(res.files.length).toBe(1);
        expect(res.files[0]).toEqual('/auto-spy.ts');
    });

    it('creates jasmine-style auto-spy by default', () => {
        const runner = new SchematicTestRunner('schematics', collectionPath);
        const res = runner.runSchematic('autospy', {}, tree);
        const generatedContent = res.readContent('/auto-spy.ts');
        expect(generatedContent).toMatch('jasmine.Spy');
        expect(generatedContent).not.toMatch('jest.fn');
        expect(generatedContent).toMatch('export function autoSpy');
    });

    it('creates jasmine-style auto-spy when user opted for jasmine', () => {
        const runner = new SchematicTestRunner('schematics', collectionPath);
        const res = runner.runSchematic('autospy', { for: 'jasmine' }, tree);
        const generatedContent = res.readContent('/auto-spy.ts');
        expect(generatedContent).toMatch('jasmine.Spy');
        expect(generatedContent).not.toMatch('jest.fn');
        expect(generatedContent).toMatch('export function autoSpy');
    });

    it('creates jest-style auto-spy when user opted for jest', () => {
        const runner = new SchematicTestRunner('schematics', collectionPath);
        const res = runner.runSchematic('autospy', { for: 'jest' }, tree);
        const generatedContent = res.readContent('/auto-spy.ts');
        expect(generatedContent).toMatch('jest.fn');
        expect(generatedContent).toMatch('export function autoSpy');
        expect(generatedContent).not.toMatch('jasmine.Spy');
    });
});