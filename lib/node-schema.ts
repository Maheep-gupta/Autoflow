export type ParamKind =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'selector'
  | 'condition'
  | 'method'
  | 'any'
  | 'arrayOrVariable'
  | 'stringOrRegex'

export interface ParamSpec {
  type: ParamKind
  optional?: boolean
  options?: string[]
}

export type NodeParamSchema = Record<string, ParamSpec>

export const TYPE_LABELS: Record<string, string> = {
  trigger: 'Trigger',
  action: 'Action',
  condition: 'Condition',
  goToUrl: 'Go To URL',
  goBack: 'Go Back',
  reloadPage: 'Reload Page',
  click: 'Click',
  typeText: 'Type Text',
  clearInput: 'Clear Input',
  selectOption: 'Select Option',
  check: 'Check',
  uncheck: 'Uncheck',
  hover: 'Hover',
  pressKey: 'Press Key',
  waitForElement: 'Wait For Element',
  waitForNavigation: 'Wait For Navigation',
  waitForTimeout: 'Wait For Timeout',
  waitForUrl: 'Wait For URL',
  getText: 'Get Text',
  getAttribute: 'Get Attribute',
  getElements: 'Get Elements',
  setVariable: 'Set Variable',
  getVariable: 'Get Variable',
  if: 'If',
  forEach: 'For Each',
  try: 'Try',
  catch: 'Catch',
  retry: 'Retry',
  executeScript: 'Execute Script',
  httpRequest: 'HTTP Request',
}

export const NODE_PARAM_SCHEMA: Record<string, NodeParamSchema> = {
  goToUrl: {
    url: { type: 'string' },
    headless: { type: 'boolean', optional: true },
    timeout: { type: 'number' },
  },
  goBack: {
    timeout: { type: 'number' },
  },
  reloadPage: {
    timeout: { type: 'number' },
  },
  click: {
    selector: { type: 'selector' },
    timeout: { type: 'number' },
    retry: { type: 'number' },
    waitAfter: { type: 'number' },
  },
  typeText: {
    selector: { type: 'selector' },
    value: { type: 'string' },
    clearBefore: { type: 'boolean' },
    delay: { type: 'number' },
    timeout: { type: 'number' },
    retry: { type: 'number' },
  },
  clearInput: {
    selector: { type: 'selector' },
    timeout: { type: 'number' },
  },
  selectOption: {
    selector: { type: 'selector' },
    value: { type: 'string' },
    timeout: { type: 'number' },
  },
  check: {
    selector: { type: 'selector' },
  },
  uncheck: {
    selector: { type: 'selector' },
  },
  hover: {
    selector: { type: 'selector' },
  },
  pressKey: {
    key: { type: 'string' },
  },
  waitForElement: {
    selector: { type: 'selector' },
    timeout: { type: 'number' },
  },
  waitForNavigation: {
    timeout: { type: 'number' },
  },
  waitForTimeout: {
    duration: { type: 'number' },
  },
  waitForUrl: {
    url: { type: 'stringOrRegex' },
    timeout: { type: 'number' },
  },
  getText: {
    selector: { type: 'selector' },
    saveAs: { type: 'string' },
  },
  getAttribute: {
    selector: { type: 'selector' },
    attribute: { type: 'string' },
    saveAs: { type: 'string' },
  },
  getElements: {
    selector: { type: 'selector' },
    saveAs: { type: 'string' },
  },
  setVariable: {
    name: { type: 'string' },
    value: { type: 'any' },
  },
  getVariable: {
    name: { type: 'string' },
    saveAs: { type: 'string' },
  },
  if: {
    condition: { type: 'condition' },
  },
  forEach: {
    list: { type: 'arrayOrVariable' },
    itemName: { type: 'string' },
  },
  try: {},
  catch: {},
  retry: {
    count: { type: 'number' },
  },
  executeScript: {
    script: { type: 'string' },
  },
  httpRequest: {
    url: { type: 'string' },
    method: { type: 'method', options: ['GET', 'POST', 'PUT', 'DELETE'] },
    headers: { type: 'object' },
    body: { type: 'object' },
    saveAs: { type: 'string' },
  },
}

export const getDefaultParamValue = (param: ParamSpec): any => {
  switch (param.type) {
    case 'string':
    case 'stringOrRegex':
    case 'arrayOrVariable':
    case 'any':
      return ''
    case 'number':
      return 0
    case 'boolean':
      return false
    case 'object':
      return {}
    case 'selector':
      return { primary: '', fallbacks: [''] }
    case 'condition':
      return { left: '', operator: '==', right: '' }
    case 'method':
      return param.options?.[0] || 'GET'
    default:
      return ''
  }
}

export const getDefaultParams = (type: string): Record<string, any> => {
  const schema = NODE_PARAM_SCHEMA[type]
  if (!schema) {
    return {}
  }

  const params: Record<string, any> = {}
  Object.entries(schema).forEach(([key, spec]) => {
    params[key] = getDefaultParamValue(spec)
  })
  return params
}

export const ensureNodeParams = (type: string, params: Record<string, any> = {}): Record<string, any> => {
  const schema = NODE_PARAM_SCHEMA[type]
  if (!schema) {
    return { ...params }
  }

  const result: Record<string, any> = {}

  Object.entries(schema).forEach(([key, spec]) => {
    if (params[key] !== undefined && params[key] !== null) {
      result[key] = params[key]
    } else {
      result[key] = getDefaultParamValue(spec)
    }
  })

  Object.entries(params).forEach(([key, value]) => {
    if (result[key] === undefined) {
      result[key] = value
    }
  })

  return result
}
