//c) Code Generator:
    function convertToJS(AST)
    {
        switch (AST.type)
        {
            case "program":
                return AST.body.map(convertToJS).join('\n');
            case "bindingDeclaration":
                if(AST.parameters && AST.definition)
                    return `let ${AST.name} = function(${AST.parameters}){${AST.definition.replace(/return/g, "return ")}}`;
                if(AST.dataType === "object" || AST.dataType === "array")
                    return `let ${AST.name} = ${JSON.stringify(AST.value)}`;
                //else:
                return `let ${AST.name} = ${AST.value};`;
            case "conditionTest":
                if(AST.name === "else")
                    return 'else';
                else if(AST.name === "elseIf")
                    return `else if(${AST.value})`;
                else
                    return `${AST.name}(${AST.value})`;
            case "functionInvocation":
                if(AST.name === "print")
                {
                    let retVal = "console.log(";
                    AST.arguments.forEach((arg) => 
                        {
                            if(arg.type === "string")
                                retVal += `"${arg.value}"`;
                            else if(arg.type === "templateLiteral")
                                retVal += `\`${arg.value}\``;
                            else
                                retVal += `${arg.value}`;
                        });
                    return retVal + ';';
                }
            case "block":
                return AST.code.replace(/suppose/g, "let ").replace(/->/g, " = ").replace(/print/g, "console.log");
        }
    }


export {convertToJS};