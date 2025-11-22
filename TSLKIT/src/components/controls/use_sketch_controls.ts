import { useControls } from 'leva'
import { ControlSchema } from './types'

/**
 * Lightweight wrapper around Leva controls so sketches can opt into a schema-driven UI.
 * If no schema is provided, returns an empty object and leaves the panel empty.
 */
export const useSketchControls = (schema?: ControlSchema) => {
  const values = useControls(() => schema ?? {}, [schema])
  return values
}
