use wasm_bindgen::prelude::*;
use image::{load_from_memory, ImageOutputFormat};
use std::io::Cursor;

#[wasm_bindgen]
pub fn init_panic_hook() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub struct ArtisanCanvasEngine {}

#[wasm_bindgen]
impl ArtisanCanvasEngine {
    #[wasm_bindgen(constructor)]
    pub fn new() -> ArtisanCanvasEngine {
        init_panic_hook();
        ArtisanCanvasEngine {}
    }

    #[wasm_bindgen]
    pub fn apply_style_filter(&self, image_data: &[u8], filter_type: &str) -> Result<Vec<u8>, JsValue> {
        let img = load_from_memory(image_data).map_err(|e| JsValue::from_str(&format!("Failed: {}", e)))?;
        let mut rgba_img = img.to_rgba8();

        for pixel in rgba_img.pixels_mut() {
            let r = pixel[0] as f32;
            let g = pixel[1] as f32;
            let b = pixel[2] as f32;

            match filter_type {
                "cyberpunk" => {
                    pixel[0] = (r * 1.3).min(255.0) as u8; 
                    pixel[1] = (g * 0.6) as u8;            
                    pixel[2] = (b * 1.4).min(255.0) as u8; 
                },
                "matrix" => {
                    pixel[0] = (r * 0.3) as u8;
                    pixel[1] = (g * 1.5).min(255.0) as u8;
                    pixel[2] = (b * 0.3) as u8;
                },
                _ => {}
            }
        }

        let mut buffer = Cursor::new(Vec::new());
        rgba_img.write_to(&mut buffer, ImageOutputFormat::Png).unwrap();
        Ok(buffer.into_inner())
    }

    #[wasm_bindgen]
    pub fn blend_layers(&self, base_data: &[u8], overlay_data: &[u8]) -> Result<Vec<u8>, JsValue> {
        let mut base_img = load_from_memory(base_data).unwrap().to_rgba8();
        let overlay_img = load_from_memory(overlay_data).unwrap().to_rgba8();
        image::imageops::overlay(&mut base_img, &overlay_img, 0, 0);
        let mut buffer = Cursor::new(Vec::new());
        base_img.write_to(&mut buffer, ImageOutputFormat::Png).unwrap();
        Ok(buffer.into_inner())
    }
}
