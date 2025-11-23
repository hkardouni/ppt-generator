/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import SliderStyles from "@/components/custom/SliderStyles"
import { firebaseDb, GeminiModel } from "../../../../config/FirebaseConfig"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { data, useParams } from "react-router-dom"
import OutlineSection from "@/components/custom/OutlineSection"
import type { TDesignStyle, Tslide } from "@/data/Types/TSlides"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2Icon } from "lucide-react"


const OUTLINE_PROMPT = `Generate a PowerPoint slide outline for the topic {userInput}".
Create {noOfSlides} slides in total.
Each slide should include a topic name a 2-line descriptive outline that clearly explains what content the will cover.
Include the following structure:
The first slide should be a Welcome screen.
The second slide should be an Agenda screen.
The final slide should be a Thank you screen.
Return the response only in JSON format, following this schema:
[
{
"slideNo": "",
"slidePoint": "",
"outline": ""
}
]`

const DUMMY_OUTLINE = [
  {
    "slideNo": "1",
    "slidePoint": "Welcome to 'sfgsdfgsdfg'",
    "outline": "Greetings and a warm welcome to our presentation on 'sfgsdfgsdfg'.\nWe'll explore the essence and implications of this fascinating topic today."
  },
  {
    "slideNo": "2",
    "slidePoint": "Today's Journey: Agenda",
    "outline": "We'll start by defining 'sfgsdfgsdfg' and its core concepts.\nThen, we'll delve into its applications and future outlook."
  },
  {
    "slideNo": "3",
    "slidePoint": "Demystifying 'sfgsdfgsdfg'",
    "outline": "This section will provide a clear definition and historical context of 'sfgsdfgsdfg'.\nWe'll break down its fundamental components and how it operates."
  },
  {
    "slideNo": "4",
    "slidePoint": "Applications and Future of 'sfgsdfgsdfg'",
    "outline": "Discover real-world examples and potential use cases where 'sfgsdfgsdfg' is impactful.\nWe'll also look at emerging trends and what the future holds for this domain."
  },
  {
    "slideNo": "5",
    "slidePoint": "Q&A and Thank You",
    "outline": "We invite you to ask any questions you may have about 'sfgsdfgsdfg'.\nThank you for your valuable time and participation today."
  }
]
export type Outline = {
  slideNo: string,
  slidePoint: string,
  outline: string
}

export type Project = {
  userPrompt?: string,
  projectId?: string,
  noOfSlides?: string,
  createdBy?: string,
  createdAt?: string,
  outline?: Outline[],
  slides?: Tslide[],
  designStyles?: TDesignStyle
}

const Outline = () => {

  const { projectId } = useParams()
  const [projecctDetail, setProjectDetail] = useState<Project>()
  const [loading, setLoading] = useState(false)
  const [updateDbLoading, setUpdateDbLoading] = useState(false)
  const [outline, setOutline] = useState<Outline[]>(DUMMY_OUTLINE)
  const [selectedStyle, setSelectedStyle] = useState<TDesignStyle>()

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

    if (!docSnap.data()?.outline) {
      // GenerateOutline(docSnap.data())
    }
  }

  const GenerateOutline = async (projectData?: Project) => {
    setLoading(true)
    // Provide a prompt that contains text
    const prompt = OUTLINE_PROMPT
      .replace('{userInput}', projectData?.userPrompt || '')
      .replace('{noOfSlides}', projectData?.noOfSlides || '4 to 6')

    // To generate text output, call generateContent with the text input
    const result = await GeminiModel.generateContent(prompt);

    const response = result.response;
    const text = response.text();

    console.log(text)
    const rawJson = text.replace('```json', '')
      .replace('```', '')

    const jsonData = JSON.parse(rawJson)
    setOutline(jsonData)
    setLoading(false)

  }

  const handleUpdateOutline = (index: string, value: Outline) => {
    setOutline((prev) =>
      prev.map((item) =>
        item.slideNo === index ? { ...item, ...value } : item
      )
    )
  }

  const onGenerateSlider = async () => {
    setUpdateDbLoading(true)
    //update db
    await setDoc(doc(firebaseDb, 'projects', projectId ?? ''), {
      designStyle: selectedStyle,
      outline: outline
    }, {
      merge: true
    })
    setUpdateDbLoading(false)

    // navigate to slider editor
  }

  return (
    <div className="flex justify-center mt-20">
      <div className="max-w-3xl w-full">
        <h2 className="font-bold text-2xl">Setting and Slider Outline</h2>
        <SliderStyles selectStyle={(value: TDesignStyle) => setSelectedStyle(value)} />
        <OutlineSection
          loading={loading}
          outline={outline ?? []}
          handleUpdateOutline={
            (index: string, value: Outline) =>
              handleUpdateOutline(index, value)
          }
        />
      </div>
      <Button size={'lg'}
      className='fixed bottom-6 transform left-1/2 -translate-x-1/2'
      onClick={onGenerateSlider}
      disabled={updateDbLoading || loading}
      >
        {
          updateDbLoading && <Loader2Icon className="animate-spin"/>
        }
        Generate Slides <ArrowRight />
      </Button>
    </div>
  )
}

export default Outline
