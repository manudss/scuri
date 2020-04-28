import {ReadClass} from '../../src/spec/read/read';


describe('ReadClass', () => {
    it('when process a method with set a property', () => {

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
        const classDef = read.process();
        // assert
        expect(classDef.length).toEqual(1);
        expect(classDef[0].name).toEqual('ExampleComponent');
        expect(classDef[0].methods.length).toEqual(1);
        expect(classDef[0].methods[0].name).toEqual('anotherMethod');
        const indirectOutput = classDef[0].methods[0].indirectOutput ? classDef[0].methods[0].indirectOutput : [];
        expect(indirectOutput.length).toEqual(2);
        expect(indirectOutput[0].name).toEqual('publicProperty');
        expect(indirectOutput[0].fullText).toEqual('this.publicProperty = true');
        expect(indirectOutput[0].type).toEqual('boolean');
        expect(indirectOutput[1].name).toEqual('privateProperty');
        expect(indirectOutput[1].fullText).toEqual('this.privateProperty = param1');
        expect(indirectOutput[1].type).toEqual('string');

        expect(computeMethodBody).toHaveBeenCalled();
        expect(computeExpressionStatement).toHaveBeenCalledTimes(2);
    });


});

