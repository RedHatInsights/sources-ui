module.exports = {
  parser: "@babel/eslint-parser",
  env: {
  browser: true,
  es6: true,
  node: true
},
  settings: {
  react: {
  version: "17.0"
}
},
  extends: [
    'plugin:react-hooks/recommended',"plugin:prettier/recommended", "prettier", "eslint:recommended", "plugin:react/recommended", "plugin:storybook/recommended"],
  plugins: ["react", "i18next"],
  parserOptions: {
  ecmaVersion: 7,
  sourceType: "module"
},
  globals: {
  beforeAll: true,
  describe: true,
  expect: true,
  global: true,
  insights: false,
  it: true,
  mount: true,
  process: true,
  render: true,
  shallow: true,
  React: true
},
  rules: {
  "comma-dangle": 0,
  "comma-style": 2,
  camelcase: 0,
  curly: ["error", "all"],
  "dot-notation": 2,
  "eol-last": 2,
  eqeqeq: 2,
  "func-names": ["error", "never"],
  "key-spacing": 2,
  "keyword-spacing": 2,
  "linebreak-style": ["error", "unix"],
  "new-cap": 2,
  "no-bitwise": 2,
  "no-caller": 2,
  "no-console": 1,
  "no-mixed-spaces-and-tabs": 2,
  "no-multiple-empty-lines": ["error", {
  max: 1
}],
  "no-trailing-spaces": 2,
  "no-use-before-define": ["error", {
  functions: false
}],
  "no-undef": 2,
  "no-unused-vars": [2, {
  argsIgnorePattern: "^_",
  ignoreRestSiblings: true
}],
  "no-var": 2,
  "no-with": 2,
  "object-shorthand": 2,
  "one-var": ["error", "never"],
  "padding-line-between-statements": ["error", {
  blankLine: "always",
  prev: "block-like",
  next: "*"
}],
  "quote-props": ["error", "as-needed"],
  semi: ["error", "always"],
  "space-before-blocks": 2,
  "space-in-parens": 2,
  "space-infix-ops": 2,
  "space-unary-ops": ["error", {
  words: false,
  nonwords: false,
  overrides: {
  new: true
}
}],
  "vars-on-top": 2,
  "wrap-iife": 2,
  yoda: ["error", "never"],
  "react/jsx-wrap-multilines": 2,
  "sort-imports": [2, {
  ignoreDeclarationSort: true
}]
},
  overrides: [{
  files: ["**/*.ts", "**/*.tsx"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    'plugin:react-hooks/recommended',"plugin:@typescript-eslint/recommended"],
  rules: {
  "react/prop-types": "off"
}
}, {
  files: ["**/*.stories.@(ts|tsx|js|jsx|mjs)"],
  rules: {
  "import/no-anonymous-default-export": "off"
}
}, {
  files: ["src/**/*.{js,jsx}"],
  rules: {
    'react-hooks/exhaustive-deps': 'error',
  "i18next/no-literal-string": ["error", {
  mode: "jsx-only",
  words: {
  exclude: [/^alignItems[A-Z]/, /^spaceItems[A-Z]/, /^justifyContent[A-Z]/, /^flexWrap[A-Z]/, /^inset[A-Z]/, /^spacer[A-Z]/, /^gap[A-Z]/, /^flex_[0-9]+$/, /^flexDefault$/, /^flexNone$/, /^grow$/, /^shrink$/, /^noPadding$/, /^nowrap$/, /^compact$/, /^alignSelf[A-Z]/, /^100%$/, /^calc\(/, /^var\(/, /^\d+px$/, "locale", "defaultLocale", "titleIconVariant", "iconVariant", "placeholder", "eventKey", "serviceName", "validated", "rel", "role", "popperProps", "appendTo", "none", "polite", "off", /^right$/, /^left$/, /^center$/, /^top$/, /^bottom$/, /^danger$/, /^success$/, /^warning$/, /^info$/, /^default$/, /^pending$/, /^approved$/, /^denied$/, /^create$/, /^edit$/, /^cancel$/, /^_blank$/, /^noopener$/, /^hover$/, /^click$/, /^single$/, /^multiple$/, /^openshift$/, /^aws$/, /^azure$/, /^google$/, /^, $/, /^: $/, /^a$/, /^#$/, /^loading$/, /^empty$/, /^expanded$/, /^collapsed$/, /^selected$/, /^not selected$/, /^[A-Z][A-Za-z0-9]*:[A-Z][A-Za-z0-9]+$/, /^[0-9]+%$/, /^[0-9]{6,}$/, "Allow", "Deny", /^VisualEditor[0-9]+$/, /^#[0-9A-Fa-f]{3,8}$/, /^text$/, /^checkbox$/, /^radio$/, /^date$/, /^time$/, /^inset[A-Z0-9]/, /^pagination$/, /^small$/, /^vertical$/, /^2Col$/, /^3Col$/, /^pristine$/, /^validating$/, /^invalid$/, /^name$/, /^rhel$/, /^•+$/, /^https?:\/\//, /^pf-v6-u-[a-z0-9-]+$/, /^redhat-icon$/, /^\/apps\//, /^end$/, /^start$/, /^orange$/, /^green$/, /^blue$/, /^red$/, /^grey$/, /^purple$/, /^cyan$/]
},
  "jsx-attributes": {
  exclude: ["className", "styleName", "style", "type", "key", "id", "width", "height", "name", "href", "to", "path", "target", "variant", "component", "form", "fieldId", "filterId", "widgetId", "ouiaId", "data-testid", "testId", "autoFocus", "headingLevel", "size", "sx", "direction", "position", "align", "icon", "variantPrefix", "isCompact", "ouiaId.*", "locale", "defaultLocale", "aria-describedby", "aria-labelledby", "titleIconVariant", "iconVariant", "placeholder", "eventKey", "labelId", "serviceName", "sortableColumns", "validated", "rel", "role", "popperProps", "appendTo", "dataLabel", "expandId", "titleId", "apiPath", "data-ouia-component-id", "data-ouia-component-type", "aria-controls", "autoComplete", "breakpoint", "wrapModifier", "currency", "dateFormat", "validateOnMount", "noValidate", "scope", "module", "data-hcc-.*", "iconPosition", "color", "isCurrent", "spellCheck", "md", "sm", "lg", "xl", "xl2"]
},
  callees: {
  exclude: ["join", "includes", "openWizard", "setFilter", "stateDispatch", "debouncedFiltering", "prepareSourceTypeSelection", "prepareApplicationTypeSelection", "setSearch", "navigate", "dispatch", "onChange", "change", "bodyVariants"]
}
}]
},
  excludedFiles: ["src/test/**", "**/*.stories.*", "**/*.test.*", "**/__tests__/**"]
}]
};
