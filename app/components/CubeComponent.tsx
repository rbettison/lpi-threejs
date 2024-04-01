'use client'
import { ThreeEvent, useFrame, useLoader} from "@react-three/fiber";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSpring, animated, config } from "@react-spring/three"
import { Color, InstancedMesh, Matrix4, Mesh, Object3D, RepeatWrapping, SRGBColorSpace, SphereGeometry, TextureLoader, Vector3 } from "three";
import { CameraControls } from "@react-three/drei";
import { data_import } from "@prisma/client";
import CanvasContext, { CanvasContextType } from "../contexts/CanvasContext";

export default function CubeComponent({datapoints} : {datapoints: data_import[]}) {

    const colorMap = useLoader(TextureLoader, 'Albedo.jpg')
    colorMap.wrapS = RepeatWrapping;
    colorMap.offset.x = 0.75;
    colorMap.colorSpace = SRGBColorSpace;
    const bumpMap = useLoader(TextureLoader, 'Bump.jpg')
    const myMesh = React.useRef<Mesh>(null!);
    const instancedMeshRef = React.useRef<InstancedMesh>(null!);
    const sphereRef = React.useRef<SphereGeometry>(null!);
    const [active, setActive] = useState(false);
    const [hover, setHover] = useState(-1);
    const {scale} = useSpring({ scale: active ? 1.5 : 1, config: config.molasses })
    const radius = 20;
    const translationRadiusVector = new Vector3(0, radius, 0);
    const zoomCameraDistance = new Vector3(0, radius + 5, 0);
    let matrix = new Matrix4();
    

    const {setAnimal, animal, setAnimalImage} = useContext(CanvasContext) as CanvasContextType;
    let dummy = new Object3D();
    const tempColor = new Color();

    const colorArray = useMemo(() => Float32Array.from(new Array(datapoints.length).fill(null).flatMap((_, i) => tempColor.setRGB(0,0,0).toArray())), [])

    const cameraControlsRef = React.useRef<CameraControls>(null!);

    useFrame(({clock}) => {

      datapoints.forEach((point, index) => {

        if(animal != point) {
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

      if(datapoints.indexOf(animal) > 0) {
        dummy.clear();
        let index = datapoints.indexOf(animal);
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
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
      if(instancedMeshRef.current.instanceColor!=null) {
        instancedMeshRef.current.instanceColor.needsUpdate = true;
      }
      
      instancedMeshRef.current.instanceColor?.addUpdateRange(0, datapoints.length);
      instancedMeshRef.current.geometry.attributes.color.needsUpdate = true
      
    })

    useEffect(() => {
      datapoints.forEach((point, index) => {
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

        <animated.mesh
          scale={scale} ref={myMesh} 
        >  
          <sphereGeometry ref={sphereRef} args={[radius, 64, 64]}>
          </sphereGeometry>
          <meshStandardMaterial map={colorMap} bumpMap={bumpMap} bumpScale={0.03} />
        </animated.mesh>

        <instancedMesh ref={instancedMeshRef} args={[undefined, undefined, datapoints.length]}
          onPointerMove={(event: ThreeEvent<PointerEvent>) => {
            event.stopPropagation();
            let hoverValue = event.instanceId === undefined ? -1 : event.instanceId;
            setHover(hoverValue);
          }}
          onClick={(event) => {
            let index = event.instanceId === undefined ? -1 : event.instanceId;

            let x = Math.PI * (Number(datapoints[index].latitude) - 90) / 180;
            let z = (Math.PI * Number(datapoints[index].longitude) / 180) ;

            const vector = new Vector3(0,0,0).add(zoomCameraDistance)
              .applyAxisAngle(new Vector3(1,0,0), x)
              .applyAxisAngle(new Vector3(0,1,0), z);
            
            cameraControlsRef.current.setLookAt(vector.x, vector.y, vector.z, 0,0,0, true);
            setAnimal(datapoints[index]);
            setAnimalImage("");
            fetch("/api/getAnimalPicture/" + datapoints[index].common_name).then(async (resp) => {
              let respJson = await resp.json();
              if(resp.ok) setAnimalImage(respJson.image);
            })
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