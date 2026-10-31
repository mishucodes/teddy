//b) Parser:
    function parseTheseTokens(tokensArray)
    {
        let AST = {type: "program", body: []};
        while(tokensArray.length > 0)
        {
            let token = tokensArray.shift();
            //ba) checking for binding declarations (& their definitions):
                if(token.type === "bindingDeclaration" && token.value === "suppose")
                {
                    let declaration =
                    {
                        type: "bindingDeclaration",
                        name: tokensArray.shift().value
                    };
                    if(tokensArray[0].type === "assignmentOperatorForBindings" && tokensArray[0].value === "->")
                    {
                        tokensArray.shift(); //skipping -> token
                        let expression = "";
                        while(tokensArray.length > 0 && !/(endOfStatement)|(comma)/.test(tokensArray[0].type))
                        {
                            if(tokensArray[0].type === "beginObject")
                            {
                                tokensArray.shift(); //skipping the { token...
                                let object = {};
                                while(tokensArray.length && tokensArray[0].type !== "endObject" && tokensArray[1].type !== "endOfStatement")
                                {
                                    let key = tokensArray.shift().value;
                                    tokensArray.shift(); //skipping the : character...
                                    let value;
                                    if(tokensArray[0].type === "string")
                                        value = `"${tokensArray.shift().value}"`;
                                    else if(tokensArray[0].type === "templateLiteral")
                                        value = `\`${tokensArray.shift().value}\``;
                                    else
                                        value = tokensArray.shift().value;
                                    object[String(key)] = value;
                                    if(tokensArray[0].type === "comma")
                                        tokensArray.shift(); //skipping the commas if necessary...
                                }
                                declaration.value = object;
                                declaration.dataType = "object";
                                tokensArray.shift();
                            }
                            else if(tokensArray[0].type === "beginArray")
                            {
                                let array = "[";
                                tokensArray.shift(); //skipping the [ character
                                while(tokensArray.length && !(tokensArray[0].type === "endArray" && tokensArray[1].type === "endOfStatement"))
                                    array += tokensArray.shift().value;
                                array += "]";
                                tokensArray.shift(); //skipping the ] character
                                expression = array;
                                expression = JSON.parse(makeJSONfriendly(array));
                                declaration.value = expression;
                                declaration.dataType = "array";
                            }
                            else if(tokensArray[0].type === "functionDeclaration")
                            {
                                tokensArray.shift(); //skipping the "function" keyword
                                    let parameters = "", definition = "";
                                if(tokensArray[0].type === "beginParameters")
                                {
                                    tokensArray.shift(); //skipping the ( character...
                                    while(tokensArray[0].type !== "endParameters")
                                        parameters += tokensArray.shift().value;
                                    tokensArray.shift(); //skipping the ) character...
                                }
                                if(tokensArray[0].type === "beginFunctionDefinition")
                                {
                                    tokensArray.shift(); //skipping the { character...
                                    while(tokensArray[0].type !== "endFunctionDefinition")
                                        definition += tokensArray.shift().value;
                                    tokensArray.shift(); //skipping the } character...
                                }
                                declaration.parameters = parameters;
                                declaration.definition = definition;
                            }
                            else if(tokensArray[0].type === "string")
                            {
                                expression += `"${tokensArray.shift().value}"`;
                                declaration.value = expression.trim();
                            }
                            else if(tokensArray[0].type === "templateLiteral")
                            {
                                expression += `\`${tokensArray.shift().value}\``;
                                declaration.value = expression.trim();
                            }
                            else
                            {
                                expression += tokensArray.shift().value;
                                declaration.value = expression.trim();
                            }
                        }
                    }
                    AST.body.push(declaration);
                    if(tokensArray[0]?.type === "endOfStatement")
                        tokensArray.shift(); //skipping the ; token
                }
            //bb) checking for the conditional statements:
                //bba) if:
                    if(token.type === "conditionalDeclaration" && token.value === "if")
                    {
                        if(tokensArray[0].type !== "beginLogicalTest")
                            throw new SyntaxError("missing ( after 'if'");
                        //else:
                        tokensArray.shift(); //skipping the ( character token...
                        if(tokensArray[0].type === "endLogicalTest")
                            throw new SyntaxError("An if statement must have an expression to determine the course of further execution");
                        //else:
                        let declaration =
                        {
                            type: "conditionTest",
                            name: "if",
                            value: ""
                        };
                        let expression = "";
                        while(tokensArray.length > 0 && tokensArray[0].type !== "endLogicalTest")
                            expression += tokensArray.shift().value;
                        tokensArray.shift(); //skipping ) character token
                        declaration.value = expression.trim();
                        AST.body.push(declaration);
                    }
                //bbb) elseIf:
                    if(token.type === "conditionalDeclaration" && token.value === "elseIf")
                    {
                        if(tokensArray[0].type !== "beginLogicalTest")
                            throw new SyntaxError("missing ( after 'elseIf'");
                        //else:
                        tokensArray.shift(); //skipping the ( character token...
                        if(tokensArray[0].type === "endLogicalTest")
                            throw new SyntaxError("An elseIf statement must have an expression to determine the course of further execution");
                        //else:
                        let declaration =
                        {
                            type: "conditionTest",
                            name: "elseIf",
                            value: ""
                        };
                        let expression = "";
                        while(tokensArray.length > 0 && tokensArray[0].type !== "endLogicalTest")
                            expression += tokensArray.shift().value;
                        tokensArray.shift(); //skipping ) character token
                        declaration.value = expression.trim();
                        AST.body.push(declaration);
                    }
                //bbc) else:
                    if(token.type === "conditionalDeclaration" && token.value === "else")
                    {
                        if(tokensArray[0]?.type === "beginLogicalTest")
                            throw new SyntaxError("An else statement does not expect any test expression");
                        //else:
                        let declaration =
                        {
                            type: "conditionTest",
                            name: "else",
                        };
                        AST.body.push(declaration);
                    }
            //bc) checking for function invocations:
                if(token.type === "bindingName" && tokensArray[0].type === "beginArguments")
                {                    
                    let declaration =
                    {
                        type: "functionInvocation",
                        name: token.value,
                        arguments: []
                    }
                    tokensArray.shift(); //skipping the ( character...
                    while(tokensArray.length && !(tokensArray[0].type === "endArguments" && tokensArray[1].type === "endOfStatement"))
                        if(tokensArray[0].type === "comma")
                            tokensArray.shift(); //skipping the commas...
                        else
                            declaration.arguments.push(tokensArray.shift());
                    declaration.arguments.push(tokensArray.shift());
                    AST.body.push(declaration);
                }
            //bd) checking for new blocks:
                if(token.type === "beginBlock")
                {
                    let nestingLevel = 0; //this will help us avoid recursion & the stack cost associated therewith...
                    let declaration =
                    {
                        type: "block",
                        code: "{"
                    }
                    while(tokensArray.length && !(tokensArray[0].type === "endBlock" && nestingLevel === 0))
                    {
                        if(tokensArray[0].type === "beginBlock")
                            nestingLevel++;
                        else if(tokensArray[0].type === "endBlock")
                            nestingLevel--;
                        if(tokensArray[0].type === "string")
                            declaration.code += `"${tokensArray.shift().value}"`;
                        else if(tokensArray[0].type === "templateLiteral")
                            declaration.code += `\`${tokensArray.shift().value}\``;
                        //else:
                        declaration.code += tokensArray.shift().value;
                    }
                    declaration.code += tokensArray.shift().value;
                    AST.body.push(declaration);
                }
        }
        return AST;
    }

export {parseTheseTokens};




//Helper Function: Makes a string JSON-friendly:
    function makeJSONfriendly(string)
    {
    //01) Quoting unquoted object keys: {name: -> {"name":
    string = string.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":');

    //02) Quoting bare values after a colon (but not numbers/true/false/null)
    string = string.replace(/:\s*([A-Za-z_][A-Za-z0-9_]*)(?=\s*(?:,|\}|\]))/g, ': "$1"');

    //03) Quoting bare array/object elements (after [ or ,) that are plain identifiers
    //Keeping numbers, booleans and null alone because they are valid JSON tokens.
    string = string.replace(/(\[|,)\s*([A-Za-z_][A-Za-z0-9_]*)\s*(?=(?:,|\]|\}))/g,
                        (m, sep, id) => `${sep}"${id}"`);

    return string;
    }