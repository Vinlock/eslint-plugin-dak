import { recommended } from './configs/recommended'
import dateFnsFormatStr from './rules/date-fns-format-str'
import multilineImports from './rules/multiline-imports'
import newlineAfterUseDirective from './rules/newline-after-use-directive'

export const configs = {
    recommended,
}

export const rules = {
    'date-fns-format-str': dateFnsFormatStr,
    'multiline-imports': multilineImports,
    'newline-after-use-directive': newlineAfterUseDirective,
}
