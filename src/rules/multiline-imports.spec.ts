import { ESLint } from 'eslint'
import { describe, it, expect } from 'vitest'
import * as dak from '../index'

const eslint = new ESLint({
	useEslintrc: false,
	overrideConfig: {
		parser: '@typescript-eslint/parser',
		parserOptions: {
			ecmaVersion: 12,
			sourceType: 'module',
		},
		plugins: ['dak'],
		rules: {
			'dak/multiline-imports': 'error',
		},
	},
	plugins: {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		dak,
	},
})

describe('multiline-imports', () => {
	it('should report an error when import statement has too many imports and is not in multiline format', async () => {
		const results = await eslint.lintText('import { a, b, c, d } from \'test\'\n\nconsole.log(a, b, c, d)')
		const errors = results[0].messages

		expect(errors).toHaveLength(1)
		expect(errors[0].message).toBe('Import statement with many imports should be in multiline format.')
	})

	it('should report an error when import statement has too few imports and is in multiline format', async () => {
		const results = await eslint.lintText('import {\n\ta,\n} from \'test\'\n\nconsole.log(a)')
		const errors = results[0].messages

		expect(errors).toHaveLength(1)
		expect(errors[0].message).toBe('Import statement with few imports should be in single line format.')
	})
})
