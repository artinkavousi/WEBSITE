import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { Fn, Loop, float, mix, screenSize, time, vec2, vec3 } from 'three/tsl'

const motionBlur = Fn(() => {
  const uvAspect = screenAspectUV(screenSize).toVar()
  const direction = vec2(0.04, 0.0)
  const t = time.mul(0.6)

  const color = vec3(0.0).toVar()
  const weightSum = float(0.0).toVar()

  // @ts-ignore
  Loop({ start: 0, end: 8 }, ({ i }) => {
    const fi = float(i)
    const offset = uvAspect.add(direction.mul(fi.sub(4.0)))
    const weight = float(1.0).div(fi.sub(3.5).abs().add(1.0))
    const sample = mix(vec3(0.05, 0.08, 0.1), vec3(0.9, 0.4, 0.2), offset.y.mul(0.5).add(0.5)).mul(weight)
    const pulse = mix(vec3(0.2, 0.5, 0.9), vec3(0.8, 0.3, 0.9), offset.x.mul(0.5).add(0.5)).mul(weight.mul((t.sin().mul(0.5).add(0.5))))

    color.addAssign(sample.add(pulse))
    weightSum.addAssign(weight.mul(2.0))
  })

  color.divAssign(weightSum)

  return color
})

export default motionBlur
