import React, { useState } from 'react'

import green from "../../assets/green.jpg"
import blackGold from "../../assets/black-gold.jpg"
import creativePastel from "../../assets/creative-pastel.jpg"
import professional from "../../assets/professional.jpg"
import minimalWhite from "../../assets/Minimalist-White.jpg"
import modernGradient from "../../assets/modern-gradient.jpg"
import techDark from "../../assets/tech-dark.jpg"
import boldRed from "../../assets/bold-red.jpg"
import oceanBlue from "../../assets/ocean-blue.jpg"
import retroSunset from "../../assets/retro-sunset.jpg"

const designStyles = [
	{
		"styleName": "Professional Blue",
		"colors": {
			"primary": "#0A66C2",
			"secondary": "#1C1C1C",
			"accent": "#E8F0FE",
			"background": "#FFFFFF",
			"gradient": "linear-gradient(135deg, #0A66C2, #E8F0FE)"
		},
		"designGuide": "Create a professional corporate-style presentation with blue and white tones, modern sans-serif fonts, clean layout, and minimal icons. Use subtle gradients and geometric background for a trustworthy business feel.",
		"icon": "Briefcase",
		"bannerImage": professional
	}, {
		"styleName": "Minimal White",
		"colors": {
			"primary": "#1C1C1C",
			"secondary": "#AAAAAA",
			"accent": "#EDEDED",
			"background": "#FFFFFF",
			"gradient": "linear-gradient(135deg, #FFFFFF, #EDEDED)"
		},
		"designGuide": "Generate a minimalist slide deck with white backgrounds, black text and light grey accents. keep layouts clean, use lots of whitespace, and apply simple typography for a calm, elegant aesthetic.",
		"icon": "Square",
		"bannerImage": minimalWhite
	}, {
		"styleName": "Modern Gradient",
		"colors": {
			"primary": "#8A2BE2",
			"secondary": "#00C9FF",
			"accent": "#92FE9D",
			"background": "#FFFFFF",
			"gradient": "linear-gradient(135deg, #8A2BE2, #00C9FF, #92FE9D)"
		},
		"designGuide": "Design a modern gradient-style PPT with vibrantgradient backgrounds, glassmorphism overlays, and smooth transition. Use modern typography and bright gradients for an innovative, tech-savvy vibe.",
		"icon": "Sparkles",
		"bannerImage": modernGradient
	},
	{
		"styleName": "Elegant Black & Gold",
		"colors": {
			"primary": "#000000",
			"secondary": "#C5A300",
			"accent": "#F5E6A7",
			"background": "#121212",
			"gradient": "linear-gradient(135deg, #000000, #C5A300)"
		},
		"designGuide": "Build a luxurious and elegant presentation using black and gold. Use serif fonts for titles, minimal icons, and dark backgrounds with subtle gold highlights for a premium, formal impression.",
		"icon": "Crown",
		"bannerImage": blackGold
	},
	{
		"styleName": "Fresh Green",
		"colors": {
			"primary": "#2ECC71",
			"secondary": "#145A32",
			"accent": "#D5F5E3",
			"background": "#FFFFFF",
			"gradient": "linear-gradient(135deg, #2ECC71, #D5F5E3)"
		},
		"designGuide": "Create an eco-friendly, nature-inspired presentation with green tones and organic shapes. Use rounded elements and soft gradients for a refreshing, clean visual identity.",
		"icon": "Leaf",
		"bannerImage": green
	},
	{
		"styleName": "Tech Dark",
		"colors": {
			"primary": "#0D1117",
			"secondary": "#161B22",
			"accent": "#58A6FF",
			"background": "#0D1117",
			"gradient": "linear-gradient(135deg, #0D1117, #161B22, #58A6FF)"
		},
		"designGuide": "Design a dark-mode, futuristic presentation suited for tech startups. Use neon blue accents, monospaced fonts, and minimal icons for a clean developer aesthetic.",
		"icon": "Cpu",
		"bannerImage": techDark
	},
	{
		"styleName": "Creative Pastel",
		"colors": {
			"primary": "#FADADD",
			"secondary": "#C8E7ED",
			"accent": "#FFF5BA",
			"background": "#FFFFFF",
			"gradient": "linear-gradient(135deg, #FADADD, #C8E7ED, #FFF5BA)"
		},
		"designGuide": "Make a soft, artistic presentation with pastel colors and hand-drawn icons. Use playful fonts and gentle contrasts for a warm, friendly design.",
		"icon": "Palette",
		"bannerImage": creativePastel
	},
	{
		"styleName": "Bold Red",
		"colors": {
			"primary": "#C0392B",
			"secondary": "#641E16",
			"accent": "#F5B7B1",
			"background": "#FFFFFF",
			"gradient": "linear-gradient(135deg, #C0392B, #F5B7B1)"
		},
		"designGuide": "Design a strong, attention-grabbing presentation with bold reds and minimal whites. Use confident typography and striking layouts for marketing or leadership topics.",
		"icon": "Flame",
		"bannerImage": boldRed
	},
	{
		"styleName": "Ocean Blue",
		"colors": {
			"primary": "#0077B6",
			"secondary": "#90E0EF",
			"accent": "#CAF0F8",
			"background": "#FFFFFF",
			"gradient": "linear-gradient(135deg, #0077B6, #90E0EF, #CAF0F8)"
		},
		"designGuide": "Craft a calm and balanced presentation inspired by ocean tones. Use fluid wave shapes, blue gradients, and white space to communicate clarity and serenity.",
		"icon": "Waves",
		"bannerImage": oceanBlue
	},
	{
		"styleName": "Retro Sunset",
		"colors": {
			"primary": "#FF7E5F",
			"secondary": "#FEB47B",
			"accent": "#FFE9D6",
			"background": "#FFFFFF",
			"gradient": "linear-gradient(135deg, #FF7E5F, #FEB47B)"
		},
		"designGuide": "Generate a nostalgic, retro-style presentation with warm sunset tones. Use rounded shapes, bold typography, and vintage-inspired gradients for creative storytelling.",
		"icon": "Sunset",
		"bannerImage": retroSunset
	}
]

const SliderStyles = () => {
	const [selectedStyle, setSelectedStyle] = useState<string>()

	return (
		<div className='mt-5'>
			<h2 className='font-bold text-xl'>Select your style</h2>
			<div className='grid grid-cols-2 md:grid-cols-3 gap-5 mt-3'>
				{
					designStyles.map((design, index) => (
						<div key={index}
						className={`cursor-pointer`}
						onClick={() => setSelectedStyle(design.styleName)}>
							<img src={design.bannerImage} alt={design.styleName}
								width={300}
								height={300}
								className={`w-full h-[150px] rounded-2xl object-cover hover:scale-110 transition-all ${selectedStyle === design.styleName ? 'p-1 rounded-2xl border-2 border-black' : ''}`}
							/>
							<h1 className='font-semibold text-center mt-1'>{design.styleName}</h1>
						</div>
					))
				}
			</div>
		</div>
	)
}

export default SliderStyles
