import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useUser } from "@clerk/clerk-react"
import { firebaseDb } from "../../../config/FirebaseConfig"
import { doc, setDoc } from "firebase/firestore"
import { ArrowUpIcon, LoaderIcon } from "lucide-react"
import { useState } from "react"
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from "react-router-dom"
const PromptBox = () => {
    const [userInput, setUserInput] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [noOfSlides, setNoOfSlides] = useState<string>('4 to 6')
    const { user } = useUser()
    const navigate = useNavigate()
    const CreateAndSaveProject = async () => {
        const projectId = uuidv4()
        setLoading(true)
        await setDoc(doc(firebaseDb, 'projects', projectId), {
            projectId: projectId,
            userPrompt: userInput,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: Date.now(),
            noOfSlides
        })
        setLoading(false)
        navigate(`/workspace/project/${projectId}/outline`)
    }

    return (
        <div className='flex w-full items-center justify-center mt-28'>
            <div className='flex flex-col items-center justify-center space-y-4'>
                <h2 className='font-bold text-4xl'>
                    Describe your topic, we'll design slides!
                </h2>
                <p className='text-xl text-gray-500'>Your design will be saved as new project</p>

                <InputGroup>
                    <InputGroupTextarea
                        placeholder="what's in your mind?"
                        className="min-h-36"
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                    <InputGroupAddon align={'block-end'}>
                        <InputGroupButton>
                            <Select onValueChange={(value) => setNoOfSlides(value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select No. of Slides" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel> No. of Slides</SelectLabel>
                                        <SelectItem value="4 to 6">4-6 Slides</SelectItem>
                                        <SelectItem value="6 to 8">6-8 Slides</SelectItem>
                                        <SelectItem value="8 to 12">8-12 Slides</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </InputGroupButton>
                        <InputGroupButton
                            className="rounded-full ml-auto"
                            variant={'default'}
                            size={'icon-sm'}
                            onClick={() => CreateAndSaveProject()}
                            disabled={!userInput || loading}
                        >
                            {
                                loading ? <LoaderIcon className="animate-spin"/> : <ArrowUpIcon />
                            }
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </div>
    )
}

export default PromptBox
