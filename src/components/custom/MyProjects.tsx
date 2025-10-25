import React from 'react'
import { Button } from '../ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { ArrowUpRightIcon, FolderIcon } from 'lucide-react'

const MyProjects = () => {
    return (
        <div className='mt-5 mx-32'>
            {/* <div className='flex justify-between items-center'>
                <h2 className='font-bold text-2xl'>My Projects</h2>
                <Button>Create New Project</Button>
            </div> */}
            <div>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <FolderIcon />
                        </EmptyMedia>
                        <EmptyTitle>No Projects Yet</EmptyTitle>
                        <EmptyDescription>
                            You haven&apos;t created any projects yet. Get started by creating
                            your first project.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <div className="flex gap-2">
                            <Button>Create Project</Button>
                        </div>
                    </EmptyContent>
                    <Button
                        variant="link"
                        asChild
                        className="text-muted-foreground"
                        size="sm"
                    >
                        <a href="#">
                            Learn More <ArrowUpRightIcon />
                        </a>
                    </Button>
                </Empty>

            </div>
        </div>
    )
}

export default MyProjects
