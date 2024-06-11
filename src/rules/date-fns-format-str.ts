import { isString } from 'remeda'
import { createRule } from '../utils'

const throwTokens = ['D', 'DD', 'YY', 'YYYY']

export default createRule({
  name: 'date-fns-format-str',
  defaultOptions: [],
  meta: {
    type: "problem",
    docs: {
      description: "Ensure usage of 'yyyy', 'dd', etc. instead of 'YYYY', 'DD', etc. for date formatting in date-fns functions.",
    },
    messages: {
      error: 'Use `{{ lowercaseToken }}` instead of `{{ token }}` (in `{{ format }}`) for formatting {{ subject }} to the input `{{ input }}`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md',
    },
    fixable: "code",
    schema: [],
  },
  create: (context) => {
    const dateFnsFunctions = new Set();

    return {
      // Track imports from `date-fns`
      ImportDeclaration(node) {
        if (node.source.value === 'date-fns') {
          node.specifiers.forEach(specifier => {
            dateFnsFunctions.add(specifier.local.name);
          });
        }
      },
      // Check function calls to ensure 'formatStr' parameter uses appropriate tokens
      CallExpression(node) {
        if (node.callee.type === 'Identifier') {
          const calleeName = node.callee.name
          if (dateFnsFunctions.has(calleeName) && node.arguments.length > 1 && node.arguments[1].type === 'Literal') {
            const formatStr = node.arguments[1].value
            if (isString(formatStr)) {
              let foundToken: string | null = null

              // Look for protected tokens in the format string
              for (const token of throwTokens) {
                const tokenRE = new RegExp(`\\b${token}\\b`);
                if (tokenRE.test(formatStr)) {
                  foundToken = token
                  break
                }
              }

              // Report if a protected token is found
              if (foundToken && node.arguments[0].type === 'Identifier') {
                context.report({
                  node: node.arguments[1],
                  messageId: 'error',
                  data: {
                    lowercaseToken: foundToken.toLowerCase(),
                    token: foundToken,
                    format: formatStr,
                    subject: foundToken[0] === 'Y' ? 'years' : 'days of the month',
                    input: node.arguments[0].name
                  },
                  fix: (fixer) => {
                    if (foundToken) {
                      const newFormat = formatStr.replace(new RegExp(`\\b${foundToken}\\b`, 'g'), foundToken.toLowerCase())

                      return fixer.replaceText(node.arguments[1], `"${newFormat}"`)
                    }

                    return null
                  },
                });
              }
            }
          }
        }
      },
    };
  },
})
