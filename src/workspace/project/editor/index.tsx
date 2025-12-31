import OutlineSection from '@/components/custom/OutlineSection'
import { firebaseDb, GeminiAiLiveModel } from '@/config/FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Project } from '../outline';
import SliderFrame from '@/components/custom/SliderFrame';
import * as htmlToImage from "html-to-image";
import PptxGenJS from "pptxgenjs";
import { FileDown,  Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';


const SLIDER_PROMPT = `Generate HTML (TailwindCSS + Flowbite UI + Lucide Icons) 
code for a 16:9 ppt slider in Modern Dark style.
{DESIGN_STYLE}. No responsive design; use a fixed 16:9 layout for slides.
Use Flowbite component structure. Use different layouts depending on content and style.
Use TailwindCSS colors like primary, accent, gradients, background, etc., and include colors from {COLORS_CODE}.
MetaData for Slider: {METADATA}

- Ensure images are optimized to fit within their container div and do not overflow.
- Use proper width/height constraints on images so they scale down if needed to remain inside the slide.
- Maintain 16:9 aspect ratio for all slides and all media.
- Use CSS classes like 'object-cover' or 'object-contain' for images to prevent stretching or overflow.
- Use grid or flex layouts to properly divide the slide so elements do not overlap.

Generate Image if needed using:
'https://ik.imagekit.io/ikmedia/ik-genimg-prompt-{imagePrompt}/{altImageName}.jpg'
Replace {imagePrompt} with relevant image prompt and altImageName with a random image name.  

<!-- Slide Content Wrapper (Fixed 16:9 Aspect Ratio) -->
<div class="w-200 h-125 relative overflow-hidden">
  <!-- Slide content here -->
</div>
Also do not add any overlay : Avoid this :
    <div class="absolute inset-0 bg-linear-to-br from-primary to-secondary opacity-20"></div>


Just provide body content for 1 slider. Make sure all content, including images, stays within the main slide div and preserves the 16:9 ratio.`

function Editor() {
    const { projectId } = useParams();
    const [projectDetail, setProjectDetail] = useState<Project>();
    const [loading, setLoading] = useState(false);
    const [sliders, setSliders] = useState<any[]>([]);
    const [isSlidesGenerated, setIsSlidesGenerated] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [downloadLoading, setDownloadLoading] = useState(false);

    useEffect(() => {
        if (projectId) {
            GetProjectDetail();
        }
    }, [projectId]);

    const GetProjectDetail = async () => {
        setLoading(true);
        try {
            const docRef = doc(firebaseDb, "projects", projectId ?? '');
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                console.error('Project not found');
                return;
            }
            console.log(JSON.stringify(docSnap.data()));
            setProjectDetail(docSnap.data() as Project);
        } catch (error) {
            console.error('Error fetching project:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectDetail) {
            if (!projectDetail?.slides?.length) {
                GenerateSlides();
            } else {
                setSliders(projectDetail.slides);
            }
        }
    }, [projectDetail]);

    const GenerateSlides = async () => {
        if (!projectDetail?.outline || projectDetail.outline.length === 0) return;

        console.log("🚀 Starting slide generation...");

        for (let index = 0; index < projectDetail.outline.length && index < 5; index++) {
            const metaData = projectDetail.outline[index];
            const prompt = SLIDER_PROMPT
                .replace("{DESIGN_STYLE}", projectDetail?.designStyle?.designGuide ?? "")
                .replace("{COLORS_CODE}", JSON.stringify(projectDetail?.designStyle?.colors))
                .replace("{METADATA}", JSON.stringify(metaData));

            console.log("🧠 Generating slide", index + 1);
            await GeminiSlideCall(prompt, index);
            console.log("✅ Finished slide", index + 1);
        }

        console.log("🎉 All slides generated!");
        setIsSlidesGenerated(Date.now());
    };

    const GeminiSlideCall = async (prompt: string, index: number) => {
        try {
            const session = await GeminiAiLiveModel.connect();
            await session.send(prompt);

            let text = "";

            for await (const message of session.receive()) {
                if (message.type === "serverContent") {
                    const parts = message.modelTurn?.parts;
                    if (parts && parts.length > 0) {
                        text += parts.map((p: any) => p.text).join("");

                        const finalText = text
                            .replace(/```html/g, "")
                            .replace(/```/g, "")
                            .trim();

                        setSliders((prev: any[]) => {
                            const updated = prev ? [...prev] : [];
                            updated[index] = { code: finalText };
                            return updated;
                        });
                    }

                    if (message.turnComplete) {
                        console.log("✅ Slide", index + 1, "complete");
                        break;
                    }
                }
            }

            await session.close();
        } catch (err) {
            console.error("❌ Error generating slide", index + 1, err);
        }
    };

    useEffect(() => {
        if (isSlidesGenerated) {
            SaveAllSlides();
        }
    }, [isSlidesGenerated]);

    const SaveAllSlides = async () => {
        try {
            await setDoc(doc(firebaseDb, "projects", projectId ?? ''), {
                slides: sliders
            }, {
                merge: true
            });
            console.log('Slides saved successfully');
        } catch (error) {
            console.error('Error saving slides:', error);
        }
    };

    const updateSliderCode = (updateSlideCode: string, index: number) => {
        setSliders((prev: any[]) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                code: updateSlideCode
            };
            return updated;
        });
        setIsSlidesGenerated(Date.now());
    };

    const exportAllIframesToPPT = async () => {
        if (!containerRef.current) return;
        setDownloadLoading(true);
        
        try {
            const pptx = new PptxGenJS();
            const iframes = containerRef.current.querySelectorAll("iframe");

            for (let i = 0; i < iframes.length; i++) {
                const iframe = iframes[i] as HTMLIFrameElement;
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (!iframeDoc) continue;

                const slideNode = iframeDoc.querySelector("body > div") || iframeDoc.body;
                if (!slideNode) continue;

                console.log(`Exporting slide ${i + 1}...`);
                const dataUrl = await htmlToImage.toPng(slideNode as HTMLElement, { quality: 1 });

                const slide = pptx.addSlide();
                slide.addImage({
                    data: dataUrl,
                    x: 0,
                    y: 0,
                    w: 10,
                    h: 5.625,
                });
            }

            await pptx.writeFile({ fileName: "MyProjectSlides.pptx" });
            console.log('PPT exported successfully');
        } catch (error) {
            console.error('Error exporting PPT:', error);
        } finally {
            setDownloadLoading(false);
        }
    };

    return (
        <div>
            <div className='flex items-center justify-center mt-4'>
                {/* <Alert variant="destructive" className='max-w-lg'>
                    <InfoIcon className='h-4 w-4' />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                        This is Application Demo, Maximum 5 Slider can be generated for demo
                    </AlertDescription>
                </Alert> */}
            </div>
            <div className='grid grid-cols-5 p-10 gap-10'>
                <div className='col-span-2 h-[90vh] overflow-auto'>
                    <OutlineSection 
                        outline={projectDetail?.outline ?? []}
                        handleUpdateOutline={() => console.log('Update outline')}
                        loading={loading}
                    />
                </div>
                <div className='col-span-3 h-screen overflow-auto' ref={containerRef}>
                    {sliders?.map((slide: any, index: number) => (
                        <SliderFrame 
                            slide={slide} 
                            key={index}
                            colors={projectDetail?.designStyle?.colors}
                            setUpdateSlider={(updateSlideCode: string) => updateSliderCode(updateSlideCode, index)}
                        />
                    ))}
                </div>
                <Button 
                    onClick={exportAllIframesToPPT} 
                    size='lg' 
                    className='fixed bottom-6 transform left-1/2 -translate-x-1/2'
                    disabled={downloadLoading}
                >
                    {downloadLoading ? <Loader2 className='animate-spin mr-2' /> : <FileDown className='mr-2' />} 
                    Export PPT
                </Button>
            </div>
        </div>
    );
}

export default Editor;