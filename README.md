# Teddy

A tiny programming language that compiles to JavaScript, with a playground to write and run it in the browser.

## About

This project implements a small programming language inspired by the language-building chapter of
*Eloquent JavaScript* by Marijn Haverbeke. The aim is to deepen my understanding of interpreters and
compilers by building a language from first principles (my own lexer, parser, AST and code generator)
rather than following the book verbatim. It diverges from the book's example in both design and
execution, reflecting personal experimentation and ideas formed along the way.

The language is called **Teddy**: not just because "teddy" is the canonical toy name, but because the
word's origin (President Teddy Roosevelt) is one I find personally interesting. It also feels fitting:
an innocuous name with a hint of larger ambition beneath it, which matches the spirit of this project.

I wrote the language in 2024 while learning JavaScript ([original repo][original]). This version keeps
that code as it was, adds TypeScript types around it, and gives it a playground UI.

## How it works

What the book calls a "parser" reads source code and produces a data structure (an AST) that reflects
the structure of the program. Here that job is split into two steps, followed by a third that
produces JavaScript:

| Step | File | What it does |
| --- | --- | --- |
| 1. Lex | [`src/lib/lexer.ts`](src/lib/lexer.ts) | Breaks the code into **tokens** (atoms). |
| 2. Parse | [`src/lib/parser.ts`](src/lib/parser.ts) | Builds an **AST** (Abstract Syntax Tree) from those tokens. |
| 3. Transpile | [`src/lib/transpiler.ts`](src/lib/transpiler.ts) | Turns the AST into **JavaScript**. JS for now; an AST could be translated into any language. |

### Some additional notes

- **"Isn't it misleading to call this a language when it just translates into JS?"** I wouldn't argue
  otherwise, because that is exactly what it does. It's still worth doing, because it teaches how a
  language breaks code into tokens, how it builds an AST from them, and how an AST becomes something a
  machine can run.
- **Calling tokens "atoms" is not poor poetry.** An [atom][atom] literally means "something that cannot
  be broken up any further". In the same way, a token is the smallest piece of information a language
  considers legal.

## A guide to Teddy

```teddy
suppose votingAge -> 18, suppose age -> 10;
suppose name -> "john";

if(age < 15)
    print(name, "cannot vote");
elseIf(age < votingAge)
    print(name, "should vote soon");
else
    print(name, "can vote");

suppose greeting -> 'hello ${name}';
print(greeting);

suppose add -> function(x, y)
{
    return x + y;
};
print(add(2, 3));
```

### Data types

| Kind | Type | Syntax |
| --- | --- | --- |
| Primitive | Number | Integers: `18`, `-5` |
| Primitive | String | Characters between double quotes: `"john"` |
| Primitive | Template literal | Characters between single quotes, with `${…}` interpolation: `'hello ${name}'` |
| Non-primitive | Object | Key-value pairs between braces: `{name: "john", age: 21}` |
| Non-primitive | Array | Values between brackets, nesting allowed: `[1, 2, {name: "bob"}, ["x"]]` |

### Keywords

| Keyword | Meaning |
| --- | --- |
| `suppose` | Declares a (non-`const`, loosely typed) binding: `suppose x -> 1;` |
| `function` | Declares a function: `function(x, y) { return x + y; };` |
| `return` | Returns a value from a function. |
| `if`, `elseIf`, `else` | Like `if`, `else if` and `else` in JS. |

### Operators

| Kind | Operators | Note |
| --- | --- | --- |
| Assignment | `->` | |
| Arithmetic | `+` `-` `*` `/` `%` | |
| Comparison | `=` `==` `!=` `!==` `<` `>` `<=` `>=` | `=` becomes JS `==`, and `==` becomes JS `===`. |

### Everything else

- **`print`** is Teddy's `console.log`.
- **JS is the proto-language behind Teddy.** Inside expressions and blocks, JS functions and values
  work as they are (`Math.max(1, 2)`, `true`). Only `print` can be called as a statement on its own.
- **Comments** start with `//` and run to the end of the line.
- **Blocks** `{ … }` can be nested.
- **Bad code** usually isn't reported as a syntax error. It is mostly ignored, sometimes throws, and
  sometimes runs forever. The playground stops anything that runs longer than 2 seconds.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
```

The playground compiles and runs your code in a Web Worker, which is how it can stop a run that never
finishes without freezing the page. The output panel shows any of the three stages (**Tokens**, **AST**
or **JavaScript**), and when compilation fails it still shows the stages that succeeded. Press **Run** or <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd>.

Built with TanStack Start, React, TypeScript, Tailwind and shadcn/ui.

## References

- Marijn Haverbeke, *Eloquent JavaScript* (3rd edition), Chapter 12: "Project: A Programming Language"
- [Video reference][video]
- [The original 2024 version][original]

[original]: https://github.com/mishucodes/Eloquent-JS/tree/main/Chapter%2012%20-%20Project%20(A%20Programming%20Language)
[atom]: https://en.wiktionary.org/wiki/atom
[video]: https://youtu.be/rTuTLc_u6qw?si=IhZS80v_gbLANMXl
