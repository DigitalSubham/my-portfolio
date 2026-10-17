const node = (tag, children, attrs = {}) => ({ tag, attrs, children: Array.isArray(children) ? children : [children] });
const p = (text) => node("p", text);
const h = (text) => node("h2", text);
const list = (...items) => node("ul", items.map((text) => node("li", text)));
const box = (text) => node("aside", [p(text)], { class: "warning" });
const table = (headers, rows) => node("table", [node("thead", node("tr", headers.map((v) => node("th", v, { scope: "col" })))), node("tbody", rows.map((row) => node("tr", row.map((v) => node("td", v)))))]);
const snippet = (language, text) => node("div", [p(`${language} - syntax fragment`), node("pre", node("code", text))]);
export const examples = [];
function ex(language, source, output, error = false) {
  const id = `example-${String(examples.length + 1).padStart(2, "0")}`;
  examples.push({ id, language, source, output, error });
  return node("section", [node("h3", `${language} - ${error ? "spot the compilation error" : "worked example"}`), node("pre", node("code", source)), p(error ? `Why it is rejected: ${output}` : "Output:"), ...(!error ? [node("pre", node("code", output))] : [])], { id });
}
const lesson = (key, title, summary, pages, content) => ({ key, title, summary, pages, content: [node("h1", title), p(summary), ...content] });

export const lessons = [
  lesson("refresh", "Start Here: Your Python and JavaScript Bridge", "Refresh what you already know, then attach the new syntax to familiar ideas. You do not need to become an expert in three languages before understanding OOP questions.", [1, 2, 3, 4], [
    h("One idea, several spellings"),
    p("Imagine a bank account. Its balance is state; deposit() is behavior; two accounts remain different objects even when both contain 100 rupees. A class describes the kind of object. Calling a method is often called sending a message to an object; it does not require a network."),
    table(["Idea", "Python", "JavaScript", "C++ / Java"], [["Current object", "self is an explicit parameter", "this depends on how a function is called", "this is supplied for instance member calls"], ["Object creation", "Account(100)", "new Account(100)", "C++: Account a(100); Java: new Account(100)"], ["Field access", "a.balance", "a.balance", "a.balance; C++ pointers also use ->"], ["Statement groups", "Indentation", "{ braces }", "{ braces }"], ["Type of an ordinary variable", "Name binds to an object", "Dynamically typed value", "Declared static type is checked before execution"]]),
    ex("python", `class Account:
    def __init__(self, balance):
        self.balance = balance
    def deposit(self, amount):
        self.balance += amount
a = Account(100)
b = a
b.deposit(20)
print(a.balance, a is b)`, "120 True"),
    p("Read it slowly: construct one account; bind both names to that same account; change it through b; read the changed value through a. Assignment did not copy an Account. You will contrast this with C++ value copying later."),
    ex("javascript", `class Account {
  constructor(balance) { this.balance = balance; }
  deposit(amount) { this.balance += amount; }
}
const a = new Account(100);
const b = a;
b.deposit(20);
console.log(a.balance, a === b);`, "120 true"),
    h("Procedural versus object-oriented"),
    p("Procedural code organizes work around functions: deposit(account, 20). OOP often puts the operation with the responsible object: account.deposit(20). Top-down and bottom-up are common design mnemonics, not rules enforced by a compiler. Both styles can be modular, reusable or badly designed."),
    box("Correction to source pages 1-2: OOP does not forbid overloading, and procedural programming does not automatically make a program insecure. Encapsulation is access/design control, not a cybersecurity guarantee. C++ supports procedural and object-oriented styles together."),
    list("Class = a type/blueprint; object = a particular instance.", "Encapsulation = keep state and responsible operations together with a controlled interface.", "Abstraction = expose the relevant contract and hide unnecessary detail.", "Inheritance = an appropriate is-a relationship; composition = a has-a relationship.", "Polymorphism = one operation/interface with different supported forms or implementations."),
    h("The language baseline"), p("Examples use C17, C++17, Java 17 and ordinary Python 3. These are explicit learning baselines, not a claim about an official exam's mandated version. Source questions that rely on a different era or unclear wording are flagged. Original assignment numbers and repeated questions are preserved."),
    p("Try before moving on: if two Python names point to the same list, does changing a list element through one name change what the other sees? Yes. If you reassign one name to a different list, the other still points to the old list."),
  ]),
  lesson("c-basics", "C Foundations: Read a Program Without Guessing", "C has no built-in class, inheritance or virtual keywords. Learn its typed variables, control flow, functions, arrays, pointers and structs first; these make C++ code far less intimidating.", [1], [
    h("Decode the skeleton"),
    ex("c", `#include <stdio.h>
int add(int a, int b) { return a + b; }
int main(void) {
    int total = add(2, 3);
    printf("%d\\n", total);
    return 0;
}`, "5"),
    p("#include makes a header's declarations available. int is an integer type. add returns an int and receives two int parameters. main is the program entry point. Braces group statements; most statements end with a semicolon. printf's %d placeholder prints an int. return 0 from main reports successful completion."),
    table(["Python idea", "C spelling", "Important difference"], [["x = 5", "int x = 5;", "The declared type constrains later values."], ["print(x)", "printf(\"%d\", x);", "The format must match the argument type."], ["and / or / not", "&& / || / !", "Built-in && and || short-circuit."], ["if x == 5:", "if (x == 5) { ... }", "= assigns; == compares."], ["for i in range(3)", "for (int i = 0; i < 3; i++)", "Initialization; condition; iteration."], ["List", "int a[3] = {1, 2, 3};", "A fixed array is not a Python dynamic list."]]),
    h("Pointers are addresses, not mysterious extra objects"),
    ex("c", `#include <stdio.h>
void add_one(int *p) { *p = *p + 1; }
int main(void) {
    int score = 7;
    add_one(&score);
    printf("%d\\n", score);
    return 0;
}`, "8"),
    p("&score means address of score. int *p declares a pointer to an int. In an expression, *p reads or writes the int at that address. C passes the pointer value by value; the function can still use that copied address to change the caller's int. It is not a C reference parameter."),
    h("Arrays, strings and structures"),
    p("An array's elements have one element type and occupy consecutive storage. Valid indexes for an array of length n are 0 through n-1; C does not automatically raise a Python-style IndexError. An ordinary C string ends with a null character '\\0'. strlen counts preceding characters, while sizeof on the actual array counts its storage including that terminator."),
    ex("c", `#include <stdio.h>
#include <string.h>
struct Student { int marks; };
int main(void) {
    struct Student s = {80};
    struct Student *p = &s;
    char word[] = "cat";
    printf("%d %d %zu %zu\\n", s.marks, p->marks, sizeof word, strlen(word));
    return 0;
}`, "80 80 4 3"),
    p("s.marks accesses a structure object; p->marks is shorthand for (*p).marks. A C struct can contain data, including function pointers, but C does not have C++-style member-function definitions inside the struct. C++ structs do have member functions."),
    h("Control-flow traps from Assignment 2"),
    list("A semicolon after for (...) creates an empty loop body. The next statement runs after the loop.", "for (;;) omits its condition and ordinarily loops until something exits it.", "continue skips the rest of the current iteration, then the loop continues with its iteration step.", "break exits the nearest loop or switch, not every enclosing construct.", "A switch case can fall through to the next case unless a break or another transfer stops it.", "goto transfers to a label in the same function; follow its path instead of pretending the loop continues.", "malloc/calloc allocate raw storage; free releases matching storage. They do not run C++ constructors or destructors.", "Scope tells where a name is visible; lifetime/storage duration tells when its object exists. These are related, not identical."),
    box("Never guess an output after reading an uninitialized value, accessing beyond an array, using freed storage or overflowing a signed int. A program can compile and still have undefined behavior. C is not 'C++ without a few keywords': compile a C example as C, not as C++."),
  ]),
  lesson("cpp-basics", "C++ Syntax, References and Expressions", "Learn the symbols that appear repeatedly in the MCQs: std::, cout, &, *, ->, references, sizeof, comma expressions and default arguments.", [3, 4, 36, 38], [
    ex("cpp", `#include <iostream>
int global_score = 10;
void increase(int& value) { value++; }
int main() {
    int score = 3;
    int& alias = score;
    int* pointer = &score;
    increase(alias);
    std::cout << score << " " << *pointer << " " << ::global_score << "\\n";
}`, "4 4 10"),
    p("std is a namespace: a named region that helps avoid clashes. :: selects a name from a scope. cout is an output-stream object; << inserts a value into it. using namespace std is a convenience in many source snippets, not a requirement. Writing std::cout keeps the origin explicit."),
    table(["Spelling", "Read it as", "Not the same as"], [["int* p = &x", "p holds x's address", "A copy of x's integer value"], ["int& r = x", "r is an alias for x", "A reseatable pointer variable"], ["*p", "The value reached through p", "Multiplication when used between operands"], ["obj.x / p->x", "Member through object / through pointer", "Scope resolution ::"], ["a = b", "Assignment", "Comparison a == b"], ["++x / x++", "Increment, then yield new / old value", "Permission to modify x repeatedly without sequencing"]]),
    p("A reference must be initialized and cannot be reseated. If int& r = x; then r = y assigns y's value into x; it does not make r an alias of y. Java's word 'reference' describes a different variable model and must not be mechanically substituted here."),
    h("Array and string sizes"),
    ex("cpp", `#include <iostream>
#include <cstring>
int main() {
    std::cout << sizeof("cat") << " " << std::strlen("cat ") << "\\n";
    int a[3] = {1, 2, 3};
    std::cout << sizeof(a) / sizeof(a[0]) << "\\n";
}`, "4 4\n3"),
    p("The literal cat contains three letters plus its null terminator, so sizeof is 4. The second string has a visible trailing space: strlen counts four characters and ignores only the terminator. For a real array, sizeof(a)/sizeof(a[0]) gives the element count; it does not work on a pointer parameter that used to receive an array."),
    h("Comma and short-circuit operators"),
    ex("cpp", `#include <iostream>
int main() {
    int x = 1, y = 1, z = 1;
    std::cout << (++x || ++y && ++z) << "\\n";
    std::cout << x << " " << y << " " << z << "\\n";
    std::cout << 1 + (1, 4, 5, 6, 3) << "\\n";
}`, "1\n2 1 1\n4"),
    p("The true left side of built-in || skips the entire right side, so y and z stay 1. The parenthesized comma expression yields its last value, 3; adding the outer 1 gives 4. Parentheses do not make arithmetic operands evaluate left to right in every other expression."),
    h("Default arguments"),
    snippet("cpp", "int sum(int x, int y = 0);\nsum(5);       // x=5, y=0\nsum(5, 2);    // x=5, y=2\n// sum(5, ,2) is invalid; you cannot leave a positional hole."),
    p("Defaults are used for omitted trailing arguments. They are not part of the overload signature. After a parameter has a default, later ordinary parameters need defaults available too. A declaration may provide defaults before the later definition, but you must not redundantly redefine them in the same scope."),
    box("sizeof is a language operator, not an ordinary runtime function. int and pointer sizes are not universally 4 bytes. When a question explicitly supplies a size/no-padding model, calculate within that model rather than copying your computer's output."),
  ]),
  lesson("java-basics", "Java Syntax and Reference Variables", "Read Java from the outside in: class, main, types, references, methods and access. Similar-looking C++ punctuation is not automatically valid Java.", [3, 4, 9, 15, 19, 43, 44], [
    ex("java", `public class Main {
    static class Account {
        private int balance;
        Account(int balance) { this.balance = balance; }
        void deposit(int amount) { balance += amount; }
        int getBalance() { return balance; }
    }
    public static void main(String[] args) {
        Account a = new Account(100);
        Account b = a;
        b.deposit(20);
        System.out.println(a.getBalance() + " " + (a == b));
    }
}`, "120 true"),
    p("The public class name Main matches Main.java. main is the entry point used here; static lets the runtime call it without first constructing a Main. void means no returned value. String[] args holds command-line strings. System.out.println prints and adds a newline."),
    p("Account a declares a reference variable; new Account(100) creates the object. b = a copies the reference, not the Account. a == b checks whether these references denote the same object. For value-style comparison, classes may define equals(); == does not automatically compare all fields."),
    table(["Common trap", "Correct Java rule"], [["private: int x;", "Wrong: write private int x; without a colon."], ["obj->field", "Wrong: ordinary Java reference member access uses a dot."], ["Class::method definition outside class", "Not the C++-style Java definition syntax; methods have their bodies inside the class declaration."], ["No access modifier means private", "Wrong: ordinary members default to package access."], ["Uninitialized fields and locals behave the same", "Fields get default values; local variables must be definitely assigned before use."], ["Java passes objects by reference", "Java passes argument values, including reference values, by value."], ["const and final are interchangeable", "Java has no usable const modifier; final stops reassignment, overriding or extension depending on context."]]),
    ex("java", `public class Main {
    static void replace(StringBuilder value) { value = new StringBuilder("new"); }
    static void append(StringBuilder value) { value.append("!"); }
    public static void main(String[] args) {
        StringBuilder text = new StringBuilder("old");
        replace(text);
        append(text);
        System.out.println(text);
    }
}`, "old!"),
    p("replace only reassigns its local copied reference. append uses that copied reference to mutate the shared object. This explains why pass-by-value and visible object mutation can both be true."),
    ex("java", `class Counter {
    private: int count = 0;
}`, "A colon cannot introduce a Java access section. Write private int count = 0;.", true),
    p("This last example mirrors the source assignment's Java error. Fixing the colon would make a valid class declaration, but a class without the chosen main entry point is not thereby a runnable application. Compile-time syntax errors and launch-time entry-point errors are separate stages."),
    h("Packages and inheritance"), p("A package groups related classes. Same-package access is not the same as protected. extends names one direct superclass; implements can list multiple interfaces. Importing a type makes its name available; it does not paste C/C++ header text into the file."),
  ]),
  lesson("classes", "Classes, Objects, Members and Nested Classes", "Turn the blueprint metaphor into concrete declarations. Separate a class definition, an object, a pointer/reference, and a method call.", [2, 3, 4, 13], [
    ex("cpp", `#include <iostream>
class Car {
    int year;
public:
    explicit Car(int value) : year(value) {}
    int getYear() const;
};
int Car::getYear() const { return year; }
int main() {
    Car first(2020), second(2022);
    Car* p = &second;
    std::cout << first.getYear() << " " << p->getYear() << "\\n";
}`, "2020 2022"),
    p("The class definition ends with a semicolon. year is a non-static field, so first and second each have their own year. getYear is declared inside the class and defined outside using Car::. private is the class default before public:. A method's code is not conceptually copied into every object."),
    p("An object has identity, state and behavior. It need not have a source-code name or represent a physical object. A class describes a type; sizeof(Car) is meaningful in C++, even before you create a Car variable. Instance size can include padding and base subobjects, not just a sum of fields."),
    h("Values versus handles"),
    table(["Expression", "What you get"], [["C++: Car b = a;", "A new Car initialized from a, subject to that class's copying rules."], ["C++: Car& b = a;", "Another name for the same Car."], ["C++: Car* b = &a;", "A pointer to that Car."], ["Java: Car b = a;", "A copied reference to the same Car."], ["Python / JS: b = a", "Another name/reference for the same object, not a deep copy."]]),
    h("An array of objects is several constructions"),
    p("C++ Car cars[3] creates three Car objects and therefore needs a suitable default initialization for each. An array of pointers is different: Car* cars[3] creates three pointer variables, not three Cars. In Java, new Car[3] creates an array initially containing null references; it does not run the Car constructor three times."),
    h("Nested classes are names inside other classes"),
    ex("cpp", `#include <iostream>
class Student {
    int marks = 80;
public:
    class Inspector {
    public:
        int read(const Student& s) const { return s.marks; }
    };
};
int main() {
    Student s;
    Student::Inspector inspector;
    std::cout << inspector.read(s) << "\\n";
}`, "80"),
    p("A C++ nested class has member access privileges to its enclosing class, but no automatic enclosing Student object. It still needs s to read s.marks. This does not require redundantly declaring the nested class as a friend. In Java, distinguish static nested classes from non-static inner classes; an inner instance is associated with an enclosing instance. In Python, writing a class inside another class does not automatically provide an outer self either."),
    box("Source corrections: an empty class is legal; a class need not have methods; C++ programs need not create user-defined class objects. Unnamed class objects have implicit special members as applicable. Java does not support C++'s out-of-class method definition syntax shown in the source's Java column."),
    p("Practice check: does defining class Student alone run a Student constructor? No. Does declaring Student* p alone create a Student? No. Does Student s create one? Yes, when execution reaches an appropriate object definition."),
  ]),
  lesson("constructors", "Constructors: Initialization, Defaults and Copies", "Follow object creation one step at a time. Learn what the compiler supplies, what it does not supply, and why a constructor is not an ordinary returning function.", [4, 5, 6, 7, 21], [
    p("A C++ or Java constructor has the class name and no return type, not even void. It initializes the new object. Storage allocation and initialization are separate ideas: a constructor does not by itself mean heap allocation. Constructors cannot be static, virtual or trailing-const member functions."),
    ex("cpp", `#include <iostream>
class Car {
    int price;
public:
    Car(int value = 0) : price(value) {}
    Car(const Car& other) : price(other.price) {}
    int getPrice() const { return price; }
};
int main() {
    Car a;
    Car b(500);
    Car c = b;
    std::cout << a.getPrice() << " " << b.getPrice() << " " << c.getPrice() << "\\n";
}`, "0 500 500"),
    p("a uses the default argument. b supplies 500. c is a new object initialized by the copy constructor. The initializer list after : initializes fields before the constructor body. Car(int value = 0) qualifies as a default constructor because it can be called with no arguments, even though it has a parameter."),
    h("Do not memorize 'exactly three'"),
    table(["Teaching category", "Meaning / caution"], [["Default", "Can be called with zero arguments; it may have parameters with defaults."], ["Parameterized", "Accepts supplied values; a common teaching label."], ["Copy", "Initializes from an existing same-type object, usually const T&."], ["Move (C++11 onward)", "Can transfer resources from an expiring object; typically T(T&&)."], ["Delegating / converting / explicit", "Other classifications exist; categories are not an exhaustive count of three."]]),
    p("If you declare a constructor, C++ does not automatically declare the ordinary no-argument default constructor just to keep Car a working. You can write Car() = default where appropriate. A compiler-declared constructor can be deleted when member/base rules make it unusable; 'declared' is not a guarantee of successful construction. Similarly, implicitly declared copy operations can be deleted, for example when an uncopyable member is present."),
    ex("cpp", `class Car { public: explicit Car(int) {} };
int main() { Car car; }`, "The class has a one-required-argument constructor and no usable zero-argument constructor.", true),
    h("C++ initialization spellings"),
    snippet("cpp", "Car a(500);       // direct-initialization\nCar b{500};       // direct-list-initialization\nCar c = a;        // copy-initialization from another Car\n// 'explicit' controls implicit conversions; it does not mean 'any call you wrote explicitly'."),
    h("Java constructors are not C++ special members"),
    ex("java", `public class Main {
    static class Car {
        int price;
        Car() { this(0); }
        Car(int price) { this.price = price; }
        Car(Car other) { this.price = other.price; }
    }
    public static void main(String[] args) {
        Car a = new Car(500);
        Car b = new Car(a);
        System.out.println(new Car().price + " " + b.price + " " + (a == b));
    }
}`, "0 500 false"),
    p("Java permits a user-written constructor taking another Car, commonly called a copy constructor by convention. It does not generate C++-style special copy semantics for you. It also has no default-argument syntax; constructor overloading/delegation serves many similar needs. If no constructor is declared, the compiler supplies a default constructor, subject to superclass-constructor rules."),
    h("Python refresher"), p("__new__ creates the instance; __init__ initializes an already-created instance and must return None. If you omit __init__, inherited behavior, including object.__init__, can still permit construction. Repeating def __init__ definitions does not create a C++ overload set: the later definition replaces the earlier class attribute."),
    box("The source says constructors cannot be inherited without stating an edition. C++11 and later support using Base::Base for inherited constructors; destructors are different. Java constructors are not inherited. Base-constructor execution still happens as part of constructing a derived object, even when you do not explicitly write the default base call."),
  ]),
  lesson("lifetime", "Memory, Destructors, Copying and Object Lifetime", "Separate the object's lifetime from the lifetime of a pointer variable. This prevents many of the most serious mistakes in the assignments.", [7, 8, 25, 29, 30], [
    table(["Kind", "Typical C++ example", "When cleanup happens"], [["Automatic storage", "Car a; inside a block", "Its destructor runs when its scope is exited normally or by unwinding."], ["Dynamic storage", "Car* p = new Car;", "The owner must arrange destruction/deallocation; the pointer's scope ending does not delete the Car."], ["Static storage", "A global object or suitable static object", "Lifetime follows static initialization/destruction rules, not each function call."], ["Non-owning handle", "Car& ref = a; / Car* p = &a;", "It does not independently own or extend every referenced object's lifetime."]]),
    ex("cpp", `#include <iostream>
struct Base1 { ~Base1() { std::cout << "Base1 "; } };
struct Base2 { ~Base2() { std::cout << "Base2 "; } };
struct Derived : Base1, Base2 { ~Derived() { std::cout << "Derived "; } };
int main() { Derived object; }`, "Derived Base2 Base1"),
    p("Construction builds bases before the derived body; destruction reverses the completed construction order. A destructor has the spelling ~Car(), no arguments and no return type. Under C++17 it is not overloaded and cannot be static or trailing-const. It need not always be public: access depends on the intended ownership design."),
    h("Deleting through a base needs the correct destructor rule"),
    ex("cpp", `#include <iostream>
struct Base {
    Base() { std::cout << "Base+ "; }
    virtual ~Base() { std::cout << "Base- "; }
};
struct Derived : Base {
    Derived() { std::cout << "Derived+ "; }
    ~Derived() override { std::cout << "Derived- "; }
};
int main() { Base* p = new Derived; delete p; }`, "Base+ Derived+ Derived- Base-"),
    box("Important source correction: several notes examples call delete through a base pointer without giving the base a virtual destructor. Do not copy that ownership pattern. In the ordinary C++17 delete model, deleting a derived object through such a base pointer is undefined behavior. The rewritten owning examples use a virtual base destructor or avoid base-pointer deletion."),
    list("new T pairs with delete; new T[n] pairs with delete[]. malloc/calloc pair with free.", "delete nullptr is safe; delete on an automatic object, a dangling pointer or the same allocation twice is not.", "An explicit destructor call ends the object's lifetime but does not itself deallocate the storage.", "A vector<T*> destroys its pointer elements, not automatically the pointed-to T objects. Prefer clear ownership, such as smart pointers.", "Static class fields are not repeated in each instance's sizeof. Padding and implementation details can affect size.", "A global int array is zero-initialized; an uninitialized automatic local int array is not automatically all zeros."),
    h("Shallow versus deep: a familiar Python example"),
    ex("python", `import copy
a = [[1]]
b = copy.copy(a)
c = copy.deepcopy(a)
b[0].append(2)
print(a, b, c)`, "[[1, 2]] [[1, 2]] [[1]]"),
    p("b is a new outer list, but its inner list is shared with a. c has a separately copied inner list. In a C++ class with an owning raw pointer, copying only the pointer can lead to unwanted sharing and double deletion; implement correct ownership/copy/move semantics or use library types such as std::vector that manage their own resources. A Java copy constructor likewise must decide which contained objects are copied."),
    h("Garbage collection is not timely resource cleanup"), p("Java has no C++ destructor; use try-with-resources and AutoCloseable for files/connections. Python del removes a binding, not necessarily the last reference; __del__ timing is not a portable block-exit cleanup guarantee. Use with for deterministic resource handling. In C++, RAII ties a resource-owning object's lifetime to cleanup."),
  ]),
  lesson("access", "Access Control: Keep the Language Label", "Learn exactly what public, private, protected and omitted modifiers mean. Do not transfer C++ defaults into Java or Python.", [9, 10, 14, 15, 19], [
    table(["Context", "Default / rule"], [["C++ class members", "Private until an access label changes it."], ["C++ struct members", "Public until an access label changes it."], ["C++ base-specifier in class / struct", "Default inheritance is private / public respectively."], ["Java ordinary member without modifier", "Package access, not private and not protected."], ["Java protected", "Same-package access plus constrained subclass access across packages."], ["Python _name", "Non-public convention, not an enforced protected modifier."], ["Python __name", "Name mangling to reduce accidental clashes, not an impenetrable private boundary."]]),
    ex("cpp", `#include <iostream>
class Base {
    int secret = 7;
protected:
    int score = 80;
public:
    int getSecret() const { return secret; }
};
class Child : public Base {
public:
    int getScore() const { return score; }
};
int main() {
    Child c;
    std::cout << c.getSecret() << " " << c.getScore() << "\\n";
}`, "7 80"),
    p("Child can use protected score but cannot ordinarily read Base::secret directly. main calls public getters instead of accessing either field. Private members still exist within the base subobject; 'not directly accessible' does not mean 'not present in memory'. Explicit C++ friendship can grant additional access."),
    h("C++ inheritance mode changes the exposed access"),
    table(["Base member", "public inheritance", "protected inheritance", "private inheritance"], [["public", "public", "protected", "private"], ["protected", "protected", "protected", "private"], ["private", "No ordinary direct derived access", "No ordinary direct derived access", "No ordinary direct derived access"]]),
    p("These modes are not Java syntax. They also do not rewrite the original base declaration globally; they govern access through the derived relationship. In C++, protected access has extra object-expression restrictions: a derived member cannot use an arbitrary unrelated Base object to bypass the rules."),
    ex("python", `class Example:
    def __init__(self):
        self._hint = 1
        self.__value = 2
e = Example()
print(e._hint, e._Example__value)`, "1 2"),
    p("The Python example demonstrates why the source's 'inaccessible outside' wording is too strong. Respect the public interface even when a language lets you reach internals. In Java, access to private members also has nested-class rules, so simplified tables should state their context rather than claiming universal security."),
    h("Quick self-check"), list("Does a C++ struct permit a private field? Yes: write private:.", "Does a Java field without public/private/protected become protected? No: ordinary package access.", "Does private inheritance grant access to private base fields? No.", "Can a C++ virtual member be private? Yes; access and overriding are separate questions."),
  ]),
  lesson("encapsulation", "Encapsulation and Abstraction, Without Confusing Them", "Use an account with a rule: its balance must not become negative. A getter/setter pair is not automatically a safe design; the operations must preserve the rule.", [11, 12, 13, 34, 35, 36], [
    p("Encapsulation groups state with the code responsible for maintaining it and provides a controlled interface. Abstraction is the useful view offered to a caller: withdraw(20), not the internal storage layout or validation algorithm. They cooperate, but they are not identical and neither is the same as inheritance or polymorphism."),
    ex("cpp", `#include <iostream>
class Account {
    int balance = 100;
public:
    bool withdraw(int amount) {
        if (amount < 0 || amount > balance) return false;
        balance -= amount;
        return true;
    }
    int getBalance() const { return balance; }
};
int main() {
    Account a;
    std::cout << a.withdraw(120) << " " << a.withdraw(20) << " " << a.getBalance() << "\\n";
}`, "0 1 80"),
    p("The first withdrawal fails and leaves 100 unchanged. The second succeeds, leaving 80. main does not need to know whether the private representation is an int, a ledger or something else, as long as the public behavior remains compatible. It cannot directly force balance to -500 through an ordinary field access."),
    h("Three source teaching categories"),
    list("Data/member-variable encapsulation: keep representation behind suitable access control and validated operations.", "Function encapsulation: keep helper logic private and expose a stable operation such as getSpeed().", "Class encapsulation: group the related state and operations as one unit; an internal helper type may be nested when that design makes sense."),
    p("A read-only interface can expose a getter without a public setter. A write-oriented operation may accept an update without revealing stored data. Neither pattern requires every field to receive mechanical getX/setX methods. Returning a writable raw pointer or mutable internal collection may undermine the intended boundary even when the field itself is private."),
    h("Abstraction is not restricted to abstract classes"),
    p("An ordinary concrete class, a function, a module or a library API can provide abstraction. An abstract class is one language mechanism for specifying incomplete/common behavior; the names are related but not interchangeable. A driver can use a brake pedal without learning hydraulic details, just as a caller can use withdraw without learning storage details."),
    table(["Question", "Useful answer"], [["What is grouped and who can access it?", "Encapsulation."], ["What must the caller know, and what can remain hidden?", "Abstraction."], ["Can related object types share a base contract?", "Inheritance / subtyping, when appropriate."], ["Can a shared operation choose different implementations?", "Polymorphism."], ["Can an internal representation change?", "Possibly, without changing compatible clients; not an unconditional promise that no other code changes."]]),
    box("Source corrections: encapsulation and abstraction are not 'the same feature'. Private does not mean encrypted or attack-proof. Global variables are not automatically a language violation; uncontrolled global mutable state is a design risk. Returning an address is not inherently a syntax error, but exposing writable private state can defeat the interface's purpose."),
    p("Try it: explain why public void setBalance(int x) { balance = x; } might still be a poor interface. If x can be negative, the setter destroys the invariant that encapsulation was supposed to protect."),
  ]),
  lesson("inheritance", "Inheritance Shapes, Access and the Diamond", "Separate three questions: the shape of the hierarchy, the accessibility of inherited operations, and which implementation a call selects.", [14, 15, 16, 17, 18, 19, 20, 21], [
    p("Use inheritance for a suitable is-a relationship: Car is a Vehicle. Use composition for has-a: Car has an Engine. Reuse can reduce duplication, testing effort and maintenance, but does not guarantee faster compilation or make every inheritance design appropriate."),
    table(["Shape", "Read the arrows"], [["Single", "A -> B: B has one direct base."], ["Multilevel", "A -> B -> C: a chain."], ["Multiple", "A and B -> C: one derived type has several direct bases."], ["Hierarchical", "A -> B and A -> C: several derived types share a base."], ["Hybrid", "A combination of shapes; a teaching classification, not a keyword."]]),
    ex("cpp", `#include <iostream>
struct Vehicle { void start() const { std::cout << "start "; } };
struct Car : public Vehicle { void reverse() const { std::cout << "reverse "; } };
struct Taxi : public Car { void book() const { std::cout << "book "; } };
int main() { Taxi t; t.start(); t.reverse(); t.book(); }`, "start reverse book"),
    p("Taxi reaches Vehicle through Car, so this is multilevel inheritance. There is no need for three independent copies of start's source code. Whether a method can be called still depends on access rules; whether a base-reference call selects an override depends on virtual dispatch."),
    h("Three languages, three spellings"),
    table(["C++", "Java", "Python"], [["class Car : public Vehicle", "class Car extends Vehicle", "class Car(Vehicle):"], ["Several direct base classes are allowed.", "One direct superclass, but several interfaces are allowed.", "Several direct bases are allowed; MRO matters."], ["Base constructors run before derived initialization/body.", "Superclass construction precedes ordinary subclass initialization.", "A child __init__ normally calls super().__init__ when parent initialization is required."]]),
    h("A real diamond needs a shared ancestor"),
    snippet("Hierarchy", "    A\n   / \\\n  B   C\n   \\ /\n    D"),
    p("Without virtual inheritance in this C++ shape, D normally contains two A subobjects, one through each path. virtual inheritance can share one A base subobject. It does not automatically resolve every conflict between two different overrides: D may still need to supply a unique final overrider or explicitly choose a qualified operation."),
    ex("cpp", `#include <iostream>
struct A { int value = 7; };
struct B : virtual A {};
struct C : virtual A {};
struct D : B, C {};
int main() { D d; d.value = 9; std::cout << d.value << "\\n"; }`, "9"),
    box("Correction to source page 17: modern Java interfaces can contain default implementations. Unrelated conflicting defaults may require an explicit overriding resolution; interfaces do not magically eliminate every ambiguity. In Python, C3 MRO orders lookup, but calling each initializer once also requires cooperative super() design, not merely drawing a diamond."),
    h("Base and derived handles"),
    p("A pointer/reference to an accessible unambiguous C++ base can refer to a derived object. The reverse conversion is not automatically safe: a standalone Vehicle is not necessarily a Car. In Java, a reference's declared type controls accessible operations, while an eligible overridden method can still dispatch using the actual object type."),
    p("A nested class is not a kind of inheritance. A member object such as Country country inside India is composition, not a second superclass. The source's Java hybrid example uses composition; describing it as literal multiple class inheritance would be wrong."),
    p("Memory aid: multiple = many parents; multilevel = many levels; hierarchical = many children. Single-level is a shape description, not a special category called 'runtime inheritance'."),
  ]),
  lesson("overloading", "Overloading: Pick by the Parameters", "Overloading chooses among several declarations with one name. Follow the argument types before thinking about the returned value.", [22, 23, 27], [
    ex("cpp", `#include <iostream>
int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }
int add(int a, int b, int c) { return a + b + c; }
int main() {
    std::cout << add(2, 3) << " " << add(2.5, 3.0) << " " << add(1, 2, 3) << "\\n";
}`, "5 5.5 6"),
    p("Two int arguments select the first overload; two doubles select the second; three ints select the third. Overloading is commonly called ad-hoc or compile-time polymorphism. Changing only a return type, parameter names, or default argument does not create a distinct C++ overload."),
    ex("cpp", `int f(int x) { return x; }
double f(int x) { return x; }
int main() { return f(1); }`, "Return type alone does not distinguish overloads with the same parameter list.", true),
    p("int f(int*) and int f(int[]) describe the same adjusted parameter type. A declaration may add a permitted default argument to the same function, rather than overload it. Overload sets can also become ambiguous: if f(int) and f(int, int = 0) are both candidates, f(1) does not have a unique best choice just because one declaration is shorter."),
    h("Operators are functions with restrictions"),
    ex("cpp", `#include <iostream>
struct Vec {
    int x;
    Vec operator+(const Vec& other) const { return {x + other.x}; }
};
int main() { Vec a{2}, b{3}; std::cout << (a + b).x << "\\n"; }`, "5"),
    p("The name operator+ connects + to a user-type operation. It does not alter 2 + 3, invent a new operator, change precedence/associativity or change the number of operands. Give operators sensible meaning; the source's suggestion that + can mean subtraction is a possibility, not a good default design."),
    table(["C++17 category", "Examples / rule"], [["Overloadable", "+, -, *, /, %, comparisons, <<, >>, &&, ||, [], (), ->, assignment and allocation operators, subject to restrictions."], ["Not overloadable", "., .*, ::, ?:, sizeof and typeid."], ["Must be non-static members in this baseline", "operator=, operator[], operator() and operator->."], ["Logical-operator caution", "Overloaded && and || do not keep the built-in short-circuit guarantee."]]),
    h("Java and Python comparison"),
    p("Java supports method and constructor overloading, but no user-defined operator-overload declarations. Its built-in string + is not permission to define arbitrary operator methods. Python supports operators through special methods such as __add__, but writing two def add methods does not create a C++/Java signature-based overload set. Defaults, *args and explicit dispatch are different techniques. JavaScript similarly does not create overloads merely by repeating a method name."),
    box("Correction: compile-time overloads are not distinguished solely by return type, despite the source's comparison table. Static C++/Java methods can be overloaded. Do not confuse 'static method' with 'cannot participate in any polymorphism'."),
  ]),
  lesson("dispatch", "Overriding, Virtual Calls and Name Hiding", "For every call, write down the handle's declared type, the actual object's type, and whether the operation is virtual. Those three facts solve most polymorphism output questions.", [24, 25, 26, 27, 28, 29], [
    ex("cpp", `#include <iostream>
struct Vehicle {
    void label() const { std::cout << "Vehicle label "; }
    virtual void start() const { std::cout << "Vehicle start "; }
    virtual ~Vehicle() = default;
};
struct Car : Vehicle {
    void label() const { std::cout << "Car label "; }
    void start() const override { std::cout << "Car start "; }
};
int main() {
    Car car;
    Vehicle& v = car;
    v.label();
    v.start();
    v.Vehicle::start();
}`, "Vehicle label Car start Vehicle start"),
    p("label is non-virtual, so the call through the Vehicle reference uses Vehicle::label. start is virtual and the actual object is Car, so the second call uses Car::start. Explicit Vehicle:: qualification in the third call suppresses virtual dispatch and deliberately calls the base version."),
    table(["Overloading", "Overriding / hiding"], [["Same name, different eligible parameter lists.", "An eligible virtual operation gets a derived final implementation."], ["Selected using static call information.", "A virtual call normally uses the actual object type at runtime."], ["Does not require inheritance.", "C++ non-virtual same-name members hide; they do not enable virtual dispatch."], ["Return type alone is insufficient.", "C++ signature, cv/ref qualifiers and permitted return-type rules matter."]]),
    p("Once a C++ function is virtual in the base, a matching derived override remains virtual without repeating virtual. Use override to ask the compiler to catch mismatches. A different parameter list can hide the inherited name rather than override it; using Base::f can restore base overloads to lookup when appropriate. Access control does not decide whether an override exists; a private virtual can be overridden."),
    ex("java", `public class Main {
    static class Vehicle { String start() { return "Vehicle"; } }
    static class Car extends Vehicle { @Override String start() { return "Car"; } }
    public static void main(String[] args) {
        Vehicle v = new Car();
        System.out.println(v.start());
    }
}`, "Car"),
    p("Ordinary overridable Java instance methods use dynamic dispatch without a virtual keyword. @Override checks your intention; it is not what activates dispatch. Static methods are hidden rather than overridden, private methods are not inherited overrides, and final prevents overriding. Return types may have permitted covariance; an override may not reduce access."),
    h("Slicing is not a base reference"),
    p("C++ Base b = derived creates a Base object by value, discarding the derived part for that new object. Base& b = derived does not slice: it refers to the original object. The source's C++ page-26 example omits virtual on display(), so a base-pointer call prints the base implementation even though the shared output caption claims the BMW result."),
    h("Construction and destruction are special phases"),
    p("A virtual call on the current object from a constructor/destructor dispatches within the class whose construction/destruction is active, not into an unavailable derived part. This is not the blanket rule 'all such calls are compile-time'. Compilers can optimize known targets in many places. Likewise 'runtime is always slower' is not a guaranteed performance law."),
    box("Do not use the word polymorphism to mean only virtual dispatch. Overloads/templates are compile-time forms; Python can use duck typing without an explicit common base class. The source's 'all polymorphism requires inheritance, virtual and references' claim is too broad."),
  ]),
  lesson("abstract", "Abstract Classes, Pure Virtuals and Interfaces", "An abstract type can define a contract without being directly constructible. An abstract base pointer is not an abstract base object.", [29, 30, 31, 32, 33, 34, 35, 36], [
    ex("cpp", `#include <iostream>
struct Shape {
    virtual int area() const = 0;
    virtual ~Shape() = default;
};
struct Square : Shape {
    int side;
    explicit Square(int s) : side(s) {}
    int area() const override { return side * side; }
};
int main() {
    Square square(3);
    Shape& shape = square;
    std::cout << shape.area() << "\\n";
}`, "9"),
    p("= 0 is the pure-specifier; it is not an assignment performed at runtime. Shape cannot be instantiated directly. A derived class may remain abstract instead of implementing area; a concrete Square must satisfy the pure virtual requirements before it can be instantiated. Shape* p is allowed because it creates only a pointer."),
    p("An abstract C++ class can have data, constructors, destructors and concrete methods. A pure virtual function may have an out-of-class definition while remaining pure; a pure virtual destructor must still be defined when its destruction is required. 'Pure' does not universally mean 'has no implementation anywhere'."),
    ex("java", `public class Main {
    interface Printable {
        void print();
        default String label() { return "Report"; }
    }
    static class Report implements Printable {
        public void print() { System.out.println(label()); }
    }
    public static void main(String[] args) { Printable p = new Report(); p.print(); }
}`, "Report"),
    p("A Java abstract class is declared abstract and can contain constructors, fields and concrete methods. An ordinary abstract method has no body. A subclass must either fulfill the inherited requirements or remain abstract. An interface is a separate reference type; ordinary abstract interface methods are public, and implementing methods must not reduce their visibility."),
    h("Interfaces can contain more than old textbooks suggest"),
    table(["Language", "Contract mechanism", "Important qualification"], [["C++", "Abstract base, often a pure interface-style class", "No interface keyword; the language does not forbid concrete/static members in such a class."], ["Java 17", "interface", "Can include abstract, default, static and private methods under the relevant rules; fields are public static final."], ["Python", "ABC / abstractmethod, or structural duck typing", "An ABC can include concrete implementations too; no interface keyword is required."]]),
    ex("python", `from abc import ABC, abstractmethod
class Shape(ABC):
    @abstractmethod
    def area(self):
        pass
class Square(Shape):
    def __init__(self, side):
        self.side = side
    def area(self):
        return self.side * self.side
print(Square(3).area())
try:
    Shape()
except TypeError:
    print("abstract")`, "9\nabstract"),
    p("abc supplies abstract-class machinery in Python. Merely writing an ordinary class with a pass method does not enforce the same instantiation restriction. Concrete classes may also support the same method by duck typing without explicitly inheriting Shape."),
    box("Source corrections: not every derived class must immediately implement all abstract operations; it may remain abstract. Modern Java interfaces can have implementations, and Python ABCs can have them too. Add a suitable virtual destructor before owning/deleting derived C++ objects through a base pointer."),
  ]),
  lesson("this-super", "this, self, super and Method Chaining", "Use the current object to resolve names, then distinguish a parent-qualified operation from a runtime virtual call.", [36, 37, 38], [
    ex("cpp", `#include <iostream>
class Counter {
    int value = 0;
public:
    Counter& set(int value) { this->value = value; return *this; }
    Counter& add(int amount) { value += amount; return *this; }
    int get() const { return value; }
};
int main() {
    Counter c;
    c.set(5).add(2).add(3);
    std::cout << c.get() << "\\n";
}`, "10"),
    p("In set, value alone names the parameter, while this->value selects the field. this is a pointer to the current object; *this is that object. Returning Counter& returns an alias rather than a fresh copy, enabling the next method call in the chain. A static member has no implicit current object and cannot use this."),
    table(["Task", "C++", "Java", "Python"], [["Current field", "this->x / (*this).x", "this.x", "self.x"], ["Return current object", "return *this; for a T& result", "return this;", "return self"], ["Parent constructor", "Child(...) : Base(...) { ... }", "super(...), under Java 17 constructor-invocation rules", "super().__init__(...)"], ["Chosen base method", "Base::method()", "super.method()", "super().method(), following the MRO"]]),
    ex("java", `public class Main {
    static class Parent {
        Parent() { System.out.print("Parent "); }
        String name() { return "parent"; }
    }
    static class Child extends Parent {
        Child() { super(); System.out.print("Child "); }
        @Override String name() { return super.name() + "+child"; }
    }
    public static void main(String[] args) { System.out.println(new Child().name()); }
}`, "Parent Child parent+child"),
    p("Java this(...) delegates to another constructor in the same class; super(...) invokes a superclass constructor. In the Java 17 baseline, an explicit constructor invocation goes first and this/super constructor invocation cannot both be placed as independent first calls. A superclass's accessible no-argument constructor is implicitly invoked when the applicable rules permit it."),
    h("Python super is not just 'the first parent'"),
    ex("python", `class A:
    def show(self):
        return "A"
class B(A):
    def show(self):
        return "B" + super().show()
class C(A):
    def show(self):
        return "C" + super().show()
class D(B, C):
    pass
print(D().show())`, "BCA"),
    p("For D, the method resolution order goes D, B, C, A, object. B's super call continues to C, not directly to the A written in B's declaration. This cooperative chain is why indiscriminately calling parent initializers by name can duplicate or skip work in more complex hierarchies."),
    box("self is a naming convention, not a Python keyword. Printing Java this through toString or printing a Python object representation is not a portable way to obtain a physical memory address. C++'s pointer output likewise should not be memorized as a fixed numeric result."),
  ]),
  lesson("static", "Static Members, Local Statics and Shared State", "The word static has several contexts. First ask whether it describes a local variable, a file-scope name, a class field, or a member function.", [40, 41, 42], [
    ex("cpp", `#include <iostream>
class Player {
    int id;
    static int nextId;
public:
    Player() : id(nextId++) {}
    int getId() const { return id; }
    static int next() { return nextId; }
};
int Player::nextId = 1;
int main() {
    Player a, b, c;
    std::cout << a.getId() << " " << b.getId() << " " << c.getId() << " " << Player::next() << "\\n";
}`, "1 2 3 4"),
    p("Each player owns an id field. There is one shared nextId for this class, not a separate counter per player. Static methods can be called using the class name if access permits. Declaring static inside the class and defining the member outside are different syntactic steps."),
    ex("cpp", `#include <iostream>
class Example {
    int value = 7;
public:
    static int read(const Example& e) { return e.value; }
};
int counter() { static int count = 0; return ++count; }
int main() {
    Example e;
    std::cout << Example::read(e) << " " << counter() << " " << counter() << "\\n";
}`, "7 1 2"),
    p("The static method has no this, yet it can access e.value through an explicit object with the class's access privilege. A local static count is initialized when its declaration is first reached as required and retains state across calls. It is not freshly reset for every call like an ordinary automatic local variable."),
    list("Static members remain subject to public/protected/private access; static does not mean 'accessible only inside the class'.", "C++17 inline static data members may be defined and initialized in the class; an outside definition is not universally required.", "A constructor can update shared static state, as the Player example demonstrates.", "A static member function may be overloaded, but cannot be virtual or trailing-const in C++17.", "File-scope static also has linkage implications; it is not a class membership declaration."),
    h("Java static initialization and nested types"),
    p("Java static fields and blocks participate in class initialization, not merely 'every time a class is loaded'. Initialization occurs on specified active uses and follows dependency/order rules. A static nested class does not require an enclosing instance. A top-level class cannot be declared static. Class methods do not have this and cannot implicitly access instance fields, but may use an explicitly supplied object."),
    h("Python class state and shadowing"),
    ex("python", `class Counter:
    count = 0
    def __init__(self):
        Counter.count += 1
    @staticmethod
    def add(a, b):
        return a + b
    @classmethod
    def total(cls):
        return cls.count
a = Counter()
b = Counter()
a.count = 99
print(a.count, b.count, Counter.total(), Counter.add(2, 3))`, "99 2 2 5"),
    p("Assigning a.count creates/shadows an instance attribute; it does not necessarily change Counter.count. @staticmethod receives neither self nor cls automatically. @classmethod receives the class, conventionally cls. Either kind of function can still work with an explicitly passed instance when its body chooses to do so."),
    box("The source's absolute 'static functions cannot access non-static members' needs the words 'directly through an implicit current object'. Likewise static does not automatically mean constant, immutable, private, or global."),
  ]),
  lesson("const-final", "const, final and Read-Only Views", "Read exactly what is protected: a value, a pointer, an object's observable state, a method override, or a class's inheritance. Similar words do different jobs.", [38, 42, 43, 44], [
    table(["C++ declaration", "Can pointer move?", "Can this access path change the int?"], [["const int* p / int const* p", "Yes", "No"], ["int* const p", "No", "Yes, if the int itself is mutable"], ["const int* const p", "No", "No"]]),
    ex("cpp", `#include <iostream>
int main() {
    int x = 10, y = 20;
    const int* view = &x;
    view = &y;
    int* const fixed = &x;
    *fixed = 15;
    std::cout << x << " " << *view << "\\n";
}`, "15 20"),
    p("const int* is a read-only access path; it does not prove that no other permitted alias can change the underlying int. int* const fixes the pointer value. A reference to const is spelled const int&; that const qualifies the referred-to int, not a separately cv-qualified reference object."),
    h("Trailing const and overload selection"),
    ex("cpp", `#include <iostream>
struct Test {
    void fun() { std::cout << "mutable "; }
    void fun() const { std::cout << "const "; }
};
int main() { Test a; const Test b; a.fun(); b.fun(); }`, "mutable const"),
    p("A const member operation promises not to change the object's non-mutable state through its implicit object; mutable members and shared/static state are important qualifications. A const object normally calls const-qualified members. By contrast, const int get() is about a return type, not about making get an observer. Top-level const on a returned scalar does not make a later independent int variable immutable."),
    h("C++ final is not Java final-variable syntax"),
    snippet("cpp", "struct Base { virtual void show() final {} };\nstruct Closed final {};\n// A later override of Base::show or inheritance from Closed is rejected."),
    p("C++ final follows the class name or the member-function declarator in these forms: struct Closed final and void show() final. Java instead writes final class Closed and final void show(). In either language, a final class cannot be extended and a final eligible method cannot be overridden; the placement differs."),
    ex("java", `public class Main {
    public static void main(String[] args) {
        final StringBuilder text = new StringBuilder("A");
        text.append("B");
        System.out.println(text);
    }
}`, "AB"),
    p("Java final prevents assigning text a different reference; it does not freeze the StringBuilder object. static final means a shared field whose assignment is restricted. Not every final field is a compile-time constant expression. A final parameter similarly prevents reassignment of the local parameter variable, not arbitrary mutation of a referenced object."),
    h("Python conventions and annotations"),
    p("UPPERCASE names conventionally identify constants. typing.Final and @typing.final communicate restrictions to type checkers; they are not general runtime immutability enforcement. A frozen dataclass rejects ordinary field rebinding, but mutable contained objects may still change; it is not automatic deep freezing. A Python 'constant function' is not a language feature corresponding to C++ trailing const."),
    box("Source corrections: C++ does support final classes. Java final references are not deep-immutable objects. C++ const member functions are not the same as Java final methods. Const parameters and const returns require type-specific reasoning, not the blanket rule 'the caller cannot modify anything'."),
  ]),
  lesson("templates", "Templates, Generics and Duck Typing", "Reuse an algorithm across types, but keep the three languages' mechanisms distinct. Generic does not mean every operation works on every possible type.", [23, 24], [
    ex("cpp", `#include <iostream>
template<class T>
T bigger(T a, T b) { return a > b ? a : b; }
template<class T>
struct Box { T value; };
int main() {
    Box<int> box{7};
    std::cout << bigger(2, 5) << " " << bigger(2.5, 1.5) << " " << box.value << "\\n";
}`, "5 2.5 7"),
    p("T is a type parameter. bigger<int> requires the comparison and return operations to be valid for int; another instantiation needs its own required operations. The compiler instantiates/checks the relevant forms. 'Works with any data type' really means with suitable types satisfying the code's requirements."),
    ex("java", `public class Main {
    static class Box<T> {
        T value;
        Box(T value) { this.value = value; }
    }
    public static void main(String[] args) {
        Box<Integer> box = new Box<>(7);
        System.out.println(box.value);
    }
}`, "7"),
    p("Java generic type arguments use reference types such as Integer rather than a primitive int in Box<int>. Generics provide compile-time checking and normally use type erasure; they are not simply C++ template code generation. Generic classes, methods and interfaces are all possible, but their bounds and runtime restrictions still matter."),
    ex("python", `def twice(value):
    return value + value
print(twice(3), twice("ha"))`, "6 haha"),
    p("Python's runtime operation supports these two inputs because each supports + suitably. A different input may raise TypeError. TypeVar and Generic can express relationships for static checking; ordinary Python type hints do not automatically enforce them at runtime. JavaScript code can similarly rely on dynamically available behavior, with its own coercion rules."),
    table(["Mechanism", "Selection/checking idea"], [["C++ templates", "Compile-time instantiation with required operations and substitution/overload rules."], ["Java generics", "Parameterized reference types with static checking and erasure-related rules."], ["Python duck typing", "Use the behavior supplied at runtime; explicit inheritance is not always needed."], ["C++ overloads", "Several functions with distinct signatures; not identical to one function template."]]),
    p("Revision check: a template class is not a final class or an abstract class just because it is generic. Genericity, instantiability and inheritance restrictions answer different questions."),
  ]),
  lesson("inline-friends", "Inline, Friend Functions and Friend Classes", "Keep performance hints separate from language permissions. inline does not mean 'must be faster', and friend does not mean 'a member of this class'.", [39, 40, 44, 45], [
    ex("cpp", `#include <iostream>
inline int countCalls() { static int count = 0; return ++count; }
inline int factorial(int n) { return n <= 1 ? 1 : n * factorial(n - 1); }
int main() { std::cout << countCalls() << " " << countCalls() << " " << factorial(4) << "\\n"; }`, "1 2 24"),
    p("This valid program deliberately combines inline with a static local and recursion. A compiler decides whether any machine-code call is expanded. The language's inline rules primarily permit suitable repeated definitions across translation units under the one-definition rules; they do not prohibit loops, switches or recursion. In the C++17 baseline, functions defined inside an ordinary class definition are implicitly inline, even if virtual."),
    p("Inlining a small hot operation may save call overhead and may duplicate code, but neither speedup nor size increase is guaranteed in every program. Excess expansion can hurt instruction-cache behavior. A macro is not the same thing: it performs preprocessing substitution and can have evaluation/type pitfalls. Java's JIT may inline methods without a source inline keyword. A Python lambda is a short function expression, not a guarantee of machine-code inlining; alternative runtimes/JIT tools have their own behavior."),
    h("Friend means explicitly granted access"),
    ex("cpp", `#include <iostream>
class Car {
    int code = 45;
    friend int inspect(const Car& car);
    friend class Inspector;
};
int inspect(const Car& car) { return car.code; }
class Inspector {
public:
    int read(const Car& car) const { return car.code; }
};
int main() { Car car; Inspector i; std::cout << inspect(car) << " " << i.read(car) << "\\n"; }`, "45 45"),
    p("Car grants permission. inspect remains a non-member and is called as inspect(car), not car.inspect(). Inspector's members get the specified access. The friend keyword belongs in the granting declaration, not again on an ordinary out-of-class definition or at the call site. Friend declarations may appear in any access section."),
    list("Friendship is not automatically reciprocal: Car trusting Inspector does not make Inspector trust Car.", "It is not transitive: a friend of your friend is not thereby your friend.", "It is not inherited as a general extra permission for every derived class.", "A member of another class can be specifically friended, subject to declaration rules.", "A non-member operator overload may be a friend; operators that must be members cannot become non-member overloads just by adding friend.", "Java/Python have no corresponding friend keyword. Package/protected access and Python conventions are different mechanisms, not exact replacements."),
    box("Source corrections: an inline function may contain static variables, loops or recursion and may be virtual. A static public method can be called outside its class. 'Friend functions cannot be virtual' needs the non-member qualification: a virtual member of one class can be granted friendship by a different class."),
  ]),
  lesson("exceptions", "Exceptions: Follow the Normal Path and Error Path", "The supplied syllabus lists exceptions but does not develop them into a full chapter. This added foundation fills that gap and explains the assignment questions.", [1], [
    p("A syntax error prevents successful translation. An exception is a runtime control-flow mechanism for a reported failure. Not every bug becomes an exception: C/C++ undefined behavior is not automatically caught by catch(...). A function may throw, handle selected failures, or let them propagate to a suitable enclosing handler."),
    ex("cpp", `#include <iostream>
#include <stdexcept>
int divide(int a, int b) {
    if (b == 0) throw std::invalid_argument("zero divisor");
    return a / b;
}
int main() {
    try {
        std::cout << "start ";
        int result = divide(10, 0);
        std::cout << result << " skipped ";
    } catch (const std::invalid_argument&) {
        std::cout << "caught ";
    }
    std::cout << "after\\n";
}`, "start caught after"),
    p("First print start. divide throws before returning. The remaining normal-path statements inside try are skipped. A matching handler prints caught, then execution continues after the handler. Catch handlers are tested in order; place specific types before more general ones. Stack unwinding destroys relevant completed automatic objects, helping RAII clean up."),
    ex("java", `public class Main {
    static int divide(int a, int b) {
        if (b == 0) throw new IllegalArgumentException("zero divisor");
        return a / b;
    }
    public static void main(String[] args) {
        try { System.out.println(divide(10, 0)); }
        catch (IllegalArgumentException e) { System.out.println("caught"); }
        finally { System.out.println("cleanup path"); }
    }
}`, "caught\ncleanup path"),
    p("Java checked exceptions have catch-or-declare rules; RuntimeException subclasses such as IllegalArgumentException are unchecked. throw actually raises an exception; throws declares possible propagation in a method signature. finally normally runs as control exits its try/catch, but it is not a promise against abrupt VM termination. Prefer try-with-resources for suitable resources."),
    ex("python", `try:
    raise ValueError("bad input")
except ValueError:
    print("caught")
finally:
    print("cleanup path")`, "caught\ncleanup path"),
    table(["C++ / Java", "Python", "Meaning"], [["try", "try", "Start the protected normal path."], ["throw", "raise", "Report an exception."], ["catch", "except", "Handle a matching failure."], ["RAII / try-with-resources", "with", "Structured resource management."], ["Java throws (not C++ syntax)", "No identical required declaration", "Java declaration of possible checked-exception propagation."]]),
    box("C has no built-in C++/Java-style try/throw/catch exception mechanism. Error return values and other C error-handling patterns are different tools. The assignment key saying that nothing belongs in try is incorrect: put the potentially throwing operation and dependent normal-path work there."),
  ]),
  lesson("tracing", "Output Questions: A Safe Step-by-Step Method", "Classify the program before calculating an output. A compiler error, undefined behavior, an implementation-specific assumption and a normal result are different answers.", [3, 4, 26, 27], [
    h("The six-pass checklist"),
    list("1. Identify language and version. private: means C++ access-section syntax, not Java.", "2. Check whether the code can compile: declarations, required arguments, abstract instantiation, access and entry-point rules.", "3. Check whether its executed path is well-defined: object lifetime, valid addresses, initialized reads, array bounds and sequencing.", "4. Record explicit assumptions such as 4-byte pointers or no padding. Do not add unstated ones.", "5. Make a tiny state table: statement, changed variables, selected function, printed text.", "6. Match the entire output, including spaces, trailing characters and newlines; then read the literal option text, especially D and E."),
    ex("cpp", `#include <iostream>
int main() {
    int i;
    for (i = 0; i < 3; i++);
    std::cout << "hello!" << i << "\\n";
}`, "hello!3"),
    table(["Stage", "State / output"], [["Loop begins", "i = 0; body is the empty semicolon."], ["After first / second / third iteration", "i becomes 1 / 2 / 3."], ["Condition fails", "3 < 3 is false."], ["After loop", "Print hello! once, then 3."]]),
    h("Undefined is not a secret numeric answer"),
    snippet("cpp", "x = x++ + ++x;          // unsequenced modifications: undefined behavior in C++17\n// If p and q alias the same int:\n*p = (*p) * --(*q);     // unsequenced read and modification: undefined behavior"),
    p("A particular compiler may happen to print a familiar number. That does not establish a language guarantee and is not the same as a documented implementation-defined choice. These snippets are not executed as output-verification examples. Break the operations into separately sequenced statements if a particular calculation is intended."),
    h("Rejected programs have no ordinary runtime output"),
    p("The source recursively calls main and uses int main(int x). Under the stated standard C++ baseline, the printed forms are not valid portable programs. Moving the body into an ordinary helper function can demonstrate the intended static-versus-automatic local distinction, but that corrected helper is a new example, not the original program's output."),
    ex("cpp", `#include <iostream>
void countDown() {
    static int i = 5;
    if (--i) { std::cout << i; countDown(); }
}
int main() { countDown(); }`, "4321"),
    h("Examples of corrections you should notice"),
    table(["Source item", "What careful reading changes"], [["Assignment 2 Q19 / Q62", "Unsequenced operations mean undefined behavior; do not memorize 870 or 'compiler dependent'."], ["Assignment 2 Q52", "The second string has a trailing space, so its strlen is 14, not 13."], ["Assignment 2 Q57", "The comma group yields 3, then the outer +1 makes 4."], ["Assignment 2 Q100", "Java rejects private:; a missing main is not the first problem."], ["Assignment 1 Q32 / Q33", "Several offered substantive answers are true; the original single key overlooks them."], ["Assignment 1 Q98 / missing Q99", "The const-overload question is printed as 98 but keyed as 99. No separate printed question 99 is invented."]]),
    box("Review-only questions are still part of the bank and retain original wording, options and source key. Their ambiguity is explained, but they do not contribute correct/wrong attempts, readiness or timed-test scoring. This protects revision from a flawed question rather than silently deleting it or teaching a false certainty."),
    h("Revision route"), p("First read the Python/JavaScript bridge, C basics, C++ basics and Java basics. Then study the concept chapters in order. Practise a small set, read each explanation, and return to the linked lesson when a rule is unfamiliar. For output traces, write the state table yourself before revealing the discussion."),
  ]),
];
