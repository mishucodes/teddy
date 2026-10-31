//a) Lexer:
    function tokeniseThisCode(codeStr)
    {
        let tokens = [];
        let cursor = 0;
        while(cursor < codeStr.length)
        {
            let currentCharacter = codeStr[cursor];
            //aa) skipping whitespaces:
                if(/\s/.test(currentCharacter))
                {
                    cursor++;
                    continue;
                }
            //ab) removing comments:
                if (currentCharacter === "/" && codeStr[cursor + 1] === "/")
                {
                    while (cursor < codeStr.length && codeStr[cursor] !== "\n")
                        cursor++;
                    continue;
                }
            //ac) checking for keys in objects:
                if(/[A-Za-z]/.test(currentCharacter) && ((tokens[tokens.length - 1]?.type) === "beginObject" || (tokens[tokens.length - 3]?.type) === "assignmentOperatorForKeys"))
                {
                    let word = "";
                    while(/[A-Za-z0-9.]/.test(currentCharacter))
                    {
                        word += currentCharacter;
                        currentCharacter = codeStr[++cursor];
                    }
                    tokens.push({type: "key", value: word});
                    continue;
                }
            //ad) checking for a parameter:
                if(/[a-zA-z]/.test(currentCharacter) && /(beginParameters)|(commaForParameters)/.test(tokens[tokens.length-1]?.type))
                {
                    let parameter = "";
                    while(/[A-Za-z0-9]/.test(currentCharacter))
                    {
                        parameter += currentCharacter;
                        currentCharacter = codeStr[++cursor];
                    }
                    tokens.push({type: "parameter", value: parameter});
                    continue;
                }
            //ae) getting language keywords / bindings:
                if(/[A-Za-z]/.test(currentCharacter))
                {
                    let word = "";
                    while(/[A-Za-z0-9.]/.test(currentCharacter))
                    {
                        word += currentCharacter;
                        currentCharacter = codeStr[++cursor];
                    }
                    switch (word)
                    {
                        case "suppose":
                            tokens.push({type: "bindingDeclaration", value: word});
                            break;
                        case "function":
                            tokens.push({type: "functionDeclaration", value: word});
                            break;
                        case "return":
                            tokens.push({type: "returnStatement", value: word});
                            break;
                        case "if":
                        case "elseIf":
                        case "else":
                            tokens.push({type: "conditionalDeclaration", value: word});
                            break;
                        default:
                            tokens.push({type: "bindingName", value: word});
                            break;
                    }
                    continue;
                }
            //af) checking for the assignment operator for bindings:
                if ((currentCharacter === "-" && codeStr[cursor + 1] === ">") && tokens[tokens.length-1].type === "bindingName")
                {
                    tokens.push({type: "assignmentOperatorForBindings", value: "->"});
                    cursor += 2;
                    continue;
                }
            //ag) checking for primitive values:
                //aga) getting simple numbers (integers):
                    if(/[0-9]/.test(currentCharacter))
                    {
                        let number = "";
                        while(/[0-9]/.test(currentCharacter))
                        {
                            number += currentCharacter;
                            currentCharacter = codeStr[++cursor];
                        }
                        tokens.push({type: "number", value: Number(number)});
                        continue;
                    }
                //agb) getting simple strings:
                    if(currentCharacter === '"')
                    {
                        currentCharacter = codeStr[++cursor]; //skipping the " character in the beginning...
                        let string = "";
                        while(cursor < codeStr.length && codeStr[cursor] !== '"')
                            string += codeStr[cursor++];
                        tokens.push({type: "string", value: string});
                        cursor++; //skipping the " character in thr end...
                        continue;
                    }
                //agc) getting template literals: NOT SUPPORTED YET...
                    if(currentCharacter === "'")
                    {
                        currentCharacter = codeStr[++cursor]; //skipping the ` character in the beginning...
                        let templateLiteral = "";
                        while(cursor < codeStr.length && codeStr[cursor] !== "'")
                            templateLiteral += codeStr[cursor++];
                        tokens.push({type: "templateLiteral", value: templateLiteral});
                        cursor++; //skipping the ' character in thr end...
                        continue;
                    }
            //ax) checking for blocks following conditional tests:
                if(currentCharacter === "{" && (tokens.length && tokens[tokens.length-1].type === "endLogicalTest"))
                {
                    tokens.push({type: "beginBlock", value: currentCharacter});
                    cursor++;
                    continue;
                }
            //ah) checking for the beginning of a function definition:
                if(currentCharacter === "{" && tokens[tokens.length-1]?.type === "endParameters")
                {
                    tokens.push({type: "beginFunctionDefinition", value: currentCharacter});
                    cursor++;
                    continue;
                }
            //ai) checking for the end of a function definition:
                if(currentCharacter === "}" && tokens[tokens.length-1].type === "endOfStatement" && codeStr[cursor+1] === ";")
                {
                    tokens.push({type: "endFunctionDefinition", value: currentCharacter});
                    cursor++;
                    continue;
                }
            //aj) checking for non-primitive values:
                //aja) objects:
                    //ajaa) checking for the beginning of an object:
                        if(currentCharacter === "{" && (tokens.length > 0 && !/;|{/.test(tokens[tokens.length - 1].value)))
                        {
                            tokens.push({type: "beginObject", value: currentCharacter});
                            cursor++;
                            continue;
                        }

                    //ajab) checking for assignment operator (:) in objects:
                        if(currentCharacter === ":" && tokens[tokens.length - 1].type === "key")
                        {
                            tokens.push({type: "assignmentOperatorForKeys", value: currentCharacter});
                            cursor++;
                            continue;
                        }
                    //ajac) checking for the end of an object:
                        if(currentCharacter === "}" && codeStr[cursor+1] === ";")
                        {
                            tokens.push({type: "endObject", value: currentCharacter});
                            cursor++;
                            continue;
                        }
                //ajb) arrays
                    //ajba) checking for the beginning of an array:
                        if(currentCharacter === "[")
                        {
                            tokens.push({type: "beginArray", value: currentCharacter});
                            cursor++;
                            continue;
                        }
                    //ajbb) checking for the end of an array:
                        if(currentCharacter === "]")
                        {
                            tokens.push({type: "endArray", value: currentCharacter});
                            cursor++;
                            continue;
                        }
            //ak) checking for comma separating parameters:
                if(currentCharacter === "," && tokens[tokens.length-1].type === "parameter")
                {
                    tokens.push({type: "commaForParameters", value: currentCharacter});
                    cursor++;
                    continue;
                }
            //al) checking for comma separating arguments:
                if(currentCharacter === "," && /(beginArguments)|(commaForArguments)/.test(tokens[tokens.length-2].type))
                {
                    tokens.push({type: "commaForArguments", value: currentCharacter});
                    cursor++;
                    continue;
                }
            //am) checking for a comma:
                if(currentCharacter === ",")
                {
                    tokens.push({type: "comma", value: currentCharacter});
                    cursor++;
                    continue;
                }
            //an) checking for statement termination:
                if(currentCharacter === ";")
                {
                    tokens.push({type: "endOfStatement", value: currentCharacter});
                    cursor++;
                    continue;
                }
            //ao) checking for arithmetic operators:
                if (/[+\-*/%]/.test(currentCharacter))
                {
                    tokens.push({type: "arithmeticOperator", value: currentCharacter});
                    cursor++;
                    continue;
                }
            //ap) checking for logical operators:
                if (/[><=!]/.test(currentCharacter))
                {
                    if(currentCharacter === "!" && codeStr[cursor + 1] === "=" && codeStr[cursor + 2] === "=")
                    {
                        tokens.push({type: "logicalOperator", name: "strictlyNotEqualTo", value: "!=="});
                        cursor+=3;
                    }
                    else if(currentCharacter === "!" && codeStr[cursor + 1] === "=")
                    {
                        tokens.push({type: "logicalOperator", name: "looselyNotEqualTo", value: "!="});
                        cursor+=2;
                    }
                    else if(currentCharacter === "=" && codeStr[cursor + 1] === "=")
                    {
                        tokens.push({type: "logicalOperator", name: "StrictlyEqualTo", value: "==="});
                        cursor+=2;
                    }
                    else if(currentCharacter === "=")
                    {
                        tokens.push({type: "logicalOperator", name: "looselyEqualTo", value: "=="});
                        cursor++;
                    }
                    else if(currentCharacter === "<" && codeStr[cursor + 1] === "=")
                    {
                        tokens.push({type: "logicalOperator", name: "lessThanOrEqualTo", value: "<="});
                        cursor+=2;
                    }
                    else if(currentCharacter === ">" && codeStr[cursor + 1] === "=")
                    {
                        tokens.push({type: "logicalOperator", name: "moreThanOrEqualTo", value: ">="});
                        cursor+=2;
                    }
                    else if(currentCharacter === "<")
                    {
                        tokens.push({type: "logicalOperator", name: "lessThan", value: currentCharacter});
                        cursor++;
                    }
                    else if(currentCharacter === ">")
                    {
                        tokens.push({type: "logicalOperator", name: "moreThan", value: currentCharacter});
                        cursor++;
                    }
                    continue;
                }
            //aq) handling function definitions:
                //aqa) checking for the beginning of parameters
                    if(currentCharacter === "(" && tokens[tokens.length-1].type === "functionDeclaration")
                    {
                        tokens.push({type: "beginParameters", value: currentCharacter});
                        cursor++;
                        continue;
                    }
                //aqb) checking for parameters: supra
                //aqc) checking for comma separating parameters: supra
                //aqd) checking for the end of parameters:
                    if(currentCharacter === ")" && tokens[tokens.length-1].type === "parameter")
                    {
                        tokens.push({type: "endParameters", value: currentCharacter});
                        cursor++;
                        continue;
                    }
                //aqe) checking for the beginning of a function definition: supra
                //aqf) checking for the end of a function definition: supra
        
            //ar) handling function invocations:
                //ara) checking for the beginning of an argument:
                    if(currentCharacter === "(" && tokens[tokens.length-1].type === "bindingName")
                    {
                        tokens.push({type: "beginArguments", value: currentCharacter});
                        cursor++;
                        continue;
                    }
                //arb) checking for commas separating arguments: supra
                //arc) checking for the end of an argument:
                    if(currentCharacter === ")" && (/(commaForArguments)|(beginArguments)/.test(tokens[tokens.length-2]?.type) || codeStr[cursor+1] === ";"))
                    {
                        tokens.push({type: "endArguments", value: currentCharacter});
                        cursor++;
                        continue;
                    }
            //as) checking for parentheses in conditional statements:
                //asa) beginning of a logical test:
                    if(currentCharacter === "(" && tokens[tokens.length-1].type === "conditionalDeclaration")
                    {
                        tokens.push({type: "beginLogicalTest", value: currentCharacter});
                        cursor++;
                        continue;
                    }
                //asb) end of a logical test:
                    if(currentCharacter === ")" && codeStr[cursor+1] !== ";")
                    {
                        tokens.push({type: "endLogicalTest", value: currentCharacter});
                        cursor++;
                        continue;
                    }
            //at) checking for the beginning of an block:
                if(currentCharacter === "{")
                {
                    tokens.push({type: "beginBlock", value: currentCharacter});
                    cursor++;
                    continue;
                }
            //au) checking for the end of an block:
                if(currentCharacter === "}")
                {
                    tokens.push({type: "endBlock", value: currentCharacter});
                    cursor++;
                    continue;
                }
            //av) Anything else is probably bad code:
                throw new SyntaxError("Something's not right with your code"); //very sophisticated...
        }
        return tokens;
    }


export {tokeniseThisCode};