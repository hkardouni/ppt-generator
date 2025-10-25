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
import { ArrowUpIcon } from "lucide-react"
const PromptBox = () => {
    return (
        <div className='flex w-full items-center justify-center mt-28'>
            <div className='flex flex-col items-center justify-center space-y-4'>
                <h2 className='font-bold text-4xl'>
                    Describe your topic, we'll design slides!
                </h2>
                <p className='text-xl text-gray-500'>Your design will be saved as new project</p>

                <InputGroup>
                    <InputGroupTextarea placeholder="what's in your mind?" className="min-h-36"/>
                    <InputGroupAddon align={'block-end'}>
                        <InputGroupButton>
                            <Select>
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
                        >
                        <ArrowUpIcon />
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </div>
    )
}

export default PromptBox
