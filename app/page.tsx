import { data_import } from "@prisma/client";
import CanvasComponent from "./components/CanvasComponent";
import getTopAnimal, { AnimalSelectedFields, getAnimals } from "./server/service/AnimalsService";

export default async function Home() {

  const animalsArr : AnimalSelectedFields[] | null = await getAnimals();
  // const animalsArr : data_import[] = []
  // if(topAnimal != null) {
  //   animalsArr.push(topAnimal)
  // }

  return (
    <div className="h-screen w-screen">
      {/* {'top animal: ' + topAnimal?.common_name + 
        ", co-ordinates... long: " + topAnimal?.longitude + 
        " latt: " + topAnimal?.latitude + " loc: " + topAnimal?.location} */}
      <CanvasComponent datapoints={animalsArr}/>
    </div>
  );
}
