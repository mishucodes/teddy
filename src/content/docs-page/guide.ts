export const guideExample = `suppose votingAge -> 18, suppose age -> 10;
suppose name -> "john";

if(age < 15)
    print(name, "cannot vote");
elseIf(age < votingAge)
    print(name, "should vote soon");
else
    print(name, "can vote");

suppose greeting -> 'hello \${name}';
print(greeting);

suppose add -> function(x, y)
{
    return x + y;
};
print(add(2, 3));`

export const dataTypes = [
  { kind: 'Primitive', name: 'Number', description: 'Integers.', example: '18, -5' },
  { kind: 'Primitive', name: 'String', description: 'Characters between double quotes.', example: '"john"' },
  { kind: 'Primitive', name: 'Template literal', description: 'Characters between single quotes, with ${…} interpolation.', example: "'hello ${name}'" },
  { kind: 'Non-primitive', name: 'Object', description: 'Key-value pairs between braces.', example: '{name: "john", age: 21}' },
  { kind: 'Non-primitive', name: 'Array', description: 'Values between brackets; nesting allowed.', example: '[1, 2, {name: "bob"}, ["x"]]' },
]

export const keywords = [
  { keyword: 'suppose', meaning: 'Declares a non-const, loosely typed binding.', example: 'suppose x -> 1;' },
  { keyword: 'function', meaning: 'Declares a function.', example: 'function(x, y) { return x + y; };' },
  { keyword: 'return', meaning: 'Returns a value from a function.', example: 'return x;' },
  { keyword: 'if, elseIf, else', meaning: 'Like if, else if and else in JS.', example: 'elseIf(age < 18)' },
]

export const operators = [
  { kind: 'Assignment', symbols: '->', note: '' },
  { kind: 'Arithmetic', symbols: '+  -  *  /  %', note: '' },
  { kind: 'Comparison', symbols: '=  ==  !=  !==  <  >  <=  >=', note: '= becomes JS ==, and == becomes JS ===.' },
]

export const otherNotes = [
  { term: 'print', detail: 'Teddy’s console.log.' },
  { term: 'JavaScript', detail: 'JS is the proto-language behind Teddy. Inside expressions and blocks, JS functions and values work as they are (Math.max(1, 2), true). Only print can be called as a statement on its own.' },
  { term: 'Comments', detail: 'Start with // and run to the end of the line.' },
  { term: 'Blocks', detail: '{ … } can be nested.' },
  { term: 'Bad code', detail: 'Usually isn’t reported as a syntax error. It is mostly ignored, sometimes throws, and sometimes runs forever. The playground stops anything that runs longer than 2 seconds.' },
]
