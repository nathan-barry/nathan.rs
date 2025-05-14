+++
title = "Where Rust Shines: Algebraic Types and Match Statements"
date = 2023-11-11T08:51:57-06:00
tags = ["Programming"]
+++

## One Recent Example
---

Recently I was going through Thorsten Ball's "Writing An Interpreter in Go". In this book, you create a basic interpreted language and write a lexer, parser, evaluator, and REPL for it. 

A Lexer takes in source code and turns it into an intermediate representation, usually in the form of a string of tokens. This is called Lexical Analysis. A parser usually takes this stream of tokens and turns it into an Abstract Syntax Tree which is then evaluated and run.

The Lexer in the book keeps track of the input string (source code), and the position we are at in the string.

Below is a method of the Lexer that determines what the next token should be, given the current state of the Lexer:

```go
func (l *Lexer) NextToken() token.Token {
	var tok token.Token

	l.skipWhitespace()

	switch l.ch {
	case '=':
		tok = newToken(token.ASSIGN, l.ch)
	case ';':
		tok = newToken(token.SEMICOLON, l.ch)
	case '-':
		tok = newToken(token.MINUS, l.ch)

    // --12 more cases--

	default:
		if isLetter(l.ch) {
			tok.Literal = l.readIdentifier()
			tok.Type = token.LookupIdent(tok.Literal)
			return tok
		} else if isDigit(l.ch) {
			tok.Type = token.INT
			tok.Literal = l.readNumber()
			return tok
		} else {
			tok = newToken(token.ILLEGAL, l.ch)
		}
	}

	l.readChar()
	return tok
}
```

When writing this, I couldn't help but think about how it would look like in Rust. In an earlier project, I wrote a symbolic math library in rust that used an abstract syntax tree as its main data structure which had many methods similar to this one. I then wondered what this method would look like in rust.

```rust
impl Lexer {
    pub fn next_token(&mut self) -> Token {
        self.skip_whitespace();

        let tok = match self.ch {
            '=' => Token::Assign(self.ch),
            ';' => Token::Semicolon(self.ch),
            '-' => Token::Minus(self.ch),

            // --12 more cases--

            _ => {
                if self.is_digit(self.ch) {
                    return Token::Int(read_number())
                } else if self.is_letter(self.ch) {
                    return Token::lookup_ident(read_identifier())
            }
        };

        self.read_char();
        tok
    }
}
```

This looks much cleaner. The match statement allows us to express the method in fewer characters, but the use of enums (algebraic types) provide a large ergonomic experience than Go.

Go doesn't natively support enums. Any time when you normally would want to want an Enum, you usually just declare a `const` block in the relevant package and put whatever you need there.

```go
const (
	ASSIGN   = "="
	PLUS     = "+"
	MINUS    = "-"

    // --A bunch more things...--

	IF       = "IF"
	ELSE     = "ELSE"
	RETURN   = "RETURN"
)

type TokenType string

type Token struct {
	Type    TokenType
	Literal string
}
```


What sucks is that instead of having an "enum" type with different variants bound to it, you have a series of constants instead which are bound to the package they are declared in. That means that you can't declare a special namespace for any enum unless you make a package specifically for that enum. The "enum" types `token.ASSIGN`, etc will share the same namespace as every single struct, function, types, and variables that are in that package. 

A larger thing to be desired is the lack of exhaustive matching for any case statements and also the lack of binding methods to the enum itself, along with the lack of enum types containing state. Because of the last point, we need to have a Token struct to contain the literal instead of having that in the enum itself. The lack of enum methods limits our expressiveness, and thus terseness of the program, while the lack of exhaustive search limits some benefits of static analysis.

In Rust, we'd have something like:

```rust
enum Token {
    Assign(char),
    Plus(char),
    Minus(char),
    Semicolon(char),

    // --A bunch more things...--

    If(string),
    Else(string),
    Return(string),
}
```

with methods like `Token::lookup_indent()` returning the correct identifier or illegal token if invalid.

All this might seem somewhat pedantic, but being able to express code with better tools increases the ergonomics of the language. It *feels* good to write code where algebraic types are perfect and *feels* bad when you don't have access to them.

One of Go's core selling features is its simplicity. I am a large fan of simple languages and find that death by expressiveness is very much a real thing. Metaprogramming is great for creating abstractions for library writers, but in my experience, it often makes it harder for the programmer to understand what is actually going on.

Enums and match statements however boost developer ergonomics while improving code readability and understandability in a code base. It is a pure ergonomic win with many additional benefits.

Then again, we have the code below. This is from my symbolic math crate. Enums and match allow me to express such a complicated method so densely, but perhaps the ability to do encourages one to do so instead of break it up into simpler parts and helper functions. Whether this is a win or not, it's up to you.

```rust
impl Expr {
    pub fn expand(&self) -> Expr {
        match self {
            Expr::Mul(lhs, rhs) => {
                let lhs = lhs.expand();
                let rhs = rhs.expand();
                match (&lhs, &rhs) {
                    // (a + b) * c -> a*c + b*c
                    (Expr::Add(a, b), c) | (c, Expr::Add(a, b)) => 
                        Expr::Add(Box::new(Expr::Mul(a.clone(), Box::new(c.clone()))),
                                  Box::new(Expr::Mul(b.clone(), Box::new(c.clone())))).expand(),
                    // c * (a - b) -> c*a - c*b
                    (Expr::Sub(a, b), c) | (c, Expr::Sub(a, b)) => 
                        Expr::Sub(Box::new(Expr::Mul(Box::new(c.clone()), a.clone())),
                                  Box::new(Expr::Mul(Box::new(c.clone()), b.clone()))).expand(),
                    _ => Expr::Mul(Box::new(lhs), Box::new(rhs)),
                }
            },
            Expr::Add(lhs, rhs) => Expr::Add(Box::new(lhs.expand()), Box::new(rhs.expand())),
            Expr::Sub(lhs, rhs) => Expr::Sub(Box::new(lhs.expand()), Box::new(rhs.expand())),
            Expr::Div(lhs, rhs) => Expr::Div(Box::new(lhs.expand()), Box::new(rhs.expand())),
            Expr::Pow(lhs, rhs) => Expr::Pow(Box::new(lhs.expand()), Box::new(rhs.expand())),
            _ => self.clone(),
        }
    }
}
```
