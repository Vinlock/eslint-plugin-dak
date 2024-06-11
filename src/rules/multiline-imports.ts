import { createRule } from '../utils'

export default createRule<[{
	minimumImports: number
}], 'tooMany' | 'tooFew'>({
	name: 'multiline-imports',
	defaultOptions: [
		{
			minimumImports: 2,
		},
	],
	meta: {
		type: 'suggestion',
		fixable: 'code',
		messages: {
			tooMany: 'Import statement with many imports should be in multiline format.',
			tooFew: 'Import statement with few imports should be in single line format.',
		},
		docs: {
			description: 'enforce specific multiline or single line import statements',
		},
		schema: [
			{
				type: 'object',
				properties: {
					minimumImports: {
						type: 'number',
					},
				},
				additionalProperties: false,
			},
		],
	},
	create: (context, optionsWithDefault) => {
		return {
			ImportDeclaration: (node) => {
				const defaultSpecifier = node.specifiers.find((specifier) => {
					return specifier.type === 'ImportDefaultSpecifier'
				})
				const namedSpecifiers = node.specifiers.filter((specifier) => {
					return specifier.type === 'ImportSpecifier'
				})
				const hasDefaultImport = Boolean(defaultSpecifier)
				const importItemsText = namedSpecifiers.map((specifier) => {
					return context.sourceCode.getText(specifier)
				})

				const { minimumImports } = optionsWithDefault[0]

				if (importItemsText.length >= minimumImports) {
					const text = context.sourceCode.getText(node)
					const isMultiline = text.includes('\n')

					const textMatched = text.match(/\n/g)
					if (!isMultiline || textMatched && textMatched.length < importItemsText.length) {
						context.report({
							node,
							messageId: 'tooMany',
							fix: (fixer) => {
								const defaultImport = hasDefaultImport ? `${context.sourceCode.getText(defaultSpecifier)}, ` : ''
								const namedImports = importItemsText.join(',\n ')
								const multilineImport = `import ${defaultImport}{\n ${namedImports},\n} from '${node.source.value}'`

								return fixer.replaceText(node, multilineImport)
							},
						})
					}
				} else if (importItemsText.length > 0) {
					const text = context.sourceCode.getText(node)
					const isMultiline = text.includes('\n')

					if (isMultiline) {
						context.report({
							node,
							messageId: 'tooFew',
							fix: (fixer) => {
								const defaultImport = hasDefaultImport ? `${context.sourceCode.getText(defaultSpecifier)}, ` : ''
								const namedImports = importItemsText.join(', ')

								return fixer.replaceText(node, `import ${defaultImport}{ ${namedImports} } from '${node.source.value}'`)
							},
						})
					}
				}
			}
		}
	},
})
