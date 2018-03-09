module.exports ={
    'extends': [
        // 'eslint'
        // 'eslint:recommended',
        // 'standard'
    ],
    'parserOptions': {
        // ECMAScript version: 3—8 (or 2015—2017), defaults to 5
        'ecmaVersion': 8,
        // Treat source files as ECMAScript modules, defaults to 'script'
        'sourceType': 'module',
        'ecmaFeatures': {
            // Enable object rest/spread properties: {...a, ...b}
            'experimentalObjectRestSpread': true,
            // Enable JSX
            'jsx': true
        }
    },
    // If you’re using Flow or experimental ECMAScript features
    // not supported by ESLint, enable babel-eslint parser
    'parser': 'babel-eslint',
    // Predefined sets of global variables
    'env': {
        'browser': true,
        'es6': true,
        'node': true,
        'amd': true,
        'mocha': true,
        'jasmine': true,
        'jest': true,
        'phantomjs': true,
        'jquery': true
    },
    'globals': {
        'console': false,
        'Materialize': false
    },
    "plugins": [
        "flowtype"
    ],
    'rules': {
        'indent': [ 'warn', 4 ],
        'semi': [ 'error', 'always' ],
        'array-bracket-spacing': [ 'error', 'always' ],
        'object-curly-spacing': [ 'error', 'always' ],
        'space-in-parens': [ 'error', 'always' ],
        'comma-style': [ 'error', 'last' ],
        'comma-dangle': [ 'error', 'only-multiline' ],
        'template-curly-spacing': [ 'error', 'always' ],
        'brace-style': [ 'error', 'stroustrup', { 'allowSingleLine': true } ],
        'no-trailing-spaces': [ 'error', { 'skipBlankLines': true } ],
        'no-new': [ 'off' ],
        "flowtype/boolean-style": [
            2,
            "boolean"
        ],
        "flowtype/define-flow-type": 1,
        "flowtype/delimiter-dangle": [
            2,
            "never"
        ],
        "flowtype/generic-spacing": [
            2,
            "never"
        ],
        "flowtype/no-primitive-constructor-types": 2,
        "flowtype/no-types-missing-file-annotation": 2,
        "flowtype/no-weak-types": [2, {
            "any": false,
            "Object": true,
            "Function": false
        }],
        "flowtype/object-type-delimiter": [
            2,
            "comma"
        ],
        "flowtype/require-parameter-type": 2,
        "flowtype/require-return-type": [
            2,
            "always",
            {
                "annotateUndefined": "never"
            }
        ],
        "flowtype/require-valid-file-annotation": 2,
        "flowtype/semi": [
            2,
            "always"
        ],
        "flowtype/space-after-type-colon": [
            2,
            "always"
        ],
        "flowtype/space-before-generic-bracket": [
            2,
            "never"
        ],
        "flowtype/space-before-type-colon": [
            2,
            "never"
        ],
        "flowtype/type-id-match": [
            2,
            "^([A-Z][a-z0-9]+)+Type$"
        ],
        "flowtype/union-intersection-spacing": [
            2,
            "always"
        ],
        "flowtype/use-flow-type": 1,
        "flowtype/valid-syntax": 1
    },
    "settings": {
        "flowtype": {
            "onlyFilesWithFlowAnnotation": true
        }
    }
};
