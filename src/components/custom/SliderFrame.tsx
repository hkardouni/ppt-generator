import type { TColors } from "@/data/Types/TSlides"
import { firebaseDb, GeminiAiModel } from "./../../../config/FirebaseConfig"
import { doc, setDoc } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

type TProps = {
    slide: { code: string },
    colors?: TColors,
    setUpdateSlider: (code: string | undefined) => void
}

const HTML_DEFAULT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Presentation Builder</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {colorCodes},
                    backgroundImage: {
                        gradient: 'linear-gradienr(90deg, #6366F1 0%, #EC4899 100%)',
                    },
                },
            },
        }
    </script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
    <link rel="stylesheet" href="https://cdjs.cloudflare.com/ajax/libs/font-awsome/6.5.2/css/all.min.css"
    integrity="sha512-HtsOMqg+p0Bk3hPOB0j6K+qkgY1kQ1D2SmVwl/7GR5gkks5Ykuf9Mv3XW4sQmPZf3rMZz3ayPCz8N8z6+X3s0g=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />
    />
    
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css"/>
    <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

    <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
    <script src="https://unpkg.com/@popperjs/core@2"></script>
    <script src="https://unpkg.com/tippy.js@6"></script>
    
</head>
{code}
</html>`

const SliderFrame = ({ slide, colors, setUpdateSlider }: TProps) => {

    const { projectId } = useParams()
    const [cardPosition, setCardPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const [loading, setLoading] = useState(false)
    const FINAL_CODE = HTML_DEFAULT.replace('{code}', slide?.code)
        .replace('{colorCodes}', JSON.stringify(colors ?? {}))
    const selectedElRef = useRef<HTMLElement | null>(null);

    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (!iframeRef.current) return
        const iframe = iframeRef.current;
        const doc = iframeRef.current.contentDocument;

        if (!doc) return

        doc.open();
        doc.write(FINAL_CODE);
        doc.close();

        let hoverEL: HTMLElement | null = null;
        let selectedEL: HTMLElement | null = null;

        const handleMouseOver = (event: MouseEvent) => {
            if (selectedEL) return
            const target = event.target as HTMLElement;
            if (hoverEL && hoverEL !== target) hoverEL.style.outline = ""
            hoverEL = target;
            hoverEL.style.outline = "2px solid blue";
        };

        const handleMouseOut = () => {
            if (selectedEL) return
            if (hoverEL) {
                hoverEL.style.outline = "";
                hoverEL = null;
            }
        }

        const handleClick = (event: MouseEvent) => {
            event.preventDefault();
            const target = event.target as HTMLElement;
            if (selectedEL && selectedEL !== target) {
                (selectedEL as HTMLElement).style.outline = "";
                (selectedEL as Element).removeAttribute('contenteditable');
            }

            selectedEL = target
            selectedElRef.current = target;

            if (selectedEL && selectedEL !== target) {
                selectedEL.style.outline = "";
                selectedEL.removeAttribute('contenteditable');
            }

            selectedEL = target;
            selectedEL.style.outline = "2px solid blue";
            selectedEL.setAttribute('contenteditable', 'true');
            selectedEL.focus();

            console.log("Selected element:", selectedEL)

            const rect = target.getBoundingClientRect();
            const iframeRect = iframe.getBoundingClientRect();

            setCardPosition({
                x: iframeRect.left + rect.left + rect.width,
                y: iframeRect.top + rect.bottom
            })
        }

        const handleBlur = () => {
            if (selectedEL) {
                console.log("Final edited element:", selectedEL.outerHTML)
                const updatedSliderCode = iframe.contentDocument?.body?.innerHTML;
                console.log("Updated slider code:", updatedSliderCode)
                setUpdateSlider(updatedSliderCode)
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && selectedEL) {
                selectedEL.style.outline = "";
                selectedEL.removeAttribute('contenteditable');
                selectedEL.removeEventListener('blur', handleBlur);
                selectedEL = null;
            }
        }

        doc.addEventListener("DOMContentLoaded", () => {
            doc.body?.addEventListener("mouseover", handleMouseOver);
            doc.body?.addEventListener("mouseout", handleMouseOut);
            doc.body?.addEventListener("click", handleClick);
            doc.body?.addEventListener("keydown", handleKeyDown);
        })

        return () => {
            doc.body?.removeEventListener("mouseover", handleMouseOver);
            doc.body?.removeEventListener("mouseout", handleMouseOut);
            doc.body?.removeEventListener("click", handleClick);
            doc.body?.removeEventListener("keydown", handleKeyDown);
        }
    }, [slide?.code])

    const handleAiSectionChange = async (userAiPropmt: string) => {
        setLoading(true)
        const selectedEl = selectedElRef.current;
        const iframe = iframeRef.current;
        if (!iframe || !selectedEl) return;

        const oldHTML = selectedEl.outerHTML;
        const prompt = `
        Regenerate or rewrite the following HTML code based on the user instruction.
        If user askked to change the image/regenerate the image then make sure to use ImageKit:
        'https://ik.imagekit.io/ikmedia/ik-genimg-prompt-{imagePropmt}/{altImageName}.jpg'
        Replace {imagePrompt} with relevant image prompt and altImageName with a random image name.
        if user want to crop image or remove background or scale image or optimize image then add imagekit ai transformation
        by providing ?tr=fo-auto,<other transformation> etc.
        "User Instruction is: ${userAiPropmt}"
        HTML code: ${oldHTML}
        `

        try {
            const typedModel = GeminiAiModel as unknown as {
                generateContent: (prompt: string) => Promise<{ response: { text: () => Promise<string> } }>
            };
            const result = await typedModel.generateContent(prompt);
            const newHTML = (await result.response.text()).trim();

            const tempDiv = iframe.contentDocument?.createElement('div');
            if (tempDiv) {
                tempDiv.innerHTML = newHTML;
                const newNode = tempDiv.firstElementChild

                if (newNode && selectedEl.parentNode) {
                    selectedEl.parentNode.replaceChild(newNode, selectedEl);
                    selectedElRef.current = newNode as HTMLElement;
                    console.log("Element replaced successfully")

                    const updatedSliderCode = iframe.contentDocument?.body?.innerHTML || newHTML;
                    console.log(updatedSliderCode)
                    setUpdateSlider(updatedSliderCode)
                }
            }
        } catch (err) {
            console.error("Error updating AI section:", err)
        }
        setLoading(false)
    }

    const SaveAllSlides = async (updatedSlides: string[]) => {
        if (!projectId) return;
        await setDoc(
            doc(firebaseDb, 'projects', projectId),
            {
                slides: updatedSlides
            },
            { merge: true }
        )
        console.log("Slides updated to Firestore")
    }

    return (
        <div className="mb-5">
            <iframe
                ref={iframeRef}
                className="w-[800px] h-[500px] border-0 rounded-2xl"
                sandbox="allow-script allow-same-origin allow modals allow-forms allow-popups"
            />
            <FloatingActionTool poition={cardPosition}
                onClose={() => setCardPosition(null)}
                loading={loading}
                handleAiChange={(value: string) => handleAiSectionChange(value)}
            />
        </div>
    )
}

export default SliderFrame
