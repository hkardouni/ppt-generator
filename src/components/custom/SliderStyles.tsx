import { useState } from 'react'
import designStyles from '../../data/StyleDesigns.json'

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
								className={`w-full h-[150px] rounded-2xl object-cover hover:scale-110 transition-all ${selectedStyle === design.styleName ? 'p-2 rounded-2xl border-2 border-primary' : ''}`}
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
