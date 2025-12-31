import OutlineSection from '@/components/custom/OutlineSection'
import SliderStyle, { type DesignStyle } from '@/components/custom/SliderStyle'
import { Button } from '@/components/ui/button'
import { firebaseDb, GeminiAiModel } from '@/config/FirebaseConfig'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ArrowRight, Loader2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export type Project={
  userInputPrompt:string,
  projectId:string,
  createdAt:string,
  noOfSliders:string,
  outline:Outline[],
  slides:any[],
  designStyle:DesignStyle
}

export type Outline={
  slideNo:string,
  slidePoint:string,
  outline:string
}

function Outline() {
  const {projectId} = useParams()
  const [, setProjectDetail] = useState<Project>();
  const [loading, setLoading] = useState(false);
  const [outline,setOutline] = useState<Outline[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle>();
  const [UpdateDbLoading,] = useState(false)
  useEffect(()=>{
    projectId && getProjectDetail()
  },[projectId])

  const getProjectDetail = async() => {
    const docRef=doc(firebaseDb, "projects", projectId??'')
    const docSnap:any=await getDoc(docRef)
    if(!docSnap.exists()){
      return;
    }
    console.log(docSnap.data())
    setProjectDetail(docSnap.data())
    if(!docSnap.data()?.outline){
      GenerateSlidersOutline(docSnap.data())
    }
  }

  const OUTLINIE_PROMPT=`
Generate a PowerPoint slide outline for the topic {userInput}. Create {noOfSliders} slides in total. Each slide should include a topic name and a 2-line descriptive outline that clearly explains what content the slide will cover.
Include the following structure:
The first slide should be a Welcome screen.
The second slide should be an Agenda screen.
The final slide should be a Thank You screen.
Return the response only in JSON format, following this schema:
[
  {
    "slideNo": "",
    "slidePoint": "",
    "outline": ""
  }
]
  `

  const generateDummyOutline = (noOfSliders: number, topic: string): Outline[] => {
    const slides: Outline[] = []
    
    // Welcome slide
    slides.push({
      slideNo: "1",
      slidePoint: "Welcome",
      outline: `Welcome to the presentation on ${topic}. This introduction sets the stage for an engaging exploration of the key concepts and insights.`
    })
    
    // Agenda slide
    slides.push({
      slideNo: "2",
      slidePoint: "Agenda",
      outline: "Overview of topics to be covered in this presentation. This slide provides a roadmap for the journey ahead."
    })
    
    // Content slides
    for (let i = 3; i < noOfSliders; i++) {
      slides.push({
        slideNo: i.toString(),
        slidePoint: `Key Point ${i - 1}`,
        outline: `Exploring important aspects of ${topic}. This slide delves into specific details and provides valuable insights on the subject matter.`
      })
    }
    
    // Thank you slide
    slides.push({
      slideNo: noOfSliders.toString(),
      slidePoint: "Thank You",
      outline: "Thank you for your attention. We hope this presentation provided valuable insights and information on the topic."
    })
    
    return slides
  }

  const GenerateSlidersOutline=async(projectData:Project)=>{
    setLoading(true)
    try {
      const prompt = OUTLINIE_PROMPT
        .replace('{userInput}', projectData?.userInputPrompt)
        .replace('{noOfSliders}', projectData?.noOfSliders)
      console.log(prompt)
      // To generate text output, call generateContent with the text input
      const result = await GeminiAiModel.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      console.log(text);
      const rawJson = text.replace('```json', '').replace('```', '')
      const JSONData = JSON.parse(rawJson);
      setOutline(JSONData)
      setLoading(false)
    } catch (error) {
      console.error("Error generating outline:", error)
      // Use dummy outline when token limit exceeded or any error occurs
      const dummyData = generateDummyOutline(
        parseInt(projectData?.noOfSliders) || 5,
        projectData?.userInputPrompt || "the topic"
      )
      setOutline(dummyData)
      setLoading(false)
    }
  }
  const handleUpdateOutline = (index:string, value:Outline)=>{
    setOutline((prev) => prev.map((item)=> item.slideNo===index?{...item, ...value}:item))
  }
  const onGenerateSlider = async()=>{
    await setDoc(doc(firebaseDb, 'projects', projectId ?? ''), {
      designStyle:selectedStyle,
      outline:outline
    },{
      merge:true
    })
  }
  return (
    <div className='flex justify-center mt-20'>
      <div className='max-w-3xl'>
        <h2 className='font-bold text-2xl'>
          Settings and slider outline
        </h2>
        <SliderStyle selectStyle={(value:DesignStyle)=>setSelectedStyle(value)}/>
        <OutlineSection loading={loading} outline={outline || []} handleUpdateOutline={(index:string, value:any)=>handleUpdateOutline(index, value)}/>
      </div>
      <Link to={'editor'}>
      <Button size={'lg'} className='fixed bottom-6 transform left-1/2 -translate-x-1/2' onClick={onGenerateSlider} disabled={UpdateDbLoading ||loading}>{UpdateDbLoading&&<Loader2Icon className='animate-spin'/>}Generate Sliders<ArrowRight/></Button>
      </Link>
      
    </div>
  )
}

export default Outline