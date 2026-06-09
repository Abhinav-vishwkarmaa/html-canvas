import { useMemo } from 'react'
import useStore from '../store/useStore'
import { getBlockStyleObject } from '../utils/blockUtils'

export function useBlockStyles(block) {
  const previewMode = useStore((s) => s.previewMode)
  return useMemo(
    () => getBlockStyleObject(block.styles, previewMode),
    [block.styles, previewMode]
  )
}
