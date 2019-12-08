import * as ts from '../../../lib/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import {tokenToString} from "../../../lib/third_party/github.com/Microsoft/TypeScript/lib/typescript";

let program;
let typeChecker: ts.TypeChecker;




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
export function readClassNamesAndConstructorParams(
    fileName: string,
    fileContents: string
): ClassDescription[] {
    const sourceFile = ts.createSourceFile(fileName, fileContents, ts.ScriptTarget.ES2015, true);
    // Build a program using the set of root file names in fileNames
    program = ts.createProgram([fileName],{});

    // Get the checker, we will use it to find more about classes
    typeChecker = program.getTypeChecker();

    const res = read(sourceFile);
    const enrichedRes = res.map(r => ({
        ...r,
        constructorParams: addImportPaths(r.constructorParams, fileContents)
    }));
    return enrichedRes;
}

function read(node: ts.Node) {
    let result: ClassDescription[] = [];
    if (node.kind === ts.SyntaxKind.ClassDeclaration) {
        const classDeclaration = node as ts.ClassDeclaration;
        const className = classDeclaration.name != null ? classDeclaration.name.getText() : 'default';
        const methods = readPublicMethods(node as ts.ClassDeclaration, className);
        result = [
            {
                name: className,
                constructorParams: readConstructorParams(node as ts.ClassDeclaration),
                publicMethods: methods.map<string>(m => m.name),
                methods: methods
            }
        ];
        // console.log ('result : ', result);
    }

    ts.forEachChild(node, n => {
        const r = read(n);
        if (r && r.length > 0) {
            result = result.concat(r);
        }
    });

      

    return result;
}

function readConstructorParams(node: ts.ClassDeclaration): ConstructorParam[] {
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

function readPublicMethods(node: ts.ClassDeclaration, className: string): methodeType[] {
    let publicMethods: methodeType[] = [];

    ts.forEachChild(node, node => {
        if (node.kind === ts.SyntaxKind.MethodDeclaration) {
            const method = node as ts.MethodDeclaration;

            const func = constructMethodType(method, className);

            if (methodIsPublic(method)) {
                publicMethods.push(func);
            }
        }
    });
    return publicMethods;
}

function constructMethodType(methodNode: ts.MethodDeclaration, className: string): methodeType {

    let method: methodeType = {name: methodNode.name.getText(), parentClass: className};

    method.params = methodNode.parameters.map<methodParams>(constructMethodParams);
    const flags: ts.ModifierFlags = ts.getCombinedModifierFlags(methodNode);

    method = computeReturnType(method, methodNode);
    method = computeMethodBody(method, methodNode);


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

function constructMethodParams(p: ts.ParameterDeclaration): methodParams {
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

function computeMethodBody(method: methodeType, methodNode: ts.MethodDeclaration) {

    if (methodNode && methodNode.body && methodNode.body.statements) {
        methodNode.body.statements.every((statement, index) => {
            console.log(`Statement (${index}) :`, statement.kind, tokenToString(statement.kind), statement.getFullText());



            switch (statement.kind) {
                case ts.SyntaxKind.EmptyStatement:
                    console.log('Statement : EmptyStatement');
                    break;
                    case ts.SyntaxKind.ExpressionStatement:
                        console.log('Statement : ExpressionStatement');
                        computeExpressionStatement(method, (statement as ts.ExpressionStatement).expression);
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

function computeExpressionStatement(method: methodeType, expression: ts.Expression) {

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

function computeReturnType(method: methodeType, methodNode: ts.MethodDeclaration) {
    // @ts-ignore
    if (typeChecker) {
        try {
            const signature: ts.Signature | undefined = typeChecker.getSignatureFromDeclaration(methodNode);
            let returnType = null;
            if (signature) {
                returnType = typeChecker.getReturnTypeOfSignature(signature);

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
                        method.returnType = typeChecker.typeToString(returnType);
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

function methodIsPublic(methodNode: ts.MethodDeclaration) {
    const flags = ts.getCombinedModifierFlags(methodNode);
    // check if the private flag is part of this binary flag - if not means the method is public
    return (
        (flags & ts.ModifierFlags.Private) !== ts.ModifierFlags.Private &&
        (flags & ts.ModifierFlags.Protected) !== ts.ModifierFlags.Protected
    );
}

function addImportPaths(params: ConstructorParam[], fullText: string): ConstructorParam[] {
    return params.map(p => {
        const match = fullText.match(new RegExp(`import.*${p.type}.*from.*('|")(.*)('|")`)) || [];
        return { ...p, importPath: match[2] }; // take the 2 match     1-st^^^  ^^2-nd
    });
}
export type ClassDescription = {
    name: string;
    constructorParams: ConstructorParam[];
    publicMethods: string[];
    methods: methodeType[];
};

export type ConstructorParam = {
    name: string;
    type: string;
    importPath?: string;
};

export class indirectOutput {
    name: string;
    fullText: string;
    expectStatement?: string; // Will compute expect Statement.
}

export class methodeType {
    name: string;
    parentClass?: string;
    isPublic?: boolean;
    type?: 'public' | 'private' | 'protected';
    body?: string;
    params?: methodParams[];
    returnType?: string;
    indirectOutput?: indirectOutput[];
    hasReturn?: boolean;
    [key: string]: any;
}

export type methodParams = {
    name: string;
    type: string,    
    importPath?: string;
    defaultValue?: any;
}
