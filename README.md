# psjava

[![npm](https://img.shields.io/npm/v/@thiagodiogo/psjava/beta)](https://www.npmjs.com/package/@thiagodiogo/psjava)
[![CI](https://github.com/eipastel/psjava/actions/workflows/ci.yml/badge.svg)](https://github.com/eipastel/psjava/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@thiagodiogo/psjava)](./LICENSE)

Run `.psjava` files as scripts — plain Java on top of [JShell](https://docs.oracle.com/javase/9/jshell/), with zero ceremony.

There's no custom syntax and no transpilation: whatever is in the file is exactly what `jshell` runs. `psjava` only adds a small `print` helper to the session and strips the Windows BOM — nothing else touches your code.

## Install

```bash
npm install -g @thiagodiogo/psjava@beta
```

Requires a **JDK 11+** with `jshell` on your `PATH`. Verify your setup with `psjava doctor`.

## Usage

```bash
psjava example.psjava           # run the file
psjava example.psjava --debug   # run, and print the elapsed time at the end
psjava doctor                   # check that jshell is available
```

A `.psjava` file is just Java:

```java
var name = "world";
print("hello, " + name);
```

## The `print` helper

`psjava` defines a `print(...)` in the session before your code runs (still plain Java — your file stays untouched). It comes with overloads for `String`, `int[]`, and `List`:

```java
print("text");                       // text
print(new int[]{1, 2, 3});           // [1, 2, 3]
print(java.util.List.of("a", "b"));  // [a, b]
```

`System.out.println(...)` keeps working as usual.

## How it works

`psjava` reads your file, prepends the `print` overloads, and pipes the result straight into `jshell -s`. The only change made to your source is removing the Windows BOM, which `jshell` chokes on. That's it — plain Java into JShell.

## License

[MIT](./LICENSE)
