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
  const [backgroundType, setBackgroundType] = useState("solid");
  const [imageUrl, setImageUrl] = useState("");
  const [solidBackgroundColor, setSolidBackgroundColor] = useState("#035f68");
  const [headerTextColor, setHeaderTextColor] = useState("#ffffff");
  const [gradientDirection, setGradientDirection] = useState("to right");
  const [gradientColors, setGradientColors] = useState(["#b3272d", "#646469"]);
  const [title, setTitle] = useState("Custom Textbox");
  const [content, setContent] = useState(
    "This is a preview of your styled textbox."
  );
  const [textboxType, setTextboxType] = useState("examples");
  const [generatedSCSS, setGeneratedSCSS] = useState("");
  const [error, setError] = useState("");
  const [bodyBackgroundColor, setBodyBackgroundColor] = useState("#efefef");
  const [bodyTextColor, setBodyTextColor] = useState("#373d3f");
  const [border, setBorder] = useState(null);

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
        gradientColors,
        headerTextColor,
        bodyBackgroundColor,
        bodyTextColor,
        border
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
    if (["image", "solid"].includes(backgroundType)) {
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
          Header Background Type:
          <select
            value={backgroundType}
            onChange={handleInputChange(setBackgroundType)}
          >
            <option value="solid">Solid Color</option>
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
          </>
        )}
        {["image", "solid"].includes(backgroundType) && <label>
              Solid Header Background Color:
              <input
                type="color"
                value={solidBackgroundColor}
                onChange={handleInputChange(setSolidBackgroundColor)}
              />
            </label>}

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
        <label>
          Header Text Color:
          <input
            type="color"
            value={headerTextColor}
            onChange={handleInputChange(setHeaderTextColor)}
            placeholder="Header text color"
          />
        </label>
        <label>
          Body Background Color:
          <input
            type="color"
            value={bodyBackgroundColor}
            onChange={handleInputChange(setBodyBackgroundColor)}
          />
        </label>
        <label>
          Body Text Color:
          <input
            type="color"
            value={bodyTextColor}
            onChange={handleInputChange(setBodyTextColor)}
          />
        </label>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <input
          type="checkbox"
          style={{ margin: 0, width: "10%" }}
          checked={border !== null}
          onChange={(e) => setBorder(e.target.checked ? "#000" : null)}
        />
        <label>Border?</label>
        </div>
        {border && (
          <label>
            Border Color:
            <input
              type="color"
              value={border}
              onChange={(e) => setBorder(e.target.value)}
            />
          </label>
        )}

        <button onClick={handleExportSCSS}>Generate SCSS</button>
        {error && <p className="error-message">{error}</p>}
      </div>

      {generatedSCSS && (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <div className="scss-output" style={{ width: "100%", maxWidth: "800px" }}>
          <h2>Generated SCSS</h2>
          <textarea
            value={generatedSCSS}
            readOnly
            rows={10}
            style={{ width: "100%", fontFamily: "monospace", fontSize: "1rem" }}
          />
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(generatedSCSS);
            alert("SCSS copied to clipboard!");
          }}  > Copy </button>
        </div>
      )}

      <div className="preview">
        <h2>Preview</h2>
        <div className={`textbox-preview textbox textbox--${textboxType}`} style={{border: border ? `1px solid ${border}` : "none"}}>
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
            <h2 style={{color: headerTextColor}}>{title}</h2>
          </header>
          <div className="textbox__content" style={{backgroundColor: bodyBackgroundColor, borderRadius: "8px", color: bodyTextColor}}>{content}</div>
        </div>
      </div>
    </div>
  );
};

export default TextboxStyler;
