const childProcess = require('child_process');
const fs = require('fs');
const path = require('path')

class ConsoleHelper {
    static execute(command) {
        childProcess.execSync(command)
    }
}

class DirectoryHelper {

    static exists(path) {
        return fs.existsSync(path)
    }

    static remove(path, options = { recursive: true }) {
        fs.rmSync(path, options)
    }
}

class FileHelper {

    static read(path) {
        return fs.readFileSync(path)
    }

    static write(path, content) {
        fs.writeFileSync(path, content)
    }
}

async function main() {
    const buildDirectory = "build"
    if (DirectoryHelper.exists(buildDirectory)) {
        DirectoryHelper.remove(buildDirectory)
    }
    ConsoleHelper.execute("npx tsc")
    let packageData = JSON.parse(FileHelper.read("package.json"))

    /**
     * Modify the package.json for the typescript definition
     */
    definitionPackageData = Object.entries(packageData)
        .filter(([key, _value]) => !(["devDependencies", "peerDependencies", "peerDependenciesMeta"].includes(key)))
        .reduce((prev, value, _index) => ({ ...prev, [value[0]]: value[1] }), {});
    definitionPackageData["main"] = "index.d.ts"
    definitionPackageData["name"] = `@types/${packageData.name.replace("@", "")}`
    definitionPackageData["description"] = `Typescript definition of ${packageData.name}`
    definitionPackageData["scripts"] = {}
    definitionPackageData["dependencies"] = {}
    definitionPackageData["typeScriptVersion"] = "4.0"
    FileHelper.write(path.join(buildDirectory, "definition", "package.json"), JSON.stringify(definitionPackageData, undefined, "  "))

    /**
     * Modify the package.json for the library
     */
    sourcePackageData = Object.entries(packageData)
        .filter(([key, _value]) => !(["devDependencies"].includes(key)))
        .reduce((prev, value, _index) => ({ ...prev, [value[0]]: value[1] }), {});
    sourcePackageData["main"] = "index.js"
    sourcePackageData["scripts"] = {}
    FileHelper.write(path.join(buildDirectory, "library", "package.json"), JSON.stringify(sourcePackageData, undefined, "  "))
}

main()