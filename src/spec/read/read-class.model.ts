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
    type: string;
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