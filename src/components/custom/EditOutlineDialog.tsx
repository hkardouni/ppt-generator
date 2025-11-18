/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { useState } from "react"
import type { Outline } from "@/workspace/project/outline"
import { DialogClose } from "@radix-ui/react-dialog"
const EditOutlineDialog = ({ children, outlineData, onUpdate }: any) => {

  const [localData, setLocalData] = useState<Outline>(outlineData)
  const [openDialog, setOpenDialog] = useState(false)

  const handleChange = (title: string, value: string) => {
    setLocalData({ ...localData, [title]: value })
  }

  const handleUpdate = () => {
    onUpdate(outlineData?.slideNo, localData)
    setOpenDialog(false)
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Outline</DialogTitle>
          <DialogDescription className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label>Slider Title</label>
              <Input placeholder="Slider title"
                value={localData.slidePoint}
                onChange={(e) => handleChange('slidePoint', e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label className="mt-4">Outline</label>
              <Textarea placeholder="Outline"
                value={localData.outline}
                onChange={(e) => handleChange('outline', e.target.value)}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant={'outline'}>Close</Button>
          </DialogClose>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditOutlineDialog
