import { ReadClass } from '../../src/spec/read/read';


describe('ReadClass', () => {
    it('when empty class should be a minimal object', () => {

        // arrange
        let fileName = 'file1.ts';

        let fileContents = `
      export class ExampleComponent {       
    
        //a constructor comment
        constructor() {}    
      }
      `;
        const read = new ReadClass(fileName, fileContents);
        // Spy





      // act
        const classDef = read.process(); //?
        expect(classDef.length).toEqual(1);
        const firstClass = classDef[0];
        // assert
        expect(firstClass.constructorParams).toEqual([]);
        expect(firstClass.methods).toEqual([]);
        expect(firstClass.name).toEqual('ExampleComponent');
        expect(firstClass.properties).toEqual({  });
        expect(firstClass.publicMethods).toEqual([]);
    });

    it('when process a method with only indirect output', () => {

        // arrange
        let fileName = 'file1.ts';

        let fileContents = `
      export class ExampleComponent {
        publicProperty: boolean;
        
        private privateProperty: string;
    
        //a constructor comment
        constructor() {}
    
        // a comment
        anotherMethod(param1 : string, parame2: Object, param3: any) {
            this.publicProperty = true;
            this.privateProperty = param1;
        }
      }
      `;
        const read = new ReadClass(fileName, fileContents);
        // Spy
       const computeMethodBody = spyOn<any>(read, 'computeMethodBody');
       const computeExpressionStatement = spyOn<any>(read, 'computeExpressionStatement');
        computeMethodBody.and.callThrough();
        computeExpressionStatement.and.callThrough();




      // act
        const classDef = read.process(); //?
        // assert
        expect(classDef.length).toEqual(1);
        const firstClass = classDef[0];

        expect(firstClass.constructorParams).toEqual([]);
        expect(firstClass.methods).toEqual([{
            hasReturn: false,
            statements: [{
                statementName: 'default',
                indirectOutput: [
                    {
                        fullText: 'this.publicProperty = true',
                        name: 'publicProperty',
                        modifier: 'public',
                        type: 'boolean'
                    },
                    {
                        fullText: 'this.privateProperty = param1',
                        name: 'privateProperty',
                        modifier: 'private',
                        type: 'string'
                    }
                ]
            }],
            isPublic: true,
            name: 'anotherMethod',
            params: [
                { defaultValue: "''", name: 'param1', type: 'string' },
                { defaultValue: '{}', name: 'parame2', type: 'Object' },
                { defaultValue: 'null', name: 'param3', type: 'any' }
            ],
            parentClass: 'ExampleComponent',
            returnType: '',
            modifier: 'public'
        }]);
        expect(firstClass.name).toEqual('ExampleComponent');
        expect(firstClass.properties).toEqual({
            privateProperty: {
                isPublic: false,
                modifier: 'private',
                name: 'privateProperty',
                parentClass: 'ExampleComponent',
                type: 'string'
            },
            publicProperty: {
                isPublic: true,
                modifier: 'public',
                name: 'publicProperty',
                parentClass: 'ExampleComponent',
                type: 'boolean'
            }
        });
        expect(firstClass.publicMethods).toEqual(['anotherMethod']);
        expect(computeMethodBody).toHaveBeenCalled();
        expect(computeExpressionStatement).toHaveBeenCalledTimes(2);
    });


    it('when process a method with if statement', () => {

        // arrange
        let fileName = 'file1.ts';

        let fileContents = `
      export class ExampleComponent {
        publicProperty: boolean;
        
        private privateProperty: string;
    
        //a constructor comment
        constructor() {}
    
        // a comment
        anotherMethod(param1 : string, parame2: Object, param3: any) {
           if (param1 == 'test') {
               this.publicProperty = true;
               this.privateProperty = param1;
           }
        }
      }
      `;
        const read = new ReadClass(fileName, fileContents);
        // Spy
       const computeMethodBody = spyOn<any>(read, 'computeMethodBody');
       const computeExpressionStatement = spyOn<any>(read, 'computeExpressionStatement');
        computeMethodBody.and.callThrough();
        computeExpressionStatement.and.callThrough();

      // act
        const classDef = read.process(); //?
        // assert
        expect(classDef.length).toEqual(1);
        const firstClass = classDef[0];

        expect(firstClass.constructorParams).toEqual([]);
        /**
         * , {
                statementName: 'if',
                indirectOutput: [
                    {
                        fullText: 'this.publicProperty = true',
                        name: 'publicProperty',
                        modifier: 'public',
                        type: 'boolean'
                    },
                    {
                        fullText: 'this.privateProperty = param1',
                        name: 'privateProperty',
                        modifier: 'private',
                        type: 'string'
                    }
                ]
            }
         */
        expect(firstClass.methods).toEqual([{
            hasReturn: false,
            statements: [{
                statementName: 'default'
            }],
            isPublic: true,
            name: 'anotherMethod',
            params: [
                { defaultValue: "''", name: 'param1', type: 'string' },
                { defaultValue: '{}', name: 'parame2', type: 'Object' },
                { defaultValue: 'null', name: 'param3', type: 'any' }
            ],
            parentClass: 'ExampleComponent',
            returnType: '',
            modifier: 'public'
        }]);
        expect(firstClass.name).toEqual('ExampleComponent');
        expect(firstClass.properties).toEqual({
            privateProperty: {
                isPublic: false,
                modifier: 'private',
                name: 'privateProperty',
                parentClass: 'ExampleComponent',
                type: 'string'
            },
            publicProperty: {
                isPublic: true,
                modifier: 'public',
                name: 'publicProperty',
                parentClass: 'ExampleComponent',
                type: 'boolean'
            }
        });
        expect(firstClass.publicMethods).toEqual(['anotherMethod']);
    });

    it('when process a constructor with parameters', () => {

        // arrange
        let fileName = 'file1.ts';

        let fileContents = `
        import { MyService } from '../myservice';
        import { OtherService } from '../otherservice';
        
      export class ExampleComponent {       
    
        //a constructor comment
        constructor(private service1: MyService, public service: OtherService, url: string) {}
    
      }
      `;
        const read = new ReadClass(fileName, fileContents);
        // Spy
       const computeMethodBody = spyOn<any>(read, 'computeMethodBody');
       const computeExpressionStatement = spyOn<any>(read, 'computeExpressionStatement');
        computeMethodBody.and.callThrough();
        computeExpressionStatement.and.callThrough();

      // act
        const classDef = read.process();
        // assert
        expect(classDef.length).toEqual(1);
        const firstClass = classDef[0];

        expect(firstClass.constructorParams).toEqual([
            {
                importPath: '../myservice',
                isPublic: false,
                modifier: 'private',
                name: 'service1',
                type: 'MyService'
            },
            {
                importPath: '../otherservice',
                isPublic: true,
                modifier: 'public',
                name: 'service',
                type: 'OtherService'
            },
            {
                isPublic: false,
                modifier: 'none',
                name: 'url',
                type: 'string'
            }
        ]);
        expect(firstClass.methods).toEqual([]);
        expect(firstClass.name).toEqual('ExampleComponent');
        expect(firstClass.properties).toEqual({ service:
                { isPublic: true,
                    modifier: 'public',
                    name: 'service',
                    type: 'OtherService' },
            service1:
                { isPublic: false,
                    modifier: 'private',
                    name: 'service1',
                    type: 'MyService' } });
        expect(firstClass.publicMethods).toEqual([]);
    });


    it('when process a method with parameters', () => {

        // arrange
        let fileName = 'file1.ts';

        let fileContents = `
        import { MyService } from '../myservice';
        import { OtherService } from '../otherservice';
        
      export class ExampleComponent {       
    
        //a constructor comment
        constructor(private service1: MyService, public service: OtherService, url: string) {}
    
      }
      `;
        const read = new ReadClass(fileName, fileContents);
        // Spy
       const computeMethodBody = spyOn<any>(read, 'computeMethodBody');
       const computeExpressionStatement = spyOn<any>(read, 'computeExpressionStatement');
        computeMethodBody.and.callThrough();
        computeExpressionStatement.and.callThrough();

      // act
        const classDef = read.process();
        // assert
        expect(classDef.length).toEqual(1);
        const firstClass = classDef[0];

        expect(firstClass.constructorParams).toEqual([
            {
                importPath: '../myservice',
                isPublic: false,
                modifier: 'private',
                name: 'service1',
                type: 'MyService'
            },
            {
                importPath: '../otherservice',
                isPublic: true,
                modifier: 'public',
                name: 'service',
                type: 'OtherService'
            },
            {
                isPublic: false,
                modifier: 'none',
                name: 'url',
                type: 'string'
            }
        ]);
        expect(firstClass.methods).toEqual([]);
        expect(firstClass.name).toEqual('ExampleComponent');
        expect(firstClass.properties).toEqual({ service:
                { isPublic: true,
                    modifier: 'public',
                    name: 'service',
                    type: 'OtherService' },
            service1:
                { isPublic: false,
                    modifier: 'private',
                    name: 'service1',
                    type: 'MyService' } });
        expect(firstClass.publicMethods).toEqual([]);
    });



});

