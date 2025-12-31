import{ useState } from 'react'

import ProfessionalSlider from '@/assets/Free/assets/professional.jpg'
import Dark from '@/assets/Free/assets/dark.jpg'
import MinimalistWhite from '@/assets/Free/assets/Minimalist-White.jpg'
import ModernGradient from '@/assets/Free/assets/modern-gradient.jpg'
import pastelppt from '@/assets/Free/assets/pastel-ppt.jpg'
import tech from '@/assets/Free/assets/tech.jpg'


const Design_Styles = 
[
  {
    "styleName": "Professional Blue 💼",
    "colors": {
      "primary": "#0A66C2",
      "secondary": "#1C1C1C",
      "accent": "#E8F0FE",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #0A66C2, #E8F0FE)"
    },
    "designGuide": "🧠 Create a professional corporate-style presentation with blue and white tones, modern sans-serif fonts, clean layout, and minimal icons. Use subtle gradients and geometric backgrounds for a trustworthy business feel.",
    "icon": "Briefcase",
    "bannerImage": ProfessionalSlider
  },
  {
    "styleName": "Minimal White ⚪",
    "colors": {
      "primary": "#1C1C1C",
      "secondary": "#AAAAAA",
      "accent": "#EDEDED",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #FFFFFF, #EDEDED)"
    },
    "designGuide": "🧠 Generate a minimalist slide deck with white backgrounds, black text, and light grey accents. Keep layouts clean, use lots of whitespace, and apply simple typography for a calm, elegant aesthetic.",
    "icon": "Square",
    "bannerImage": MinimalistWhite
  },
  {
    "styleName": "Modern Gradient 🌈",
    "colors": {
      "primary": "#8A2BE2",
      "secondary": "#00C9FF",
      "accent": "#92FE9D",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #8A2BE2, #00C9FF, #92FE9D)"
    },
    "designGuide": "🧠 Design a modern gradient-style PPT with vibrant gradient backgrounds, glassmorphism overlays, and smooth transitions. Use modern typography and bright gradients for an innovative, tech-savvy vibe.",
    "icon": "Sparkles",
    "bannerImage": ModernGradient
  },
  {
    "styleName": "Elegant Dark 🖤",
    "colors": {
      "primary": "#0D0D0D",
      "secondary": "#1F1F1F",
      "accent": "#FFD700",
      "background": "#0D0D0D",
      "gradient": "linear-gradient(135deg, #0D0D0D, #1F1F1F)"
    },
    "designGuide": "🧠 Create a luxury-style dark presentation with black and gold accents, serif fonts, and subtle lighting effects. Keep it premium, cinematic, and elegant.",
    "icon": "Star",
    "bannerImage": Dark
  },
  {
    "styleName": "Creative Pastel 🎨",
    "colors": {
      "primary": "#F6D6FF",
      "secondary": "#A0E7E5",
      "accent": "#B4F8C8",
      "background": "#FFFFFF",
      "gradient": "linear-gradient(135deg, #F6D6FF, #A0E7E5, #B4F8C8)"
    },
    "designGuide": "🧠 Build a creative pastel-style presentation with soft tones, rounded shapes, and hand-drawn illustrations. Ideal for design portfolios or fun workshops.",
    "icon": "Palette",
    "bannerImage": pastelppt
  },
  {
    "styleName": "Futuristic Neon ⚡",
    "colors": {
      "primary": "#00FFFF",
      "secondary": "#FF00FF",
      "accent": "#0A0A0A",
      "background": "#1A1A1A",
      "gradient": "linear-gradient(135deg, #00FFFF, #FF00FF)"
    },
    "designGuide": "🧠 Generate a futuristic neon-style PPT with glowing text, cyberpunk colors, and dark glass backgrounds. Use modern sans-serif fonts and motion-inspired visuals.",
    "icon": "Zap",
    "bannerImage": tech
  },
]
type Props={
  selectStyle: any
}

export type DesignStyle = {
  styleName:string,
  colors:any,
  designGuide:string,
  icon:string,
  bannerImage:any
}
function SliderStyle({selectStyle}:Props) {
  const [selectedStyle, setSelectedStyle] = useState<string>();
  return (
    <div className='mt-5'>
        <h2 className='font-bold text-xl'>
            SliderStyle
        </h2>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-5 mt-3'>
          {Design_Styles.map((design, index)=>(
          <div 
            key={index} 
            className={`cursor-pointer ${design.styleName == selectedStyle ? 'p-1 border-primary border-2 rounded-2xl' : ''}`}
            onClick={() => {
              setSelectedStyle(design.styleName)
              selectStyle(design)
            }}
          >
            <img src={design.bannerImage} alt={design.styleName}
              width={400}
              height={400}
              className='w-full h-[120] rounded-2xl object-cover hover:scale-105 transition-all' />
              <h2 className='font-medium text-center mt-1'>{design.styleName}</h2>
            </div>
          ))}
        </div>

    </div>
  )
}

export default SliderStyle