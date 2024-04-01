'use client'
import { ThreeEvent, useFrame, useLoader} from "@react-three/fiber";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { animated } from "@react-spring/three"
import { Color, InstancedMesh, Matrix4, Mesh, Object3D, RepeatWrapping, SRGBColorSpace, SphereGeometry, TextureLoader, Vector3 } from "three";
import { CameraControls } from "@react-three/drei";
import CanvasContext, { CanvasContextType } from "../contexts/CanvasContext";
import { AnimalSelectedFieldsShallow } from "../server/service/AnimalsService";

export default function CubeComponent({datapoints} : {datapoints: AnimalSelectedFieldsShallow[] | null}) {

    const colorMap = useLoader(TextureLoader, 'Albedo.jpg')
    colorMap.wrapS = RepeatWrapping;
    colorMap.offset.x = 0.75;
    colorMap.colorSpace = SRGBColorSpace;
    const bumpMap = useLoader(TextureLoader, 'Bump.jpg')
    const myMesh = React.useRef<Mesh>(null!);
    const instancedMeshRef = React.useRef<InstancedMesh>(null!);
    const sphereRef = React.useRef<SphereGeometry>(null!);
    const [hover, setHover] = useState(-1);
    const radius = 20;
    const translationRadiusVector = new Vector3(0, radius, 0);
    const zoomCameraDistance = new Vector3(0, radius + 5, 0);
    let matrix = new Matrix4();
    

    const {setAnimal, animal, setAnimalImage} = useContext(CanvasContext) as CanvasContextType;
    const [animalShallow, setAnimalShallow] = useState<AnimalSelectedFieldsShallow>(null!)
    let dummy = new Object3D();
    const tempColor = new Color();

    const colorArray = useMemo(() => Float32Array.from(new Array(datapoints?.length).fill(null).flatMap((_, i) => tempColor.setRGB(0,0,0).toArray())), [])

    const cameraControlsRef = React.useRef<CameraControls>(null!);

    useFrame(({clock}) => {

      datapoints?.forEach((point, index) => {

        if(animal===null || animal.id != point.id) {
          dummy.clear();
          instancedMeshRef.current.getMatrixAt(index, matrix);
          let position = new Vector3();

          position.setFromMatrixPosition(matrix);

          dummy.position.set(position.x, position.y, position.z);
          dummy.scale.set(1,1,1);
          dummy.lookAt(new Vector3(0,0,0))

          dummy.updateMatrix();

          point.system1 === 'Terrestrial' ? tempColor.setRGB(0, 1, 0.267) : tempColor.setRGB(0,1,1);

          instancedMeshRef.current.setColorAt(index, tempColor);

          instancedMeshRef.current.setMatrixAt(index, dummy.matrix);

        } else if(hover === index && hover > 0) {
          // tempColor.setRGB(10,10,10).toArray(colorArray, index * 3);
        }
      })
      instancedMeshRef.current.geometry.attributes.color.needsUpdate = true
      instancedMeshRef.current.instanceColor
     
      if(datapoints != undefined && animal != null && datapoints?.indexOf(animalShallow) > 0) {
        dummy.clear();
        let index = datapoints?.indexOf(animalShallow);
        if (index != undefined) {
          instancedMeshRef.current.getMatrixAt(index, matrix);
          let position = new Vector3();
    
          position.setFromMatrixPosition(matrix);
          let vector = new Vector3(position.x, position.y, position.z);
          dummy.position.set(vector.x, vector.y, vector.z);
          dummy.lookAt(new Vector3(0,0,0))
    
          dummy.rotateOnAxis(new Vector3(0, 0, 1), clock.elapsedTime);
          dummy.scale.set(3,3,3); 
          dummy.matrix.makeScale(1,1,1);
          dummy.updateMatrix();

          // tempColor.setRGB(0.5, 0.2, 0.1);
          // instancedMeshRef.current.setColorAt(index, tempColor);
    
          instancedMeshRef.current.setMatrixAt(index, dummy.matrix);
        }
      }
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
      if(instancedMeshRef.current.instanceColor!=null) {
        instancedMeshRef.current.instanceColor.needsUpdate = true;
      }
      if(datapoints!=null) instancedMeshRef.current.instanceColor?.addUpdateRange(0, datapoints.length);
      instancedMeshRef.current.geometry.attributes.color.needsUpdate = true
      
    })

    useEffect(() => {
      datapoints?.forEach((point, index) => {
        point.system1 === 'Terrestrial' ? tempColor.setRGB(0, 1, 0.267) : tempColor.setRGB(0,1,1);
        instancedMeshRef.current.setColorAt(index, tempColor);

        dummy.clear();
        let x = Math.PI * (Number(point.latitude) - 90) / 180;
        let z = (Math.PI * Number(point.longitude) / 180) ;

        let dummyPositionVector = new Vector3(0,0,0).add(translationRadiusVector)
          .applyAxisAngle(new Vector3(1,0,0), x)
          .applyAxisAngle(new Vector3(0,1,0), z);  
        dummy.position.set(dummyPositionVector.x, dummyPositionVector.y, dummyPositionVector.z);
        dummy.lookAt(new Vector3(0,0,0))
      
        dummy.updateMatrix();

        instancedMeshRef.current?.setMatrixAt(index, dummy.matrix);
        // instancedMeshRef.current?.setColorAt(index, new Color(Color.NAMES.azure));
      })
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
      instancedMeshRef.current.geometry.attributes.color.needsUpdate = true
      // instancedMeshRef.current.geometry.attributes.color.needsUpdate = true
      instancedMeshRef.current.computeBoundingSphere();
      if(instancedMeshRef.current.instanceColor!=null) {
        instancedMeshRef.current.instanceColor.needsUpdate = true;
      }

    }, [instancedMeshRef])

    return (
      <>
      <CameraControls 
        ref={cameraControlsRef}
        minDistance={21}
        maxDistance={50}
        />
        <ambientLight intensity={6} />

        <animated.mesh ref={myMesh}>  
          <sphereGeometry ref={sphereRef} args={[radius, 64, 64]}>
          </sphereGeometry>
          <meshStandardMaterial map={colorMap} bumpMap={bumpMap} bumpScale={0.03} />
        </animated.mesh>

        <instancedMesh ref={instancedMeshRef} args={[undefined, undefined, datapoints!=null ? datapoints.length : 0]}
          onPointerMove={(event: ThreeEvent<PointerEvent>) => {
            event.stopPropagation();
            let hoverValue = event.instanceId === undefined ? -1 : event.instanceId;
            setHover(hoverValue);
          }}
          onClick={(event) => {
            if(datapoints != null) {
              let index = event.instanceId === undefined ? -1 : event.instanceId;

              let x = Math.PI * (Number(datapoints[index].latitude) - 90) / 180;
              let z = (Math.PI * Number(datapoints[index].longitude) / 180) ;
  
              const vector = new Vector3(0,0,0).add(zoomCameraDistance)
                .applyAxisAngle(new Vector3(1,0,0), x)
                .applyAxisAngle(new Vector3(0,1,0), z);
              
              cameraControlsRef.current.setLookAt(vector.x, vector.y, vector.z, 0,0,0, true);

              fetch("/api/getAnimalFieldsDeep/" + datapoints[index].id).then(async (resp) => {
                let respJson = await resp.json();
                setAnimalImage("");
                if (resp.ok) {
                  setAnimal(respJson.animal);
                  setAnimalShallow(datapoints[index]);
                  fetch("/api/getAnimalPicture/" + respJson.animal.common_name).then(async (resp) => {
                    let respJson = await resp.json();
                    if(resp.ok) setAnimalImage(respJson.image);
                  })
                }
              })
            }
            
          }}
          onPointerLeave={(event) => {
            setHover(-1)
          }}
          >
            <boxGeometry args={[0.1,0.1,0.1]}>
              <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3, true, 1]} />
            </boxGeometry>
            <meshBasicMaterial  />
        </instancedMesh>
      </>
    )
}