# VHDL Fomatter

Online VHDL formatter written in Typescript

[Try it here: https://g2384.github.io/VHDLFormatter/](https://g2384.github.io/VHDLFormatter/)

Build Status: [![Main Branch](https://github.com/g2384/VHDLFormatter/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/g2384/VHDLFormatter/actions/workflows/ci.yml)

---

## Run Locally

Simply download/clone this repository, and open the `index.html` file.

---

## Contribute

### Structure

- `index.html`: html + javascript. Collect settings from UI, call the beautify function, load/save/update cached settings.
- `main.ts`: typescript. Some code required by `index.html` are moved here.
- `VHDLFormatter.ts`: typescript. Define classes, format VHDL code
- `tests`: folder. Contain all test files
  - *.test.ts: typescript. Proper test files.
  - `VHDLFormatterUnitTests.ts`: typescript. Handcrafted, crude tests.
- `VHDLFiles`: vhdl. Contain complicated VHDL files which I don't want to lose.

### Develop

Use Visual Studio Code to open the repo folder.

### Run Tests

Tests must be run before each commit.

#### Run Unit/Integration Tests

1. open repo folder with Visua Studio Code
2. click `Run (Ctrl + Shift + D)`
3. select `Run Unit Tests` configuration
4. click `Start Debugging` button

#### Run Jest Tests

1. open repo folder with Visua Studio Code
2. click `Terminal` -> `Run Task...`
3. select `npm: test jest`
