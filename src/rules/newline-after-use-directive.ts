import { createRule} from '../utils'

export default createRule<[], 'error'>({
	name: 'newline-after-use-directive',
	defaultOptions: [],
	meta: {
		type: 'suggestion',
		fixable: 'whitespace',
		docs: {
			description: 'ensure \'use client\' or \'use server\' directives are followed by a blank line',
			recommended: 'stylistic',
		},
		messages: {
			error: 'The directive \'{{ nodeValue }}\' should be followed by a blank line.',
		},
		schema: [],
	},
	create: (context) => {
		return {
			Literal: (node) => {
				if (node.value === 'use client' || node.value === 'use server') {
					const nextToken = context.sourceCode.getTokenAfter(node)
					if (nextToken) {
						const nextNextToken = context.sourceCode.getTokenAfter(nextToken, {
							includeComments: true,
						})

						if (nextNextToken && nextNextToken.loc.start.line - node.loc.end.line < 2) {
							context.report({
								node,
								messageId: 'error',
								data: {
									nodeValue: node.value,
								},
								fix: (fixer) => {
									const textAfterNode = context.sourceCode.text.slice(node.range[1], nextNextToken.range[0])
									const firstNewlineIndex = textAfterNode.indexOf('\n')

									if (firstNewlineIndex !== -1) {
										return fixer.replaceTextRange([node.range[1], nextNextToken.range[0]], '\n')
									}
									
									return null
								}
							})
						}
					}
				}
			}
		}
	},
})
