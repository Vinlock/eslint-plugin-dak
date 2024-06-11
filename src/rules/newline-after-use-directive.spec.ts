import { ESLint } from 'eslint'
import { describe, it, expect } from 'vitest'
import * as dak from '../index'

const eslint = new ESLint({
	useEslintrc: false,
	overrideConfig: {
		plugins: ['dak'],
		rules: {
			'dak/newline-after-use-directive': 'error',
		},
	},
	plugins: {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		dak,
	},
})

describe('newline-after-use-directive', () => {
	it('should report an error when \'use client\' is not followed by a blank line', async () => {
		const results = await eslint.lintText('\'use client\'\nconsole.log(\'test\')')
		const errors = results[0].messages

		expect(errors).toHaveLength(1)
		expect(errors[0].message).toBe('The directive \'use client\' should be followed by a blank line.')
	})

	it('should report no error when \'use client\' is followed by a blank line', async () => {
		const results = await eslint.lintText('\'use client\'\n\nconsole.log(\'test\')')
		const errors = results[0].messages

		expect(errors).toHaveLength(0)
	})

	it('should report an error when \'use server\' is not followed by a blank line', async () => {
		const results = await eslint.lintText('\'use server\'\nconsole.log(\'test\')')
		const errors = results[0].messages

		expect(errors).toHaveLength(1)
		expect(errors[0].message).toBe('The directive \'use server\' should be followed by a blank line.')
	})

	it('should report no error when \'use server\' is followed by a blank line', async () => {
		const results = await eslint.lintText('\'use server\'\n\nconsole.log(\'test\')')
		const errors = results[0].messages

		expect(errors).toHaveLength(0)
	})
})
