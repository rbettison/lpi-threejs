'use client'
import { useFrame, useLoader} from "@react-three/fiber";
import React, { useContext, useEffect, useState } from "react";
import { useSpring, animated, config } from "@react-spring/three"
import { ConeGeometry, Euler, Mesh, MeshBasicMaterial, RepeatWrapping, SRGBColorSpace, SphereGeometry, TextureLoader, Vector2, Vector3 } from "three";
import { OrbitControls } from "@react-three/drei";
import { data_import } from "@prisma/client";
import CanvasContext, { CanvasContextType } from "../contexts/CanvasContext";

export default function CubeComponent({datapoints, longitude, latitude} : {datapoints: data_import[], longitude: number, latitude: number}) {

    const colorMap = useLoader(TextureLoader, 'Albedo.jpg')
    colorMap.wrapS = RepeatWrapping;
    colorMap.offset.x = 0.75;
    colorMap.colorSpace = SRGBColorSpace;
    const bumpMap = useLoader(TextureLoader, 'Bump.jpg')
    const myMesh = React.useRef<Mesh>(null!);
    const referenceMesh = React.useRef<Mesh>(null!);
    const sphereRef = React.useRef<SphereGeometry>(null!);
    const [active, setActive] = useState(false);
    const [hover, setHover] = useState(false);
    const {scale} = useSpring({ scale: active ? 1.5 : 1, config: config.molasses })
    const radius = 20;
    const translationRadiusVector = new Vector3(0, radius, 0);
    const markerRefs = React.useRef<Mesh[]>(null!);
    const {setAnimal} = useContext(CanvasContext) as CanvasContextType;

    useFrame(({clock}) => {
      let element = myMesh.current;
      // if(element!=null) {
      //   element.rotation.x = Math.sin(clock.getElapsedTime())
      // }
    })

    useEffect(() => {
      sphereRef.current.computeBoundingSphere();
      let radius = sphereRef.current.boundingSphere?.radius;
      radius = radius || 20;

      let v1 = new Vector3(0, radius, 0);

      let x3 = Math.PI * (latitude - 90) / 180;
      let z3 = (Math.PI * longitude / 180) ;
      console.log('x3: ' + x3 + ", z3: " + z3);
      referenceMesh.current.position.copy(myMesh.current.position).add(v1)
        .applyAxisAngle(new Vector3(1, 0, 0), x3)
        .applyAxisAngle(new Vector3(0,1,0), z3)

      referenceMesh.current.lookAt(new Vector3(0,0,0));

    }, [longitude, latitude])

    return (
      <>
      
      <OrbitControls />
        <ambientLight intensity={6} />
        {/* <directionalLight color={"#ffffff"} position={[-50, 0, 30]} intensity={1.8}/> */}

        <animated.mesh
          scale={scale} ref={myMesh} 
          // onClick={() => setActive(!active)}
          onPointerOver={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
        >  
          <sphereGeometry ref={sphereRef} args={[radius, 64, 64]}>
          </sphereGeometry>
          <meshStandardMaterial map={colorMap} bumpMap={bumpMap} bumpScale={0.03} />
        </animated.mesh>
        {
          datapoints.map((point) => {
            console.log('point: ' + JSON.stringify(point));
            const name = point.common_name;
            let x = Math.PI * (Number(point.latitude) - 90) / 180;
            let z = (Math.PI * Number(point.longitude) / 180) ;
            return <mesh position={new Vector3(0,0,0).add(translationRadiusVector)
                              .applyAxisAngle(new Vector3(1, 0, 0), x)
                              .applyAxisAngle(new Vector3(0,1,0), z)}
                          lookAt={() => {}}
                          onPointerOver={() => setAnimal(name)}
                          onPointerLeave={() => setAnimal("")}>
              <boxGeometry args={[0.5,0.5,0.5]} />
              <meshBasicMaterial color={"black"} />
            </mesh>
          })
        }
          <mesh ref={referenceMesh} >
          <boxGeometry args={[1,1,1]} />
            <meshBasicMaterial color={"yellow"} />
          </mesh>
        {/* <Environment preset="night" background/> */}
      </>
    )
}