System.config({
  "baseURL": "/rights-inspector",
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "any-http-reqwest": "npm:any-http-reqwest@0.1.1",
    "json": "github:systemjs/plugin-json@0.1.0",
    "moment": "github:moment/moment@2.9.0",
    "rx": "npm:rx@2.5.2",
    "theseus": "npm:theseus@0.5.0",
    "traceur": "github:jmcriffey/bower-traceur@0.0.87",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.87",
    "virtual-dom": "npm:virtual-dom@1.3.0",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:any-http-reqwest@0.1.1": {
      "reqwest": "github:ded/reqwest@1.1.5"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:error@4.4.0": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "camelize": "npm:camelize@1.0.0",
      "string-template": "npm:string-template@0.2.0",
      "xtend": "npm:xtend@4.0.0"
    },
    "npm:ev-store@7.0.0": {
      "individual": "npm:individual@3.0.0"
    },
    "npm:global@4.3.0": {
      "min-document": "npm:min-document@2.14.0",
      "process": "npm:process@0.5.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:min-document@2.14.0": {
      "dom-walk": "npm:dom-walk@0.1.1"
    },
    "npm:next-tick@0.2.2": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:rx@2.5.2": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:string-template@0.2.0": {
      "js-string-escape": "npm:js-string-escape@1.0.0"
    },
    "npm:theseus@0.4.0": {
      "uri-templates": "npm:uri-templates@0.1.7"
    },
    "npm:theseus@0.5.0": {
      "uri-templates": "npm:uri-templates@0.1.7"
    },
    "npm:uri-templates@0.1.7": {
      "path": "github:jspm/nodelibs-path@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:virtual-dom@1.3.0": {
      "browser-split": "npm:browser-split@0.0.1",
      "error": "npm:error@4.4.0",
      "ev-store": "npm:ev-store@7.0.0",
      "global": "npm:global@4.3.0",
      "is-object": "npm:is-object@1.0.1",
      "next-tick": "npm:next-tick@0.2.2",
      "x-is-array": "npm:x-is-array@0.1.0",
      "x-is-string": "npm:x-is-string@0.1.0"
    }
  }
});

