export const sampleSource = `suppose votingAge -> 18, suppose johnsAge -> 10;
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
`
