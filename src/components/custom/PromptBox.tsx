import { ArrowUp, Loader2Icon, PlusIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "../ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc } from "firebase/firestore";
import { firebaseDb } from "@/config/FirebaseConfig";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
function PromptBox() {
  const [userInput, setUserInput] = useState<string>();
  const {user} = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [noOfSlider, setNoOfSlider] = useState<string>('4 to 6');
  const CreateAndSaveProject = async()=>{
    const projectId = uuidv4();
    setLoading(true)
    await setDoc(doc(firebaseDb, 'projects', projectId), {projectId:projectId, userInputPrompt:userInput, createdBy:user?.primaryEmailAddress?.emailAddress, createdAt:Date.now(), noOfSlider:noOfSlider});
    setLoading(false)
    navigate('/workspace/project/' + projectId + '/outline')
}

  return (
    <div className="w-full flex justify-center mt-28">
      <div className="flex flex-col items-center space-y-4 w-full max-w-2xl">
        <h2 className="font-bold text-3xl text-center">
          Describe your topic, we will design the slides!
        </h2>

        <p className="text-xl text-gray-500 text-center">
          Your design will be saved as a new project
        </p>

        <InputGroup>
          <InputGroupTextarea
            placeholder="Enter what kind of slide you want to create?"
            className="min-h-36"
            onChange={(event)=>setUserInput(event.target.value)}
          />

          <InputGroupAddon align="block-end">
            <InputGroupButton>
              <PlusIcon className="h-4 w-4" />
            </InputGroupButton>

            <Select onValueChange={(value) =>setNoOfSlider(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>No of slides</SelectLabel>
                  <SelectItem value="4 to 6">4-6 Sliders</SelectItem>
                  <SelectItem value="6 to 8">6-8 Sliders</SelectItem>
                  <SelectItem value="8 to 12">8-12 Sliders </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <InputGroupButton
                variant="default"
                className="rounded-full ml-auto"
                size="icon-sm"
                onClick={()=>CreateAndSaveProject()}
                disabled={!userInput}
                >
                {loading?<Loader2Icon className="animate-spin"/>:<ArrowUp className="h-4 w-4" />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}

export default PromptBox;

