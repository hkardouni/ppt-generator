export type Tslide = {
    selectStyle: (value: TDesignStyle) => void
}

export type TDesignStyle = {
        styleName: string,
        colors: TColors,
        designGuide: string,
        icon: string,
        bannerImage: string
    }

export type TColors = {
    		primary: string,
			secondary: string,
			accent: string,
			background: string,
			gradient: string
}