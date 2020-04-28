
export type ClassDescription = {
    name: string;
    constructorParams: ConstructorParam[];
    publicMethods: string[];
    methods: methodeType[];
    properties?: propertiesList;
};
export type ConstructorParam = {
    name: string;
    type: string;
    modifier?: modifierFlags;
    isPublic?: boolean;
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
    modifier?: modifierFlags;
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

export class propertiesType {
    name: string;
    isPublic?: boolean;
    parentClass?: string;
    modifier?: modifierFlags;
    type?: string;
    [key: string]: any;
}

export type modifierFlags = 'public' | 'private' | 'protected' | 'none';

export type propertiesList = {[name: string]: propertiesType};
