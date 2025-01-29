/*
      Project: Pressbooks Textbox Styler
      Description: A customizable textbox styler for Pressbooks.
      Author: Davin Chiupka, Fanshawe OER Studio
      Date: January 28, 2025
      License: MIT License - https://opensource.org/license/mit
*/
import React, { useState, useEffect, useMemo } from "react";
import { generateSCSS, isValidUrl } from "../../Utils/Utils";
import "./TextboxStyler.scss";

const TextboxStyler = () => {
  const [backgroundType, setBackgroundType] = useState("image");
  const [imageUrl, setImageUrl] = useState("");
  const [solidBackgroundColor, setSolidBackgroundColor] = useState("#ffffff");
  const [gradientDirection, setGradientDirection] = useState("to right");
  const [gradientColors, setGradientColors] = useState(["#b3272d", "#646469"]);
  const [title, setTitle] = useState("Custom Textbox");
  const [content, setContent] = useState(
    "This is a preview of your styled textbox."
  );
  const [textboxType, setTextboxType] = useState("examples");
  const [generatedSCSS, setGeneratedSCSS] = useState("");
  const [error, setError] = useState("");

  const defaultSolidColors = useMemo(
    () => ({
      examples: "#4f446d",
      exercises: "#0b6396",
      "key-takeaways": "#c25700",
      "learning-objectives": "#5a7613",
    }),
    []
  );

  const validateInputs = () => {
    if (!title.trim()) return "Textbox title is required.";
    if (!content.trim()) return "Textbox content is required.";
    if (["image", "both"].includes(backgroundType)) {
      if (!imageUrl.trim())
        return "Image URL is required when using an image background.";
      if (!isValidUrl(imageUrl)) return "Invalid image URL format.";
    }
    if (["gradient", "both"].includes(backgroundType)) {
      if (!gradientColors[0] || !gradientColors[1]) {
        return "Both gradient colors are required.";
      }
    }
    return "";
  };

  const handleExportSCSS = () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      setGeneratedSCSS("");
      return;
    }

    setError("");
    setGeneratedSCSS(
      generateSCSS(
        textboxType,
        backgroundType,
        imageUrl,
        solidBackgroundColor,
        gradientDirection,
        gradientColors
      )
    );
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError("");
    setGeneratedSCSS("");
  };

  const handleColorChange = (index, value) => {
    const updatedColors = [...gradientColors];
    updatedColors[index] = value;
    setGradientColors(updatedColors);
    setGeneratedSCSS("");
  };

  useEffect(() => {
    if (backgroundType === "image") {
      setSolidBackgroundColor(defaultSolidColors[textboxType]);
    }
  }, [textboxType, backgroundType, defaultSolidColors]);

  return (
    <div className="textbox-styler">
      <h1>Pressbooks Textbox Styler</h1>

      <div className="controls">
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={handleInputChange(setTitle)}
            placeholder="Enter textbox title"
          />
        </label>

        <label>
          Content:
          <textarea
            value={content}
            onChange={handleInputChange(setContent)}
            placeholder="Enter textbox content"
          />
        </label>

        <label>
          Textbox Type:
          <select
            value={textboxType}
            onChange={handleInputChange(setTextboxType)}
          >
            {Object.keys(defaultSolidColors).map((type) => (
              <option key={type} value={type}>
                {type.replace("-", " ").toUpperCase()}
              </option>
            ))}
          </select>
        </label>

        <label>
          Background Type:
          <select
            value={backgroundType}
            onChange={handleInputChange(setBackgroundType)}
          >
            <option value="image">Image</option>
            <option value="gradient">Gradient</option>
            <option value="both">Image & Gradient</option>
          </select>
        </label>

        {["image", "both"].includes(backgroundType) && (
          <>
            <label>
              Image URL:
              <input
                type="text"
                value={imageUrl}
                onChange={handleInputChange(setImageUrl)}
                placeholder="Enter image URL"
              />
            </label>
            <label>
              Solid Background Color:
              <input
                type="color"
                value={solidBackgroundColor}
                onChange={handleInputChange(setSolidBackgroundColor)}
              />
            </label>
          </>
        )}

        {["gradient", "both"].includes(backgroundType) && (
          <>
            <label>
              Gradient Direction:
              <select
                value={gradientDirection}
                onChange={handleInputChange(setGradientDirection)}
              >
                {[
                  "to top",
                  "to bottom",
                  "to left",
                  "to right",
                  "to top right",
                  "to top left",
                  "to bottom right",
                  "to bottom left",
                ].map((direction) => (
                  <option key={direction} value={direction}>
                    {direction}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Gradient Colors:
              <input
                type="color"
                value={gradientColors[0]}
                onChange={(e) => handleColorChange(0, e.target.value)}
              />
              <input
                type="color"
                value={gradientColors[1]}
                onChange={(e) => handleColorChange(1, e.target.value)}
              />
            </label>
          </>
        )}

        <button className="generate-btn" onClick={handleExportSCSS}>
          Generate SCSS
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>

      {generatedSCSS && (
        <div className="scss-output">
          <h2>Generated SCSS</h2>
          <textarea
            value={generatedSCSS}
            readOnly
            rows={10}
            style={{ width: "100%", fontFamily: "monospace", fontSize: "1rem" }}
          />
        </div>
      )}

      <div className="preview">
        <h2 className="preview-header">Preview</h2>
        <div className="preview-content">
          <div className={`textbox-preview textbox textbox--${textboxType}`}>
            <header
              className="textbox__header"
              style={{
                backgroundImage:
                  backgroundType === "image"
                    ? `url(${imageUrl})`
                    : backgroundType === "gradient"
                    ? `linear-gradient(${gradientDirection}, ${gradientColors[0]}, ${gradientColors[1]})`
                    : backgroundType === "both"
                    ? `url(${imageUrl}), linear-gradient(${gradientDirection}, ${gradientColors[0]}, ${gradientColors[1]})`
                    : "none",
                backgroundColor:
                  backgroundType === "image" || backgroundType === "both"
                    ? solidBackgroundColor
                    : backgroundType === "gradient"
                    ? "transparent"
                    : solidBackgroundColor,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >
              <h2>{title}</h2>
            </header>
            <div className="textbox__content">{content}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextboxStyler;
