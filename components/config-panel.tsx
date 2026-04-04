'use client'

import React, { useEffect, useState } from 'react'
import { Node } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { NODE_PARAM_SCHEMA, TYPE_LABELS, ensureNodeParams, ParamSpec } from '@/lib/node-schema'

interface ConfigPanelProps {
  node: Node
  onDelete: () => void
  onChange: (node: Node) => void
}

const formatFieldLabel = (key: string) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (char) => char.toUpperCase())

const getNodeTypeLabel = (type: string) => {
  return TYPE_LABELS[type] || type.charAt(0).toUpperCase() + type.slice(1)
}

const getSelectorValue = (value: any) => {
  if (!value || typeof value !== 'object') {
    return { primary: '', fallbacks: [''] }
  }

  return {
    primary: value.primary || '',
    fallbacks: Array.isArray(value.fallbacks)
      ? value.fallbacks
      : typeof value.fallbacks === 'string'
      ? value.fallbacks.split(',').map((item: string) => item.trim()).filter(Boolean)
      : [''],
  }
}

const formatObjectValue = (value: any) => {
  if (typeof value === 'string') {
    return value
  }

  try {
    return JSON.stringify(value || {}, null, 2)
  } catch {
    return ''
  }
}

export function ConfigPanel({ node, onDelete, onChange }: ConfigPanelProps) {
  const [label, setLabel] = useState(node.data?.label || '')
  const [params, setParams] = useState<Record<string, any>>(
    ensureNodeParams(node.type || '', node.data?.params || {})
  )

  const schema = NODE_PARAM_SCHEMA[node.type || ''] || {}
  const entries = Object.entries(schema)

  useEffect(() => {
    setLabel(node.data?.label || '')
    setParams(ensureNodeParams(node.type || '', node.data?.params || {}))
  }, [node.id, node.type, node.data?.label, node.data?.params])

  const handleLabelChange = (value: string) => {
    setLabel(value)
    onChange({
      ...node,
      data: {
        ...node.data,
        label: value,
        params,
        onDelete: node.data?.onDelete,
      },
    })
  }

  const updateParam = (key: string, value: any) => {
    const nextParams = { ...params, [key]: value }
    setParams(nextParams)
    onChange({
      ...node,
      data: {
        ...node.data,
        label,
        params: nextParams,
        onDelete: node.data?.onDelete,
      },
    })
  }

  const renderField = (key: string, spec: ParamSpec) => {
    const value = params[key]
    const fieldLabel = formatFieldLabel(key)

    switch (spec.type) {
      case 'string':
      case 'stringOrRegex':
      case 'arrayOrVariable':
      case 'any':
        return (
          <div key={key} className="space-y-2">
            <label className="text-sm font-semibold block text-foreground">{fieldLabel}</label>
            <Input
              value={value ?? ''}
              onChange={(e) => updateParam(key, e.target.value)}
              placeholder={
                spec.type === 'arrayOrVariable'
                  ? 'Array name or variable reference'
                  : spec.type === 'stringOrRegex'
                  ? 'String or regex'
                  : 'Enter value'
              }
              className="text-sm"
            />
          </div>
        )
      case 'number':
        return (
          <div key={key} className="space-y-2">
            <label className="text-sm font-semibold block text-foreground">{fieldLabel}</label>
            <Input
              type="number"
              value={value ?? 0}
              onChange={(e) => updateParam(key, Number(e.target.value))}
              placeholder="Enter number"
              className="text-sm"
            />
          </div>
        )
      case 'boolean':
        return (
          <div key={key} className="flex items-center gap-3">
            <input
              id={`param-${key}`}
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => updateParam(key, e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor={`param-${key}`} className="text-sm font-semibold text-foreground">
              {fieldLabel}
            </label>
          </div>
        )
      case 'selector': {
        const selector = getSelectorValue(value)
        return (
          <div key={key} className="space-y-3 p-3 rounded-lg border border-border/50 bg-muted/50">
            <div className="space-y-2">
              <label className="text-sm font-semibold block text-foreground">{fieldLabel} • Primary</label>
              <Input
                value={selector.primary}
                onChange={(e) => updateParam(key, { ...selector, primary: e.target.value })}
                placeholder="Primary selector"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold block text-foreground">Fallback selectors</label>
              <Textarea
                value={(selector.fallbacks || []).join('\n')}
                onChange={(e) =>
                  updateParam(key, {
                    ...selector,
                    fallbacks: e.target.value
                      .split('\n')
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="One fallback per line"
                className="resize-none h-20 text-sm"
              />
            </div>
          </div>
        )
      }
      case 'condition':
        return (
          <div key={key} className="space-y-3 p-3 rounded-lg border border-border/50 bg-muted/50">
            <div className="space-y-2">
              <label className="text-sm font-semibold block text-foreground">Left</label>
              <Input
                value={value?.left ?? ''}
                onChange={(e) => updateParam(key, { ...value, left: e.target.value })}
                placeholder="Left operand"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold block text-foreground">Operator</label>
              <select
                value={value?.operator ?? '=='}
                onChange={(e) => updateParam(key, { ...value, operator: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
              >
                <option value="==">==</option>
                <option value="!=">!=</option>
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
                <option value="includes">includes</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold block text-foreground">Right</label>
              <Input
                value={value?.right ?? ''}
                onChange={(e) => updateParam(key, { ...value, right: e.target.value })}
                placeholder="Right operand"
                className="text-sm"
              />
            </div>
          </div>
        )
      case 'method':
        return (
          <div key={key} className="space-y-2">
            <label className="text-sm font-semibold block text-foreground">{fieldLabel}</label>
            <select
              value={value ?? spec.options?.[0] ?? 'GET'}
              onChange={(e) => updateParam(key, e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            >
              {(spec.options || ['GET', 'POST', 'PUT', 'DELETE']).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )
      case 'object':
        return (
          <div key={key} className="space-y-2">
            <label className="text-sm font-semibold block text-foreground">{fieldLabel}</label>
            <Textarea
              value={formatObjectValue(value)}
              onChange={(e) => {
                const raw = e.target.value
                try {
                  updateParam(key, JSON.parse(raw))
                } catch {
                  updateParam(key, raw)
                }
              }}
              placeholder="Enter JSON object"
              className="resize-none h-24 text-sm"
            />
          </div>
        )
      default:
        return (
          <div key={key} className="space-y-2">
            <label className="text-sm font-semibold block text-foreground">{fieldLabel}</label>
            <Input
              value={value ?? ''}
              onChange={(e) => updateParam(key, e.target.value)}
              placeholder="Enter value"
              className="text-sm"
            />
          </div>
        )
    }
  }

  return (
    <div className="p-4 space-y-5 h-full overflow-y-auto">
      <div className="pb-3 border-b border-border">
        <p className="text-xs font-bold text-primary uppercase tracking-wider">
          {getNodeTypeLabel(node.type || 'unknown')} Node
        </p>
        <p className="text-xs text-muted-foreground mt-1">Configure node settings</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold mb-2 block text-foreground">Node Name</label>
          <Input
            value={label}
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder="Enter node name"
            className="text-sm"
          />
        </div>

        {entries.length === 0 ? (
          <div className="rounded-lg border border-border/50 bg-muted/50 p-4 text-sm text-muted-foreground">
            This node has no configurable params.
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(([key, spec]) => renderField(key, spec as ParamSpec))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onDelete}
          className="inline-flex items-center justify-center rounded-md border border-border/50 bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive transition hover:bg-destructive/20"
        >
          Delete Node
        </button>
      </div>
    </div>
  )
}
