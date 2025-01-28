import { Color, ColorChangeHandler, BlockPicker, ColorResult } from "react-color"

interface ColorPickerProps { 
    color: Color | undefined
    onChange: ColorChangeHandler
}

export default function ColorPicker( { color, onChange } : ColorPickerProps) {
    return (
        <BlockPicker color={color} onChange={onChange} triangle="top" width={"200"} onSwatchHover={(color: ColorResult, event: Event) => console.log(color, event)}/>
    )
}