/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import OutlineSection from "@/components/custom/OutlineSection"
import { firebaseDb, GeminiAiModel } from "../../../../config/FirebaseConfig"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import type { Project } from "../outline"
import SliderFrame from "@/components/custom/SliderFrame"

const Editor = () => {
    const { projectId } = useParams()
    const [projectDetail, setProjectDetail] = useState<Project | null>(null)
    const [loading, setLoading] = useState(false)
    const [slides, setSlides] = useState<any[]>([])
    const [isSlidesGenerated, setIsSlidesGenerated] = useState<number>()

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
    <div class="w-[800px] h-[500px] relative overflow-hidden">
    Return ONLY the HTML code for the slide inside this div.
    </div>
    Also do not add any overlay : avoid this :
    <div class="absolute inset-0 bg-linear-to-br from-primary to-secondary opacity-20"></div>
    Just provide body content for 1 slider. Make sure all content, including images,stays within the main slide div and preserves the 16:9 ratio.
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
        if (projectDetail && !projectDetail?.slides?.length) {
            GenerateSlides()
        } else {
            setSlides(projectDetail?.slides || [])
        }
    }, [projectDetail])

    const GenerateSlides = async () => {
        // ensure we have an outline to generate from
        console.log("inside Generating")
        if (!projectDetail?.outline || projectDetail.outline.length === 0) return;

        console.log("Starting slide generation...")

        const outlineLength = projectDetail.outline.length;

        for (let i = 0; i < outlineLength && i < 5; i++) {
            const metaData = projectDetail.outline[i];
            const prompt = SLIDER_PROMPT
                .replace('{METADATA}', JSON.stringify(metaData))
                .replace('{DESIGN_STYLE}', projectDetail.designStyles?.designGuide ?? "")
                .replace('{COLORS_CODE}', JSON.stringify(projectDetail.designStyles?.colors || {}));

            console.log("Generating slide", i + 1)
            await GeminiSlideCall(prompt, i);
            console.log("Finished slide", i + 1)
        }
        console.log("All slides generated")
        setIsSlidesGenerated(Date.now())
    }
    const GeminiSlideCall = async (prompt: string, slideIndex: number) => {
        try {
            const session = await GeminiAiModel.connect()
            await session.send(prompt)

            let responseText = ''
            for await (const message of session.receive()) {
                if (message.type === 'serverContent') {
                    const parts = message.modelTurn?.parts
                    if (parts && parts.length > 0) {
                        responseText += parts.map(part => part.text).join('')

                        const finalText = responseText
                            .replace(/```html/g, '')
                            .replace(/```/g, '')
                            .trim()

                        setSlides((prev) => {
                            const updated = prev ? [...prev] : []
                            updated[slideIndex] = { code: finalText }
                            return updated
                        })
                    }

                    if (message.turnComplete) {
                        console.log("Slide", slideIndex + 1, "complete")
                        break
                    }
                }
            }
            session.close()
        } catch (err) {
            console.error("Error generating slide:", err)
        }
    }

    useEffect(() => {
        if (isSlidesGenerated) {
            SaveAllSlides()
        }
    }, [isSlidesGenerated])

    const SaveAllSlides = async () => {
        await setDoc(doc(firebaseDb, 'projects', projectId ?? ''), {
            slides: slides
        }, { merge: true })
    }

    const updateSliderCode = (updateSlideCode: string, index: number) => {
        setSlides((prev) => {
            const updated = prev ? [...prev] : []
            updated[index] = {
                ...updated[index],
                code: updateSlideCode
            }
            return updated
        })
        setIsSlidesGenerated(Date.now())
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
                        <SliderFrame slide={slide} key={index}
                            colors={projectDetail?.designStyles?.colors}
                            setUpdateSlider={(updateSlideCode: string) => updateSliderCode(updateSlideCode, index)}
                        />
                    ))
                }
            </div>
        </div>
    )
}
export default Editor
