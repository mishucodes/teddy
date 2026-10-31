//Router:
import {createFileRoute} from '@tanstack/react-router';
export const Route = createFileRoute('/')({component: LandingPage})
//Core Language:
import {tokeniseThisCode} from "#/lib/lexer.js";
import {parseTheseTokens} from "#/lib/parser.js";
import {convertToJS} from "#/lib/transpiler";

//Source Code:
const sourceCode =
    `
        suppose votingAge -> 18, suppose johnsAge -> 10;
        suppose johnName -> "john";

        if(johnsAge < 15)
            print(johnName, "cannot vote");
        elseIf(johnsAge < votingAge)
            print(johnName, "should vote soon");
        else
            print(johnName, "can vote");

        suppose templateLiteral -> 'hello \${johnName}';
        print(templateLiteral);

        suppose myObject -> {name: "john", age: 21};
        suppose myArray -> [1,2,3];
        suppose myNestedArray -> [1,2,3, {name: "bob"}, ["x", "y", "z"]];

        //comments like these will be ignored...

        suppose myFunction -> function(x,y)
        {
            return x+y;
        };
        print(myFunction(2,3));

        {
            print("this is a new block");
            if(true)
            {
                suppose x -> 100;
                print(x);
            }
        }
    `;
//Page:
function LandingPage()
{
    function compileThisCode(codeStr)
    {
        let tokens = tokeniseThisCode(codeStr);
        let AST = parseTheseTokens(tokens);
        let JScode = convertToJS(AST);
        return JScode;
    }
    const output = compileThisCode(sourceCode);
    console.log(output);
    return (
        <main>
            <div>
                <h1 className='font-bold text-5xl'>Source Code</h1>
                <p>{sourceCode}</p>
            </div>
            <div>
                <h1 className='font-bold text-5xl'>Converted Code</h1>
                <p>{output}</p>
            </div>
        </main>
    )
}