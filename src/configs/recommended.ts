import { ESLint, Linter } from 'eslint'
import ConfigData = ESLint.ConfigData
import RulesRecord = Linter.RulesRecord

export const recommended: ConfigData<RulesRecord> = {
  rules: {
    'dak/date-fns-format-str': 'error',
    'dak/date-fns': 'error',
    'dak/multiline-imports': [
      'error',
      {
        minimumImports: 2,
      },
    ],
  }
}
