import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContentEditable from "react-contenteditable";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../index.css";

const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

// Register fonts
const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "times-new-roman",
  "courier-new",
  "verdana",
  "georgia",
  "trebuchet-ms",
  "comic-sans-ms",
  "impact",
];
Quill.register(Font, true);

const MyCustomToolbar = () => (
  <div id="toolbar">
    <select className="ql-font">
      <option value="">Normal</option>
      <option value="arial">Arial</option>
      <option value="times-new-roman">Times New Roman</option>
      <option value="courier-new">Courier New</option>
      <option value="verdana">Verdana</option>
      <option value="georgia">Georgia</option>
      <option value="trebuchet-ms">Trebuchet MS</option>
      <option value="comic-sans-ms">Comic Sans MS</option>
      <option value="impact">Impact</option>
    </select>
    <select className="ql-header" defaultValue="">
      <option value="">Normal</option>
      <option value="1">Header 1</option>
      <option value="2">Header 2</option>
      <option value="3">Header 3</option>
    </select>
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-underline" />
    <button className="ql-strike" />
    <button className="ql-list" value="ordered" />
    <button className="ql-list" value="bullet" />
    <button className="ql-link" />
    <select className="ql-align" defaultValue="">
      <option value="" />
      <option value="left" />
      <option value="center" />
      <option value="right" />
      <option value="justify" />
    </select>
    <button className="ql-clean" />
  </div>
);

function Editor({ structure }) {
  const { "*": editPath } = useParams();

  const [schema, setSchema] = useState([]);
  const [titleBg, setTitleBg] = useState("Неименувана Страница");
  const [titleEn, setTitleEn] = useState("Untitled Page");
  const [directory, setDirectory] = useState("");
  const [directoryBg, setDirectoryBg] = useState("");
  const [page, setPage] = useState("");

  useEffect(() => {
    if (editPath && editPath !== "create") {
      const fetchPage = async () => {
        try {
          const response = await axios.get(
            `${URL}/page-get-schema?pagePath=${editPath}`
          );
          setSchema(response.data.schema.schema);
          setTitleBg(response.data.schema.titleBg);
          setTitleEn(response.data.schema.titleEn);
          if (response.data.schema.directoryBg)
            setDirectoryBg(response?.data?.schema?.directoryBg);
        } catch (error) {
          console.error("Error fetching page content:", error);
        }
      };

      fetchPage();

      if (editPath.search("/") !== -1) {
        const [directory, page] = editPath.split("/");
        setDirectory(directory);
        setPage(page);
      } else {
        setPage(editPath);
      }
    }
  }, [editPath]);

  const decodeHTML = (html) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = html;
    return textArea.value;
  };

  // Adds new element to schema (text, image, video, menu)
  const addElement = (type) => {
    let newElement;

    if (type === "menu") {
      newElement = {
        id: uuidv4(),
        type,
        content: [], // Will hold the directory's page names
        selectedDirectory: "", // Stores the selected directory
      };
    } else if (type === "image_text") {
      newElement = {
        id: uuidv4(),
        type,
        content: {
          textBg: "Въведи текст на български",
          textEn: "Enter your text",
          url: "",
        },
      };
    } else if (type === "two_images") {
      newElement = {
        id: uuidv4(),
        type,
        content: ["", ""],
      };
    } else if (type === "four_images") {
      newElement = {
        id: uuidv4(),
        type,
        content: ["", "", "", ""],
      };
    } else if (type === "youtube") {
      newElement = {
        id: uuidv4(),
        type,
        content: {
          url: "",
          allowFullscreen: false,
          autoplay: false,
        },
      };
    } else if (type === "separation") {
      newElement = {
        id: uuidv4(),
        type,
      };
    } else if (type === "text" || type === "title") {
      newElement = {
        id: uuidv4(),
        type,
        content: {
          textBg: "Въведи текст на български",
          textEn: "Enter your text",
        },
      };
    } else if (type === "video") {
      newElement = {
        id: uuidv4(),
        type,
        content: {
          url: "",
          autoplay: false,
        },
      };
    } else {
      newElement = {
        id: uuidv4(),
        type,
        content:
          type === "formated"
            ? "Type here"
            : type === "html"
            ? "Enter your html"
            : type === "formated"
            ? ""
            : type === "image"
            ? ""
            : "",
      };
    }

    setSchema([...schema, newElement]);
  };

  // Updates the content of an element in the schema
  const updateElement = async (id, newContent, type) => {
    const formData = new FormData();
    switch (type) {
      case "image":
        formData.append("image", newContent);

        await axios
          .post(URL + "/image", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            const image = response.data.image;
            console.log(image);
            setSchema(
              schema.map((el) =>
                el.id === id ? { ...el, content: image } : el
              )
            );
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
        break;
      case "video":
        if (newContent.url) {
          formData.append("video", newContent.url);

          await axios
            .post(URL + "/video", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              const video = response.data.video;
              setSchema(
                schema.map((el) =>
                  el.id === id
                    ? {
                        ...el,
                        content: { url: video, autoplay: el.content.autoplay },
                      }
                    : el
                )
              );
            })
            .catch((error) => {
              console.error("Error uploading video:", error);
            });
        } else {
          setSchema(
            schema.map((el) =>
              el.id === id
                ? {
                    ...el,
                    content: {
                      url: el.content.url,
                      autoplay: newContent.autoplay,
                    },
                  }
                : el
            )
          );
        }
        break;
      case "youtube":
        if (newContent?.url) {
          // Extract the video ID from the YouTube URL
          const youtubeUrl = newContent.url;
          const videoIdMatch = youtubeUrl.match(
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})|youtu\.be\/([a-zA-Z0-9_-]{11})/
          );
          const videoId = videoIdMatch
            ? videoIdMatch[1] || videoIdMatch[2]
            : null;

          schema.map((el) => el.id === id && console.log(el));
          setSchema(
            schema.map((el) =>
              el.id === id
                ? {
                    ...el,
                    content: {
                      ...el.content,
                      url: `https://www.youtube.com/embed/${videoId}`,
                    },
                  }
                : el
            )
          );
        } else {
          setSchema(
            schema.map((el) =>
              el.id === id
                ? {
                    ...el,
                    content: {
                      ...el.content,
                      allowFullscreen: newContent.allowFullscreen,
                      autoplay: newContent.autoplay,
                    },
                  }
                : el
            )
          );
        }
        break;
      case "image_text":
        if (newContent.url !== schema.find((el) => el.id === id).content.url) {
          formData.append("image", newContent.url);

          axios
            .post(URL + "/image", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              const image = response.data.image;
              return setSchema(
                schema.map((el) =>
                  el.id === id
                    ? {
                        ...el,
                        content: {
                          textBg: el.content.textBg,
                          textEn: el.content.textEn,
                          url: image,
                        },
                      }
                    : el
                )
              );
            })
            .catch((error) => {
              return console.error("Error uploading image:", error);
            });
        } else {
          setSchema(
            schema.map((el) =>
              el.id === id
                ? {
                    ...el,
                    content: {
                      textBg: newContent.textBg,
                      textEn: newContent.textEn,
                      url: el.content.url,
                    },
                  }
                : el
            )
          );
        }
      break;
      default:
        if (type === "two_images" || type === "four_images") {
          formData.append("image", newContent.file);

          await axios
            .post(URL + "/image", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              const image = response.data.image;
              return setSchema(
                schema.map((el) =>
                  el.id === id
                    ? {
                        ...el,
                        content: { ...el.content, [newContent.id]: image },
                      }
                    : el
                )
              );
            })
            .catch((error) => {
              return console.error("Error uploading image:", error);
            });
        } else {
          setSchema(
            schema.map((el) =>
              el.id === id ? { ...el, content: newContent } : el
            )
          );
        }
        break;
    }
  };

  // Handles the selection of a directory for the menu
  const selectDirectory = (id, directory) => {
    const contents = structure[directory]?.contents || [];
    setSchema(
      schema.map((el) =>
        el.id === id
          ? { ...el, selectedDirectory: directory, content: contents }
          : el
      )
    );
  };

  // Deletes an element from the schema
  const deleteElement = (id) => {
    setSchema(schema.filter((el) => el.id !== id));
  };

  const handlePaste = async (e) => {
    e.preventDefault();
    const text = await navigator.clipboard.readText();
    document.execCommand("insertText", false, text);
  };

  // Generates static HTML file and saves the schema for future editing
  const savePage = async () => {
    if (!page) {
      return alert("You need to specify path");
    }

    if (schema.length === 0) {
      return alert("You need to place some content");
    }

    // Create HTML string
    let htmlContent = "";
    schema.forEach((element) => {
      if (element.type === "title") {
        htmlContent += `<h2 id="pageTitle" class="bg">${element.content.textBg}</h2>`;
        htmlContent += `<h2 id="pageTitle" class="en">${element.content.textEn}</h2>`;
      } else if (element.type === "text") {
        const formatText = (text) => {
          return text.replace(/<div>/g, "").replace(/<\/div>/g, "<br />");
        };

        htmlContent += `<p id="pageText" class="bg">${formatText(element.content.textBg)}</p>`;
        htmlContent += `<p id="pageText" class="en">${formatText(element.content.textEn)}</p>`;
      } else if (element.type === "html") {
        htmlContent += `<div class="pageHtml">${decodeHTML(
          element.content
        )}</div><br />`;
      } else if (element.type === "image") {
        htmlContent += `<img id="pageOneImg" src="/server/files/images/${element.content}" alt="image" />`;
      } else if (element.type === "two_images") {
        htmlContent += `<div class="pageTwoImg"><img id="pageTwoImgFirst" src="/server/files/images/${element.content[0]}" alt="image" /><img id="pageTwoImgSecond" src="/server/files/images/${element.content[1]}" alt="image" /></div>`;
      } else if (element.type === "four_images") {
        htmlContent += `<div class="pageFourImg"><img id="pageFourImgFirst" src="/server/files/images/${element.content[0]}" alt="image" /><img id="pageFourImgSecond" src="/server/files/images/${element.content[1]}" alt="image" /><img id="pageFourImgThird" src="/server/files/images/${element.content[2]}" alt="image" /><img id="pageFourImgFourth" src="/server/files/images/${element.content[3]}" alt="image" /></div>`;
      } else if (element.type === "video") {
        htmlContent += `<video id="pageVideo" ${element.content.autoplay ? "class='autoplay-video' muted" : ""} src="/server/files/videos/${
          element.content.url
        }" ${element.content.autoplay ? "autoplay" : ""} controls></video>`;
      } else if (element.type === "menu") {
        if (element.content.length > 0) {
          htmlContent += `<select id="pageMenu" onchange="location.href=this.value;">`;
          htmlContent += `<option value="">${element.selectedDirectory.slice(
            1
          )}</option>`;
          element.content.forEach((page) => {
            htmlContent += `<option value="/page${element.selectedDirectory}/${page}">${page}</option>`;
          });
          htmlContent += `</select>`;
        }
      } else if (element.type === "formated") {
        htmlContent += `<div id="pageFormated">${element.content}</div>`;
      } else if (element.type === "youtube") {
        htmlContent += `<iframe id="pageYouTube" src="${element.content.url}${
          element.content.autoplay ? "?autoplay=1" : ""
        }" ${
          element.content.allowFullscreen ? "allowfullscreen" : ""
        }></iframe><br />`;
      } else if (element.type === "separation") {
        htmlContent += "<div id='pageLine' ></div>";
      } else if (element.type === "image_text") {
        htmlContent += `<div id="pageImageText"><img src="/server/files/images/${element.content.url}" alt="image" /><p class="bg">${element.content.textBg}</p><p class="en">${element.content.textEn}</p></div>`;
      }
    });

    const schemaContent = { titleBg, titleEn, directoryBg, schema };

    // Send request to the backend to save the page
    try {
      const editUrl =
        editPath === "create" ? `${URL}/page` : `${URL}/page/edit`;
      let path = `/${directory}/${page}`;
      if (directory) {
        path = `/${directory}/${page}`;
      } else {
        path = `${page}`;
      }
      await axios.post(editUrl, {
        pagePath: path,
        htmlContent,
        schema: schemaContent,
      });
      alert("Page saved successfully!");
      setTitleBg("Неименувана Страница"); // Reset title;
      setTitleEn("Untitled Page"); // Reset title
      setSchema([]); // Reset schema
      setDirectory(""); // Reset path
      setDirectoryBg(""); // Reset path
      setPage(""); // Reset path
    } catch (error) {
      console.error("Error saving page:", error);
      alert("Failed to save page.");
    }
  };

  return (
    <div className="Setting_buttons">
      <br />
      <br />

      <div>
        <input
          id="Page_Title"
          type="text"
          value={titleBg}
          onChange={(e) => setTitleBg(e.target.value)}
          placeholder="Page Title"
          style={{ display: "block" }}
        />
        <input
          id="Page_Title"
          type="text"
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          placeholder="Page Title"
          style={{ display: "block", marginBottom: "24px" }}
        />
        <input
          id="Path_Input"
          type="text"
          value={directory}
          onChange={(e) => setDirectory(e.target.value)}
          placeholder="Set Directory"
          style={{ display: "block" }}
        />
        <input
          id="Path_Input"
          type="text"
          value={directoryBg}
          onChange={(e) => setDirectoryBg(e.target.value)}
          placeholder="Сложи директория"
          style={{ display: "block", marginBottom: "16px" }}
        />
        <input
          id="Path_Input"
          type="text"
          value={page}
          onChange={(e) => setPage(e.target.value)}
          placeholder="Set Page"
          style={{ display: "block" }}
        />
        <div className="Add_buttons">
          <button onClick={() => addElement("title")}>Add Title</button>
          <button onClick={() => addElement("text")}>Add Text</button>
          <button onClick={() => addElement("html")}>Add html</button>
          <button onClick={() => addElement("separation")}>
            Add separation line
          </button>
          <button onClick={() => addElement("image")}>Add Image</button>
          <button onClick={() => addElement("two_images")}>
            Add Two Images
          </button>
          <button onClick={() => addElement("four_images")}>
            Add Four Images
          </button>
          <button onClick={() => addElement("video")}>Add Video</button>
          <button onClick={() => addElement("formated")}>
            Add Formated Text
          </button>
          <button onClick={() => addElement("youtube")}>YouTube video</button>
          <button onClick={() => addElement("menu")}>Add Menu</button>
          <button onClick={() => addElement("image_text")}>
            Add Image with Text
          </button>
        </div>
        <button id="Save_button" onClick={savePage}>
          Save Page
        </button>
        <button
          id="home_button"
          onClick={() => {
            document.location.href = "/admin";
          }}
        >
          Home
        </button>
      </div>

      <div className="line"></div>

      <div>
        {schema.map((element) => (
          <div key={element.id}>
            {element.type === "title" && (
              <div>
                <ContentEditable
                  html={element.content.textBg}
                  onChange={(e) =>
                    updateElement(element.id, {
                      textBg: e.target.value,
                      textEn: element.content.textEn,
                    })
                  }
                  tagName="h2"
                  id="Added_Title"
                />
                <ContentEditable
                  html={element.content.textEn}
                  onChange={(e) =>
                    updateElement(element.id, {
                      textBg: element.content.textBg,
                      textEn: e.target.value,
                    })
                  }
                  tagName="h2"
                  id="Added_Title"
                />
              </div>
            )}
            {element.type === "text" && (
              <div>
                <ContentEditable
                  html={element.content.textBg}
                  onChange={(e) =>
                    updateElement(element.id, {
                      textBg: e.target.value,
                      textEn: element.content.textEn,
                    })
                  }
                  onPaste={handlePaste}
                  tagName="p"
                  id="Added_Text"
                />
                <ContentEditable
                  html={element.content.textEn}
                  onChange={(e) =>
                    updateElement(element.id, {
                      textBg: element.content.textBg,
                      textEn: e.target.value,
                    })
                  }
                  onPaste={handlePaste}
                  tagName="p"
                  id="Added_Text"
                />
              </div>
            )}
            {element.type === "html" && (
              <ContentEditable
                html={element.content}
                onChange={(e) => updateElement(element.id, e.target.value)}
                tagName="p"
                id="Added_Html"
              />
            )}
            {element.type === "image" && (
              <div id="Added_One_Image">
                <img
                  id="Added_One_Image_img"
                  src={URL + "/image?name=" + element.content}
                  alt=""
                />
                <br></br>
                <input
                  id="Added_One_Image_file"
                  type="file"
                  onChange={(e) =>
                    updateElement(element.id, e.target.files[0], element.type)
                  }
                  placeholder="Choose Image"
                />
              </div>
            )}
            {element.type === "two_images" && (
              <div id="Added_Two_Images">
                <img
                  id="Added_Two_Images_img_one"
                  src={URL + "/image?name=" + element.content[0]}
                  alt=""
                />
                <img
                  id="Added_Two_Images_img_two"
                  src={URL + "/image?name=" + element.content[1]}
                  alt=""
                />

                <br></br>

                <input
                  type="file"
                  onChange={(e) =>
                    updateElement(
                      element.id,
                      { id: 0, file: e.target.files[0] },
                      "two_images"
                    )
                  }
                  placeholder="Choose Image 1"
                  id="Added_Two_Images_file_one"
                />
                <input
                  type="file"
                  onChange={(e) =>
                    updateElement(
                      element.id,
                      { id: 1, file: e.target.files[0] },
                      "two_images"
                    )
                  }
                  placeholder="Choose Image 2"
                  id="Added_Two_Images_file_two"
                />
              </div>
            )}
            {element.type === "four_images" && (
              <div id="Added_Four_Images">
                <img
                  id="Added_Four_Images_img_one"
                  src={URL + "/image?name=" + element.content[0]}
                  alt=""
                />
                <img
                  id="Added_Four_Images_img_two"
                  src={URL + "/image?name=" + element.content[1]}
                  alt=""
                />
                <br></br>
                <img
                  id="Added_Four_Images_img_three"
                  src={URL + "/image?name=" + element.content[2]}
                  alt=""
                />
                <img
                  id="Added_Four_Images_img_four"
                  src={URL + "/image?name=" + element.content[3]}
                  alt=""
                />
                <br></br>
                <form onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="file"
                    onChange={(e) =>
                      updateElement(
                        element.id,
                        { id: 0, file: e.target.files[0] },
                        "four_images"
                      )
                    }
                    placeholder="Choose Image 1"
                    id="Added_Four_Images_file_one"
                  />
                  <input
                    type="file"
                    onChange={(e) =>
                      updateElement(
                        element.id,
                        { id: 1, file: e.target.files[0] },
                        "four_images"
                      )
                    }
                    placeholder="Choose Image 2"
                    id="Added_Four_Images_file_two"
                  />
                  <input
                    type="file"
                    onChange={(e) =>
                      updateElement(
                        element.id,
                        { id: 2, file: e.target.files[0] },
                        "four_images"
                      )
                    }
                    placeholder="Choose Image 3"
                    id="Added_Four_Images_file_three"
                  />
                  <input
                    type="file"
                    onChange={(e) =>
                      updateElement(
                        element.id,
                        { id: 3, file: e.target.files[0] },
                        "four_images"
                      )
                    }
                    placeholder="Choose Image 4"
                    id="Added_Four_Images_file_four"
                  />
                </form>
              </div>
            )}
            {element.type === "video" && (
              <div id="Added_Video">
                {element.content.url && (
                  <video
                    id="Added_Video_vid"
                    src={URL + "/video?name=" + element.content.url}
                    controls
                  />
                )}
                <br></br>
                <input
                  id="Added_Video_file"
                  type="file"
                  onChange={(e) =>
                    updateElement(
                      element.id,
                      { url: e.target.files[0] },
                      "video"
                    )
                  }
                  placeholder="Choose Video"
                />
                <label>
                  <input
                    id="Added_Video_autoplay"
                    type="checkbox"
                    checked={element.content.autoplay}
                    onChange={(e) =>
                      updateElement(
                        element.id,
                        { autoplay: e.target.checked },
                        "video"
                      )
                    }
                  />
                  Autoplay
                </label>
              </div>
            )}
            {element.type === "menu" && (
              <div id="Added_menu">
                <label>Select Directory: </label>
                <select
                  id="Added_menu_select"
                  value={element.selectedDirectory}
                  onChange={(e) => selectDirectory(element.id, e.target.value)}
                >
                  <option value="">Select a directory</option>
                  {Object.keys(structure).map(
                    (dir) =>
                      structure[dir].type === "directory" && (
                        <option key={dir} value={dir}>
                          {dir}
                        </option>
                      )
                  )}
                </select>
                {element.content.length > 0 && (
                  <ul>
                    {element.content.map((page, index) => (
                      <li key={index}>{page}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {element.type === "formated" && (
              <div id="Added_Formated">
                <MyCustomToolbar /> {/* Include the custom toolbar */}
                <ReactQuill
                  value={element.content}
                  onChange={(newContent) =>
                    updateElement(element.id, newContent)
                  }
                  modules={{
                    toolbar: {
                      container: "#toolbar", // Use the custom toolbar
                    },
                  }}
                />
              </div>
            )}
            {element.type === "image_text" && (
              <div id="Added_Image_Text">
                <div id="Added_One_Image">
                  <img
                    id="Added_One_Image_img"
                    src={URL + "/image?name=" + element.content.url}
                    alt=""
                  />
                  <br></br>
                  <input
                    id=""
                    type="file"
                    onChange={(e) =>
                      updateElement(
                        element.id,
                        { url: e.target.files[0] },
                        "image_text"
                      )
                    }
                    placeholder="Choose Image"
                  />
                </div>
                <ContentEditable
                  id="Added_Text"
                  html={element.content.textBg}
                  tagName="p"
                  onChange={(e) =>
                    updateElement(
                      element.id,
                      {
                        textBg: e.target.value,
                        textEn: element.content.textEn,
                        url: element.content.url,
                      },
                      "image_text"
                    )
                  }
                  placeholder="Enter your text"
                />
                <ContentEditable
                  id="Added_Text"
                  html={element.content.textEn}
                  tagName="p"
                  onChange={(e) =>
                    updateElement(
                      element.id,
                      {
                        textBg: element.content.textBg,
                        textEn: e.target.value,
                        url: element.content.url,
                      },
                      "image_text"
                    )
                  }
                  placeholder="Enter your text"
                />
              </div>
            )}
            {element.type === "youtube" && (
              <div id="Added_YouTube">
                {element.content?.url && (
                  <iframe
                    id="Added_YouTube_vid"
                    width="420"
                    height="250"
                    key={`${element.content.url}-${element.content.allowFullscreen}`}
                    src={element.content.url}
                    title={`YouTube video ${element.id}`}
                    allowFullScreen={element.content.allowFullscreen} // Conditionally add the allowFullScreen attribute
                  />
                )}
                <br></br>
                <input
                  id="Added_YouTube_link"
                  type="text"
                  onChange={(e) => {
                    updateElement(
                      element.id,
                      { url: e.target.value },
                      "youtube"
                    );
                  }}
                  placeholder="YouTube URL"
                />
                <label>
                  <input
                    id="Added_YouTube_allow"
                    type="checkbox"
                    checked={element.content.allowFullscreen}
                    onChange={(e) => {
                      updateElement(
                        element.id,
                        { allowFullscreen: e.target.checked },
                        "youtube"
                      );
                    }}
                  />
                  Allow Fullscreen
                </label>
                <label>
                  <input
                    id="Added_YouTube_allow"
                    type="checkbox"
                    checked={element.content.autoplay}
                    onChange={(e) => {
                      updateElement(
                        element.id,
                        { autoplay: e.target.checked },
                        "youtube"
                      );
                    }}
                  />
                  Autoplay
                </label>
              </div>
            )}
            {element.type === "separation" && <div className="line"></div>}
            <button
              id="Delete_button"
              onClick={() => deleteElement(element.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Editor;
