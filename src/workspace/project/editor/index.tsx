/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import OutlineSection from "@/components/custom/OutlineSection"
import { firebaseDb, GeminiAiModel } from "../../../../config/FirebaseConfig"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import type { Project } from "../outline"
import type { Tslide } from "@/data/Types/TSlides"
import SliderFrame from "@/components/custom/SliderFrame"

const Editor = () => {
    const { projectId } = useParams()
    const [projectDetail, setProjectDetail] = useState<Project | null>(null)
    const [loading, setLoading] = useState(false)
    const [slides, setSlides] = useState<any[]>([])

    const SLIDER_PROMPT = `Generate HTML (TailwindCSS + Flowbite UI + Lucide Icons)
    code for a 16:9 ppt slider in Modern Dark style.
    {DESIGN_STYLE}. No responsive design; use a fixed 16:9 layout for slides.
    Use Flowbite component structure. Use different layouts depending on
    content and style.
    Use TailwindCSS colors like primary, accent, grandients, background,
    etc., and include colors from {COLORS_CODE}.
    MetaData for Slider: {METADATA}
    - Ensure images are optimized to fit within their container div
    and do not overflow.
    - Use proper width/height constraints on images so they scale down
    if nedded to remain inside the slide.
    - Maintain 16:9 aspect ratio for all slides and all media.
    - Use CSS classes like 'object-cover' or 'object-contain' for images
    to prevent stretching or overflow.
    - Use grid or flex layouts to properly divide the slide so elements
    do not overlap.
    Generate Image if needed using:
    'https://ik.imagekit.io/ikmedia/ik-genimg-prompt-{imagePropmt}/{altImageName}.jpg'
    Replace {imagePrompt} with relevant image prompt and altImageName
    with a random image name.
    `

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        projectId && GetProjectDetails()
    }, [projectId])

    const GetProjectDetails = async () => {
        setLoading(true)
        const docRef = doc(firebaseDb, 'projects', projectId ?? '')
        const docSnap = await getDoc(docRef)

        if (!docSnap) {
            throw new Error('no Project found')
        }

        const data = docSnap.data() as Project | undefined

        console.log(data)

        setProjectDetail(data ?? null)
        setLoading(false)
        if (!docSnap.data()?.outline) {
            // GenerateOutline(docSnap.data())
        }

    }
    useEffect(() => {
        if (projectDetail && !projectDetail?.slides) {
            // GenerateSlides()
        }
    }, [projectDetail])

    const GenerateSlides = async () => {

        const prompt = SLIDER_PROMPT.replace('{DESIGN_STYLE}', projectDetail?.designStyles?.designGuide ?? '')
            .replace('{COLORS_CODE}', JSON.stringify(projectDetail?.designStyles?.colors))
            .replace('{METADATA}', JSON.stringify(projectDetail?.outline))
        const session = await GeminiAiModel.connect();

        session.send(prompt);

        // Collect text from model's turn
        let text = "";
        const messages = session.receive();
        for await (const message of messages) {
            switch (message.type) {
                case "serverContent":
                    if (message.turnComplete) {
                        console.log(text);
                    } else {
                        const parts = message.modelTurn?.parts;
                        if (parts) {
                            text += parts.map((part) => part.text).join("");
                            // console.log(text)
                            const finalText = text.replace('```html', '').replace('```', '')
                            setSlides((prev: any[] = []) => {
                                const updated = [...prev]
                                updated[0] = { code: finalText }
                                return updated
                            })
                        }
                    }
                    break;
                case "toolCall":
                    // Ignore
                    break;
                case "toolCallCancellation":
                // Ignore
            }
        }

    }
    return (
        <div className="grid grid-cols-5 p-10">
            <div className="col-span-2 h-screen overflow-auto">
                {/* Outlines */}
                <OutlineSection outline={projectDetail?.outline ?? []}
                    handleUpdateOutline={() => console.log()}
                    loading={loading}
                />
            </div>
            <div className="col-span-3">
                {/* slides */}
                {
                    slides.map((slide, index) => (
                        <SliderFrame slide={slide} key={index} colors={projectDetail?.designStyles?.colors}/>
                    ))
                }
            </div>
        </div>
    )
}

export default Editor
