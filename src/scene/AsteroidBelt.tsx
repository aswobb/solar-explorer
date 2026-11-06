import { roundDust } from './roundPointSprites'
import { useLayoutEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Color, Object3D, Vector3, type Group, type InstancedMesh, type MeshStandardMaterial, type PointsMaterial } from 'three'
import type { BodyId } from '../data/types'
import { qualitySettings, type Quality } from './quality'
import { asteroidBeltConfig, createBeltParticles, beltRotation } from './asteroidField'
export function AsteroidBelt({ quality, time, selectedId }: { quality: Quality; time: RefObject<number>; selectedId: BodyId | null }) {
  const { camera, scene } = useThree()
  const root = useRef<Group>(null)
  const instances = useRef<InstancedMesh>(null)
  const rockMaterial = useRef<MeshStandardMaterial>(null)
  const dustMaterial = useRef<PointsMaterial>(null)
  const position = useRef(new Vector3())
  const budget = qualitySettings[quality]
  const rocks = useMemo(() => createBeltParticles(budget.regionInstances), [budget.regionInstances])
  const dustCount = Math.floor(budget.regionPoints * asteroidBeltConfig.dustBudgetFraction)
  const dust = useMemo(() => {
    const particles = createBeltParticles(dustCount, asteroidBeltConfig.seed + 1)
    return new Float32Array(particles.flatMap(particle => [particle.x, particle.y, particle.z]))
  }, [dustCount])
  useLayoutEffect(() => {
    const mesh = instances.current
    if (!mesh) return
    const transform = new Object3D()
    const color = new Color()
    rocks.forEach((rock, i) => {
      transform.position.set(rock.x, rock.y, rock.z)
      transform.rotation.set(rock.spin, rock.spin * 0.7, rock.spin * 1.3)
      transform.scale.set(rock.scale, rock.scale * (0.5 + rock.shade * 0.4), rock.scale * (0.65 + rock.shade * 0.3))
      transform.updateMatrix()
      mesh.setMatrixAt(i, transform.matrix)
      mesh.setColorAt(i, color.setHSL(0.09, 0.08 + rock.shade * 0.15, 0.25 + rock.shade * 0.3))
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [rocks])
  useFrame(() => {
    if (root.current) root.current.rotation.y = beltRotation(time.current)
    const body = selectedId ? scene.getObjectByName(selectedId) : null
    const fade = body ? Math.min(1, Math.max(0.2, camera.position.distanceTo(body.getWorldPosition(position.current)) / 8)) : 1
    if (rockMaterial.current) rockMaterial.current.opacity = 0.85 * fade
    if (dustMaterial.current) dustMaterial.current.opacity = 0.34 * fade
  }, -1.5)
  return <group ref={root} name="asteroid-belt">
    <instancedMesh key={rocks.length} ref={instances} args={[undefined, undefined, rocks.length]} raycast={() => {}} name="belt-rocks">
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial ref={rockMaterial} roughness={1} metalness={0} transparent opacity={0.85} depthWrite={false} />
    </instancedMesh>
    <points key={dust.length} name="belt-dust" raycast={() => {}}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[dust, 3]} /></bufferGeometry>
      <pointsMaterial onBeforeCompile={roundDust} customProgramCacheKey={() => 'belt-round-dust-v1'} ref={dustMaterial} color="#b4a58e" size={0.065} sizeAttenuation transparent opacity={0.34} depthWrite={false} />
    </points>
  </group>
}
