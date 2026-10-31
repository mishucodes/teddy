import type {Token, Tokens} from "./lexer";

type JSONValue = string | number | boolean | null | JSONValue[] | {[key: string]: JSONValue};
type BindingDeclarationNode =
{
    type: "bindingDeclaration",
    name: Token["value"],
    value?: JSONValue,
    dataType?: "object" | "array",
    parameters?: string,
    definition?: string
};
type ConditionTestNode =
    | {type: "conditionTest", name: "if" | "elseIf", value: string}
    | {type: "conditionTest", name: "else"};
type FunctionInvocationNode = {type: "functionInvocation", name: string, arguments: Token[]};
type BlockNode = {type: "block", code: string};
export type StatementNode = BindingDeclarationNode | ConditionTestNode | FunctionInvocationNode | BlockNode;
export type AST = {type: "program", body: StatementNode[]};
export type ASTNode = AST | StatementNode;

export function parseTheseTokens(tokensArray: Tokens): AST
{
    let AST: AST = {type: "program", body: []};
    while(tokensArray.length > 0)
    {
        let token = takeNextToken(tokensArray);
        //ba) checking for binding declarations (& their definitions):
            if(token.type === "bindingDeclaration" && token.value === "suppose")
            {
                let declaration: BindingDeclarationNode =
                {
                    type: "bindingDeclaration",
                    name: takeNextToken(tokensArray).value
                };
                if(tokensArray.at(0)?.type === "assignmentOperatorForBindings" && tokensArray.at(0)?.value === "->")
                {
                    tokensArray.shift(); //skipping -> token
                    let expression = "";
                    while(tokensArray.length > 0 && !/(endOfStatement)|(comma)/.test(tokensArray.at(0)?.type ?? ""))
                    {
                        if(tokensArray.at(0)?.type === "beginObject")
                        {
                            tokensArray.shift(); //skipping the { token...
                            let object: {[key: string]: JSONValue} = {};
                            while(tokensArray.length && tokensArray.at(0)?.type !== "endObject" && tokensArray.at(1)?.type !== "endOfStatement")
                            {
                                let key = takeNextToken(tokensArray).value;
                                tokensArray.shift(); //skipping the : character...
                                let value;
                                if(tokensArray.at(0)?.type === "string")
                                    value = `"${takeNextToken(tokensArray).value}"`;
                                else if(tokensArray.at(0)?.type === "templateLiteral")
                                    value = `\`${takeNextToken(tokensArray).value}\``;
                                else
                                    value = takeNextToken(tokensArray).value;
                                object[String(key)] = value;
                                if(tokensArray.at(0)?.type === "comma")
                                    tokensArray.shift(); //skipping the commas if necessary...
                            }
                            declaration.value = object;
                            declaration.dataType = "object";
                            tokensArray.shift();
                        }
                        else if(tokensArray.at(0)?.type === "beginArray")
                        {
                            let array = "[";
                            tokensArray.shift(); //skipping the [ character
                            while(tokensArray.length && !(tokensArray.at(0)?.type === "endArray" && tokensArray.at(1)?.type === "endOfStatement"))
                                array += takeNextToken(tokensArray).value;
                            array += "]";
                            tokensArray.shift(); //skipping the ] character
                            expression = array;
                            const parsedArray: JSONValue = JSON.parse(makeJSONfriendly(array));
                            declaration.value = parsedArray;
                            declaration.dataType = "array";
                        }
                        else if(tokensArray.at(0)?.type === "functionDeclaration")
                        {
                            tokensArray.shift(); //skipping the "function" keyword
                                let parameters = "", definition = "";
                            if(tokensArray.at(0)?.type === "beginParameters")
                            {
                                tokensArray.shift(); //skipping the ( character...
                                while(tokensArray.at(0)?.type !== "endParameters")
                                    parameters += takeNextToken(tokensArray).value;
                                tokensArray.shift(); //skipping the ) character...
                            }
                            if(tokensArray.at(0)?.type === "beginFunctionDefinition")
                            {
                                tokensArray.shift(); //skipping the { character...
                                while(tokensArray.at(0)?.type !== "endFunctionDefinition")
                                    definition += takeNextToken(tokensArray).value;
                                tokensArray.shift(); //skipping the } character...
                            }
                            declaration.parameters = parameters;
                            declaration.definition = definition;
                        }
                        else if(tokensArray.at(0)?.type === "string")
                        {
                            expression += `"${takeNextToken(tokensArray).value}"`;
                            declaration.value = expression.trim();
                        }
                        else if(tokensArray.at(0)?.type === "templateLiteral")
                        {
                            expression += `\`${takeNextToken(tokensArray).value}\``;
                            declaration.value = expression.trim();
                        }
                        else
                        {
                            expression += takeNextToken(tokensArray).value;
                            declaration.value = expression.trim();
                        }
                    }
                }
                AST.body.push(declaration);
                if(tokensArray.at(0)?.type === "endOfStatement")
                    tokensArray.shift(); //skipping the ; token
            }
        //bb) checking for the conditional statements:
            //bba) if:
                if(token.type === "conditionalDeclaration" && token.value === "if")
                {
                    if(tokensArray.at(0)?.type !== "beginLogicalTest")
                        throw new SyntaxError("missing ( after 'if'");
                    //else:
                    tokensArray.shift(); //skipping the ( character token...
                    if(tokensArray.at(0)?.type === "endLogicalTest")
                        throw new SyntaxError("An if statement must have an expression to determine the course of further execution");
                    //else:
                    let declaration: ConditionTestNode =
                    {
                        type: "conditionTest",
                        name: "if",
                        value: ""
                    };
                    let expression = "";
                    while(tokensArray.length > 0 && tokensArray.at(0)?.type !== "endLogicalTest")
                        expression += takeNextToken(tokensArray).value;
                    tokensArray.shift(); //skipping ) character token
                    declaration.value = expression.trim();
                    AST.body.push(declaration);
                }
            //bbb) elseIf:
                if(token.type === "conditionalDeclaration" && token.value === "elseIf")
                {
                    if(tokensArray.at(0)?.type !== "beginLogicalTest")
                        throw new SyntaxError("missing ( after 'elseIf'");
                    //else:
                    tokensArray.shift(); //skipping the ( character token...
                    if(tokensArray.at(0)?.type === "endLogicalTest")
                        throw new SyntaxError("An elseIf statement must have an expression to determine the course of further execution");
                    //else:
                    let declaration: ConditionTestNode =
                    {
                        type: "conditionTest",
                        name: "elseIf",
                        value: ""
                    };
                    let expression = "";
                    while(tokensArray.length > 0 && tokensArray.at(0)?.type !== "endLogicalTest")
                        expression += takeNextToken(tokensArray).value;
                    tokensArray.shift(); //skipping ) character token
                    declaration.value = expression.trim();
                    AST.body.push(declaration);
                }
            //bbc) else:
                if(token.type === "conditionalDeclaration" && token.value === "else")
                {
                    if(tokensArray.at(0)?.type === "beginLogicalTest")
                        throw new SyntaxError("An else statement does not expect any test expression");
                    //else:
                    let declaration: ConditionTestNode =
                    {
                        type: "conditionTest",
                        name: "else",
                    };
                    AST.body.push(declaration);
                }
        //bc) checking for function invocations:
            if(token.type === "bindingName" && tokensArray.at(0)?.type === "beginArguments")
            {                    
                let declaration: FunctionInvocationNode =
                {
                    type: "functionInvocation",
                    name: token.value,
                    arguments: []
                }
                tokensArray.shift(); //skipping the ( character...
                while(tokensArray.length && !(tokensArray.at(0)?.type === "endArguments" && tokensArray.at(1)?.type === "endOfStatement"))
                    if(tokensArray.at(0)?.type === "comma")
                        tokensArray.shift(); //skipping the commas...
                    else
                        declaration.arguments.push(takeNextToken(tokensArray));
                declaration.arguments.push(takeNextToken(tokensArray));
                AST.body.push(declaration);
            }
        //bd) checking for new blocks:
            if(token.type === "beginBlock")
            {
                let nestingLevel = 0; //this will help us avoid recursion & the stack cost associated therewith...
                let declaration: BlockNode =
                {
                    type: "block",
                    code: "{"
                }
                while(tokensArray.length && !(tokensArray.at(0)?.type === "endBlock" && nestingLevel === 0))
                {
                    if(tokensArray.at(0)?.type === "beginBlock")
                        nestingLevel++;
                    else if(tokensArray.at(0)?.type === "endBlock")
                        nestingLevel--;
                    if(tokensArray.at(0)?.type === "string")
                        declaration.code += `"${takeNextToken(tokensArray).value}"`;
                    else if(tokensArray.at(0)?.type === "templateLiteral")
                        declaration.code += `\`${takeNextToken(tokensArray).value}\``;
                    //else:
                    declaration.code += takeNextToken(tokensArray).value;
                }
                declaration.code += takeNextToken(tokensArray).value;
                AST.body.push(declaration);
            }
    }
    return AST;
}




//Helper Function: Makes a string JSON-friendly:
    function makeJSONfriendly(string: string): string
    {
        //01) Quoting unquoted object keys: {name: -> {"name":
        string = string.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":');

        //02) Quoting bare values after a colon (but not numbers/true/false/null)
        string = string.replace(/:\s*([A-Za-z_][A-Za-z0-9_]*)(?=\s*(?:,|\}|\]))/g, ': "$1"');

        //03) Quoting bare array/object elements (after [ or ,) that are plain identifiers
        //Keeping numbers, booleans and null alone because they are valid JSON tokens.
        string = string.replace(/(\[|,)\s*([A-Za-z_][A-Za-z0-9_]*)\s*(?=(?:,|\]|\}))/g, (_match, sep, id) => `${sep}"${id}"`);

        return string;
    }

//Helper Function: Takes the next token, failing loudly if the code ended too soon:
    function takeNextToken(tokensArray: Tokens): Token
    {
        const token = tokensArray.shift();
        if (!token) throw new SyntaxError("Your code ended unexpectedly");
        return token;
    }
