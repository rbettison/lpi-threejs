import { AnimalSelectedFieldsShallow, getAnimals } from "./server/service/AnimalsService";
import CanvasContextProvider from "./contexts/CanvasContextProvider";
import Information from "./components/Information";
import CanvasComponent from "./components/threeJS/CanvasComponent";

export default async function Home() {

  const animalsArr : AnimalSelectedFieldsShallow[] | null = await getAnimals();

  return (
    <div className="h-screen w-screen">
      <CanvasContextProvider>
            <div className="flex sm:flex-row flex-col max-h-screen">
                <div className="bg-gradient-to-b from-blue-200 to-green-200 sm:w-2/3 w-full h-[400px] sm:h-auto">
                    <CanvasComponent animalsArr={animalsArr} />
                </div>
                <div className="sm:w-1/3 w-full h-screen sm:h-1/2">
                    <Information />
                </div>
            </div>
        </CanvasContextProvider>
    </div>
  );
}
