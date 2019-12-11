import * as ts from '../../../lib/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import {tokenToString} from '../../../lib/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import {ClassDescription, ConstructorParam, methodeType, methodParams} from './read-class.model';

/*let program;
let this.typeChecker: ts.TypeChecker;*/


/**
 * Will read the Abstract Syntax Tree of the `fileContents` and extract from that:
 *  * the names and types of all constructors' parameters
 *  * the names of all public method
 *  * the path to the dependencies
 * @example
 * class Test {
 *  constructor(service: MyService, param: string) { }
 *
 *  async future() {}
 *  now() {}
 * }
 * // result would be
 * {
 *  name: 'Test',
 *  constructorParams: [{name: 'service', type:'MyService', importPath:'../../my.service.ts'}, {name: 'param', type:'string', importPath: '-----no-import-path----'}],
 *  publicMethods: ['future', 'now']
 * }
 * @param fileName the name of the file (required by ts API)
 * @param fileContents contents of the file
 */
export class ReadClass {
    private sourceFile: ts.SourceFile;
    private program: ts.Program;
    private typeChecker: ts.TypeChecker;


    constructor(
        private fileName: string,
        private fileContents: string
    ){
        this.sourceFile = ts.createSourceFile(this.fileName, fileContents, ts.ScriptTarget.ES2015, true);
        // Build a program using the set of root file names in fileNames
        this.program = ts.createProgram([this.fileName],{});

        // Get the checker, we will use it to find more about classes
        this.typeChecker = this.program.getTypeChecker();
    }
    
    public process(): ClassDescription[]  {
        const res = this.read(this.sourceFile);
        const enrichedRes = res.map(r => ({
            ...r,
            constructorParams: this.addImportPaths(r.constructorParams, this.fileContents)
        }));
        return enrichedRes;
    }


    private read(node: ts.Node) {
        let result: ClassDescription[] = [];
        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            const classDeclaration = node as ts.ClassDeclaration;
            const className = classDeclaration.name != null ? classDeclaration.name.getText() : 'default';
            const methods = this.readPublicMethods(node as ts.ClassDeclaration, className);
            result = [
                {
                    name: className,
                    constructorParams: this.readConstructorParams(node as ts.ClassDeclaration),
                    publicMethods: methods.map<string>(m => m.name),
                    methods: methods
                }
            ];
            // console.log ('result : ', result);
        }

        ts.forEachChild(node, n => {
            const r = this.read(n);
            if (r && r.length > 0) {
                result = result.concat(r);
            }
        });



        return result;
    }

    private readConstructorParams(node: ts.ClassDeclaration): ConstructorParam[] {
        let params: ConstructorParam[] = [];

        ts.forEachChild(node, node => {
            if (node.kind === ts.SyntaxKind.Constructor) {
                const constructor = node as ts.ConstructorDeclaration;

                params = constructor.parameters.map(p => ({
                    name: p.name.getText(),
                    type: (p.type && p.type.getText()) || 'any' // the type of constructor param or any if not passe
                }));
            }
        });
        return params;
    }

    private readPublicMethods(node: ts.ClassDeclaration, className: string): methodeType[] {
        let publicMethods: methodeType[] = [];

        ts.forEachChild(node, node => {
            if (node.kind === ts.SyntaxKind.MethodDeclaration) {
                const method = node as ts.MethodDeclaration;

                const func = this.constructMethodType(method, className);

                if (this.methodIsPublic(method)) {
                    publicMethods.push(func);
                }
            }
        });
        return publicMethods;
    }

    private constructMethodType(methodNode: ts.MethodDeclaration, className: string): methodeType {

        let method: methodeType = {name: methodNode.name.getText(), parentClass: className};

        method.params = methodNode.parameters.map<methodParams>(this.constructMethodParams);
        const flags: ts.ModifierFlags = ts.getCombinedModifierFlags(methodNode);

        method = this.computeReturnType(method, methodNode);
        method = this.computeMethodBody(method, methodNode);


        // check if the private flag is part of this binary flag - if not means the method is public
        if ((flags & ts.ModifierFlags.Private) === ts.ModifierFlags.Private) {
            method.isPublic = false;
            method.type = 'private';
        } else if ((flags & ts.ModifierFlags.Protected) === ts.ModifierFlags.Protected) {
            method.isPublic = false;
            method.type = 'protected';
        } else {
            method.isPublic = true;
            method.type = 'public';
        }

        // console.log('methodType :', method);


        return method;
    }

    private constructMethodParams(p: ts.ParameterDeclaration): methodParams {
        let defaultValue: string;
        const type: string = (p.type && p.type.getText()) || 'any';

        switch(type) {
            case 'string':
                defaultValue = "''";
                break;

            case 'number':
                defaultValue = '0';
                break;

            case 'boolean':
                defaultValue = 'false';
                break;

            case 'any':
                defaultValue = 'null';
                break;

            default:
                defaultValue = '{}';
        }


        return {
            name: p.name.getText(),
            defaultValue,
            type  // the type of constructor param or any if not passe
        };
    }

    private computeMethodBody(method: methodeType, methodNode: ts.MethodDeclaration) {

        if (methodNode && methodNode.body && methodNode.body.statements) {
            methodNode.body.statements.every((statement, index) => {
                console.log(`Statement (${index}) :`, statement.kind, tokenToString(statement.kind), statement.getFullText());



                switch (statement.kind) {
                    case ts.SyntaxKind.EmptyStatement:
                        console.log('Statement : EmptyStatement');
                        break;
                    case ts.SyntaxKind.ExpressionStatement:
                        console.log('Statement : ExpressionStatement');
                        this.computeExpressionStatement(method, (statement as ts.ExpressionStatement).expression);
                        break;
                    case ts.SyntaxKind.IfStatement:
                        console.log('Statement : IfStatement');
                        break;
                    case ts.SyntaxKind.DoStatement:
                        console.log('Statement : DoStatement');
                        break;
                    case ts.SyntaxKind.WhileStatement:
                        console.log('Statement : WhileStatement');
                        break;
                    case ts.SyntaxKind.ForStatement:
                        console.log('Statement : ForStatement');
                        break;
                    case ts.SyntaxKind.ForInStatement:
                        console.log('Statement : ForInStatement');
                        break;
                    case ts.SyntaxKind.ForOfStatement:
                        console.log('Statement : ForOfStatement');
                        break;
                    case ts.SyntaxKind.ContinueStatement:
                        console.log('Statement : ContinueStatement');
                        break;
                    case ts.SyntaxKind.BreakStatement:
                        console.log('Statement : BreakStatement');
                        break;
                    case ts.SyntaxKind.ReturnStatement:
                        console.log('Statement : ReturnStatement');
                        break;
                    case ts.SyntaxKind.WithStatement:
                        console.log('Statement : WithStatement');
                        break;
                    case ts.SyntaxKind.SwitchStatement:
                        console.log('Statement : SwitchStatement');
                        break;
                    case ts.SyntaxKind.LabeledStatement:
                        console.log('Statement : LabeledStatement');
                        break;
                    case ts.SyntaxKind.ThrowStatement:
                        console.log('Statement : ThrowStatement');
                        break;
                    case ts.SyntaxKind.TryStatement:
                        console.log('Statement : TryStatement');
                        break;

                }
                return true;
            });
        }


        return method;
    }

    private computeExpressionStatement(method: methodeType, expression: ts.Expression) {

        console.log('Expression Statement : ', expression.getText());
        if (expression.kind === ts.SyntaxKind.BinaryExpression)  {
            const binaryExpression: ts.BinaryExpression = (expression as ts.BinaryExpression);

            if (binaryExpression.left && binaryExpression.left.kind === ts.SyntaxKind.PropertyAccessExpression) {
                if (!method.indirectOutput) method.indirectOutput = [];
                // @ts-ignore
                const name = (binaryExpression.left.name)? binaryExpression.left.name.getText() : binaryExpression.left.getLastToken().getText();

                method.indirectOutput.push({
                    name: name,
                    expectStatement: `expect(component.${name}).toEqual(null /** todo **/); // Test indirect output : ${expression.getText()}`,
                    fullText: expression.getText()
                });
                // @ts-ignore
                console.log('Left Expression : ', binaryExpression.left.getText(), binaryExpression.left.getLastToken().getText(), binaryExpression.left.getFirstToken().getText(),  name)
            }
        }


        return method;

    }

    private computeReturnType(method: methodeType, methodNode: ts.MethodDeclaration) {
        // @ts-ignore
        if (this.typeChecker) {
            try {
                const signature: ts.Signature | undefined = this.typeChecker.getSignatureFromDeclaration(methodNode);
                let returnType = null;
                if (signature) {
                    returnType = this.typeChecker.getReturnTypeOfSignature(signature);

                    switch (returnType.getFlags()) {
                        case ts.TypeFlags.Any:
                        case ts.TypeFlags.Unknown:
                            method.returnType = 'any';
                            method.hasReturn = true;
                            break;
                        case ts.TypeFlags.Void:
                        case ts.TypeFlags.VoidLike:
                        case ts.TypeFlags.Never:
                            method.returnType = 'void';
                            method.hasReturn = false;
                            break;

                        default:
                            method.returnType = this.typeChecker.typeToString(returnType);
                            method.hasReturn = true;
                            break;
                    }
                }

                // const docs = methodNode.jsDoc? methodNode.jsDoc : null; // array of js docs

            } catch (e) {
                method.returnType = '';
                method.hasReturn = false;
            }
        } else {
            method.returnType = '';
            method.hasReturn = false;
        }
        return method;
    }

    private methodIsPublic(methodNode: ts.MethodDeclaration) {
        const flags = ts.getCombinedModifierFlags(methodNode);
        // check if the private flag is part of this binary flag - if not means the method is public
        return (
            (flags & ts.ModifierFlags.Private) !== ts.ModifierFlags.Private &&
            (flags & ts.ModifierFlags.Protected) !== ts.ModifierFlags.Protected
        );
    }

    private addImportPaths(params: ConstructorParam[], fullText: string): ConstructorParam[] {
        return params.map(p => {
            const match = fullText.match(new RegExp(`import.*${p.type}.*from.*('|")(.*)('|")`)) || [];
            return { ...p, importPath: match[2] }; // take the 2 match     1-st^^^  ^^2-nd
        });
    }

}






