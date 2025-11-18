import type { Outline } from '@/workspace/project/outline'
import { Skeleton } from '../ui/skeleton'
import { Button } from '../ui/button'
import { ArrowRight, Edit } from 'lucide-react'
import EditOutlineDialog from './EditOutlineDialog'

type props = {
  loading: boolean,
  outline: Outline[],
  handleUpdateOutline: (index: string, value: Outline) => void
}
const OutlineSection = ({ loading, outline, handleUpdateOutline }: props) => {

  return (
    <div className='mt-7'>
      <h2 className='font-bold text-2xl'>Slider Outline</h2>
      {loading &&
        <div>
          {
            [1, 2, 3, 4].map((item, index) => (
              <Skeleton key={index} className='h-[60px] w-full rounded-2xl' />
            ))
          }
        </div>
      }
      <div className='mb-24'>
        {
          outline?.map((item, index) => (
            <div key={index} className='bg-white p-3 px-6 justify-between rounded-xl flex gap-6 items-center border mt-5'>
              <div className='flex gap-6 items-center'>
                <h2 className='font-bold text-2xl p-5 bg-gray-200 rounded-xl'>{index + 1}</h2>
                <div>
                  <h2 className='font-bold'>
                    {item.slidePoint}
                  </h2>
                  <p>{item.outline}</p>
                </div>
              </div>
              <EditOutlineDialog outlineData={item} onUpdate={handleUpdateOutline}>
                <Button variant={'ghost'} size={'icon-lg'}><Edit /></Button>
              </EditOutlineDialog>

            </div>
          ))
        }
      </div>
      <Button size={'lg'} className='fixed bottom-6 transform left-1/2 -translate-x-1/2'>
        Generate Slides <ArrowRight />
      </Button>
    </div>
  )
}

export default OutlineSection
