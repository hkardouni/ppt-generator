/* eslint-disable react-hooks/exhaustive-deps */
import SliderStyles from "@/components/custom/SliderStyles"
import { firebaseDb } from "../../../../config/FirebaseConfig"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


type Project = {
  userPrompt?: string,
  projectId?: string,
  noOfSlides?: string,
  createdBy?: string,
  createdAt?: string
}

const Outline = () => {

  const { projectId } = useParams()
  const [projecctDetail, setProjectDetail] = useState<Project>()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    projectId && GetProjectDetails()
  }, [projectId])

  const GetProjectDetails = async () => {
    const docRef = doc(firebaseDb, 'projects', projectId ?? '')
    const docSnap = await getDoc(docRef)

    if (!docSnap) {
      throw new Error('no Project found')
    }

    // console.log(docSnap.data())
    setProjectDetail(docSnap.data())
  }

  return (
    <div className="flex justify-center mt-20">
      <div className="max-w-3xl w-full">
        <h2 className="font-bold text-2xl">Setting and Slider Outline</h2>
        <SliderStyles />
      </div>
    </div>
  )
}

export default Outline
