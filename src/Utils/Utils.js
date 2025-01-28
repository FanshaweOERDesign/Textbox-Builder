/*
      Project: Pressbooks Textbox Styler
      Description: A customizable textbox styler for Pressbooks.
      Author: Davin Chiupka, Fanshawe OER Studio
      Date: January 28, 2025
      License: MIT License - https://opensource.org/license/mit
*/

export const generateSCSS = (
  textboxType,
  backgroundType,
  imageUrl,
  solidBackgroundColor,
  gradientDirection,
  gradientColors
) => {
  let backgroundStyle = "";

  if (backgroundType === "image") {
    backgroundStyle = `${solidBackgroundColor} url(${imageUrl})`;
  } else if (backgroundType === "gradient") {
    backgroundStyle = `linear-gradient(${gradientDirection}, ${gradientColors[0]}, ${gradientColors[1]})`;
  } else if (backgroundType === "both") {
    backgroundStyle = `url(${imageUrl}), linear-gradient(${gradientDirection}, ${gradientColors[0]}, ${gradientColors[1]})`;
  } else {
    backgroundStyle = solidBackgroundColor;
  }

  return `
.textbox.textbox--${textboxType} .textbox__header,
.bcc-box.textbox--${textboxType} .textbox__header {
  background: ${backgroundStyle};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
`;
};

export const isValidUrl = (url) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)" +
      "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.?)+[a-zA-Z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-zA-Z\\d%@_.~+&:]*)*" +
      "(\\?[;&a-zA-Z\\d%@_.,~+&:=-]*)?" +
      "(\\#[-a-zA-Z\\d_]*)?$",
    "i"
  );
  return urlPattern.test(url);
};
