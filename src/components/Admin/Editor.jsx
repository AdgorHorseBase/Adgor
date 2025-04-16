import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContentEditable from "react-contenteditable";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../index.css";
import "../page.css";
import { IoClose } from "react-icons/io5";
import { FaChevronDown, FaChevronUp, FaExchangeAlt, FaHome, FaSave } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { MdPreview } from "react-icons/md";

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

const MyCustomToolbar = ({ id }) => (
  <div id={id}>
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
  const [footerImage, setFooterImage] = useState("");
  const [footerImageEnable, setFooterImageEnable] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState("");

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
          setFooterImageEnable(response.data.schema.footerImageEnable === undefined ? true : response.data.schema.footerImageEnable);
          setFooterImage(response.data.schema.footerImage ?? "");
          if (response.data.schema.directoryBg)
            setDirectoryBg(response?.data?.schema?.directoryBg);
        } catch (error) {
          console.error("Error fetching page content:", error);
        }
      };

      fetchPage();

      if (editPath.search("/") !== -1) {
        if(editPath.split("/").length === 2) {
          const [directory, page] = editPath.split("/");
          setDirectory(directory);
          setPage(page);
        } else if(editPath.split("/").length === 3) {
          const [directory, subDirectory, page] = editPath.split("/");
          setDirectory(directory);
          setDirectoryBg(directoryBg);
          setPage(`${subDirectory}/${page}`);
        }
      } else {
        setPage(editPath);
      }
    }
  }, [editPath, directoryBg]);

  const decodeHTML = (html) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = html;
    return textArea.value;
  };

  // Adds new element to schema (text, image, video)
  const addElement = (type) => {
    let newElement;

    if (type === "image_text") {
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
    } else if (type === "text" || type === "title" || type === "formated") {
      newElement = {
        id: uuidv4(),
        type,
        content: {
          textBg: "Български",
          textEn: "English",
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
    } else if (type === "textImageLeft" || type === "textImageRight" || type === "textImageBehind") {
      newElement = {
        id: uuidv4(),
        type,
        content: {
          textBg: "Въведи текст на български",
          textEn: "Enter your text",
          url: "",
        }
      }
    } else if (type === "starting") {
      newElement = {
        id: uuidv4(),
        type,
        content: {
          titleBg: "Български",
          titleEn: "English",
          quoteBg: "Български",
          quoteEn: "English",
          imageBackUrl: "",
          imageFrontUrl: "",
        },
      };
    } else if (type === "person") {
      newElement = {
        id: uuidv4(),
        type,
        content: {
          textBg: "Български",
          textEn: "English",
          imageBack: "",
          imageFront: "",
        },
      };
    } else if (type === "slideshow") {
      newElement = {
        id: uuidv4(),
        type,
        content: [],
      };
    } else if (type === "gallery") {
      newElement = {
        id: uuidv4(),
        type,
        content: [],
      };
    } else if (type === "overlap") {
      newElement = {
        id: uuidv4(),
        type,
        content: {
          textBg: "Въведи текст на български",
          textEn: "Enter your text",
          imageBack: "",
          imageLeft: "",
          imageRight: "",
        },
      };
    } else if (type === "section") {
      newElement = {
        id: uuidv4(),
        type,
        content: {
          titleBg: "Напиши името на секцията",
          titleEn: "Write the name of this section"
        }
      }
    } else if (type === "imageLinkList") {
      newElement = {
        id: uuidv4(),
        type,
        content: {
          links: [],
          newLink: {
            id: uuidv4(),
            titleBg: "Напиши заглавие",
            titleEn: "Write a title",
            image: "",
            url: "page/About/our-team"
          }
        }
      }
    } else if (type === "titleImage") {
      newElement = {
        id: uuidv4(),
        type,
        content: {
          titleBg: "Напиши заглавие",
          titleEn: "Write a title",
          url: ""
        }
      }
    } else if (type === "twoTitlesText") {
      newElement = {
        id: uuidv4(),
        type,
        content: {
          titleSmallBg: "Напиши малко заглавие",
          titleSmallEn: "Write a small title",
          titleBg: "Напиши заглавие",
          titleEn: "Write a title",
          textBg: "Въведи текст на български",
          textEn: "Enter your text"
        }
      }
    } else if (type === "quote") {
      newElement = {
        id: uuidv4(),
        type,
        content: {
          quoteBg: "Въведи цитат на български",
          quoteEn: "Enter your quote",
        }
      }
    } else if (type === "peopleList") {
      newElement = {
        id: uuidv4(),
        type,
        content: {
          people: [],
          newPerson: {
            id: uuidv4(),
            images: [],
            nameBg: "Име на български",
            nameEn: "Name in English",
            textBg: "Въведи текст на български",
            textEn: "Enter your text"
          }
        }
      }
    } else {
      newElement = {
        id: uuidv4(),
        type,
        content:
          type === "html"
            ? "Enter your html"
            : "",
      };
    }

    setSchema([...schema, newElement]);
  };

  // Helper function for uploading images
  const uploadImage = useCallback(async (imageFile) => {
    if (!imageFile) return null;
    
    const formData = new FormData();
    formData.append("image", imageFile);
    
    try {
      const response = await axios.post(URL + "/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.image;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  }, []);

  // Updates the content of an element in the schema
  const updateElement = useCallback(async (id, newContent, type) => {
    switch (type) {
      case "image":
        if (newContent) {
          const image = await uploadImage(newContent);
          if (image) {
            setSchema(
              schema.map((el) =>
                el.id === id ? { ...el, content: image } : el
              )
            );
          }
        }
        break;
      case "video":
        if (newContent.url) {
          const formData = new FormData();
          formData.append("video", newContent.url);

          try {
            const response = await axios.post(URL + "/video", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
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
          } catch (error) {
            console.error("Error uploading video:", error);
          }
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
          const image = await uploadImage(newContent.url);
          if (image) {
            setSchema(
              schema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: {
                      ...el.content,
                      url: image,
                    },
                  }
                  : el
              )
            );
          }
        } else {
          setSchema(
            schema.map((el) =>
              el.id === id
                ? {
                  ...el,
                  content: {
                    ...el.content,
                    textBg: newContent.textBg || el.content.textBg,
                    textEn: newContent.textEn || el.content.textEn,
                  },
                }
                : el
            )
          );
        }
        break;
      case "titleImage":
        if (newContent.url && newContent.url !== schema.find((el) => el.id === id).content.url) {
          const image = await uploadImage(newContent.url);
          if (image) {
            setSchema(
              schema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: {
                      ...el.content,
                      url: image,
                    }
                  }
                  : el
              )
            );
          }
        } else {
          setSchema(
            schema.map((el) =>
              el.id === id
                ? {
                  ...el,
                  content: {
                    ...el.content,
                    titleBg: newContent.titleBg || el.content.titleBg,
                    titleEn: newContent.titleEn || el.content.titleEn,
                  }
                }
                : el
            )
          );
        }
        break;
      case "formated":
        setSchema((prevSchema) =>
          prevSchema.map((el) =>
            el.id === id
              ? {
                ...el,
                content: {
                  textBg: newContent.textBg?.replace(/ style="[^"]*"/g, '') || (el.content.textBg ? el.content.textBg : ""),
                  textEn: newContent.textEn?.replace(/ style="[^"]*"/g, '') || (el.content.textEn ? el.content.textEn : ""),
                },
              }
              : el
          )
        );
        break;
      case "starting":
        if (newContent.imageBackUrl) {
          const image = await uploadImage(newContent.imageBackUrl);
          if (image) {
            setSchema(
              schema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: {
                      titleBg: newContent.titleBg || el.content.titleBg,
                      titleEn: newContent.titleEn || el.content.titleEn,
                      quoteBg: newContent.quoteBg || el.content.quoteBg,
                      quoteEn: newContent.quoteEn || el.content.quoteEn,
                      imageBackUrl: image,
                      imageFrontUrl: el.content.imageFrontUrl,
                    },
                  }
                  : el
              )
            );
          }
        } else if (newContent.imageFrontUrl) {
          const image = await uploadImage(newContent.imageFrontUrl);
          if (image) {
            setSchema(
              schema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: {
                      titleBg: newContent.titleBg || el.content.titleBg,
                      titleEn: newContent.titleEn || el.content.titleEn,
                      quoteBg: newContent.quoteBg || el.content.quoteBg,
                      quoteEn: newContent.quoteEn || el.content.quoteEn,
                      imageBackUrl: el.content.imageBackUrl,
                      imageFrontUrl: image,
                    },
                  }
                  : el
              )
            );
          }
        } else {
          setSchema((prevSchema) =>
            prevSchema.map((el) =>
              el.id === id
                ? {
                  ...el,
                  content: {
                    titleBg: newContent.titleBg || el.content.titleBg,
                    titleEn: newContent.titleEn || el.content.titleEn,
                    quoteBg: newContent.quoteBg || el.content.quoteBg,
                    quoteEn: newContent.quoteEn || el.content.quoteEn,
                    imageBackUrl: el.content.imageBackUrl,
                    imageFrontUrl: el.content.imageFrontUrl,
                  },
                }
                : el
            )
          );
        }
        break;
      case "person":
        if (newContent.imageBack) {
          const image = await uploadImage(newContent.imageBack);
          if (image) {
            setSchema(
              schema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: {
                      textBg: el.content.textBg,
                      textEn: el.content.textEn,
                      imageBack: image,
                      imageFront: el.content.imageFront,
                    },
                  }
                  : el
              )
            );
          }
        } else if (newContent.imageFront) {
          const image = await uploadImage(newContent.imageFront);
          if (image) {
            setSchema(
              schema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: {
                      textBg: el.content.textBg,
                      textEn: el.content.textEn,
                      imageBack: el.content.imageBack,
                      imageFront: image,
                    },
                  }
                  : el
              )
            );
          }
        } else {
          setSchema((prevSchema) =>
            prevSchema.map((el) =>
              el.id === id
                ? {
                  ...el,
                  content: {
                    textBg: newContent.textBg || el.content.textBg,
                    textEn: newContent.textEn || el.content.textEn,
                    imageBack: el.content.imageBack,
                    imageFront: el.content.imageFront,
                  },
                }
                : el
            )
          );
        }
        break;
      case "slideshow":
        if (newContent.image) {
          const image = await uploadImage(newContent.image);
          if (image) {
            setSchema((prevSchema) =>
              prevSchema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: [...el.content, image],
                  }
                  : el
              )
            );
          }
        } else if (newContent.file) {
          const image = await uploadImage(newContent.file);
          if (image) {
            setSchema(
              schema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: el.content.map((img, idx) =>
                      idx === newContent.index ? image : img
                    ),
                  }
                  : el
              )
            );
          }
        } else if (newContent.delete) {
          setSchema(
            schema.map((el) =>
              el.id === id
                ? {
                  ...el,
                  content: el.content.filter((_, idx) => idx !== newContent.index),
                }
                : el
            )
          );
        }
        break;
      case "gallery":
        if (newContent.image) {
          const image = await uploadImage(newContent.image);
          if (image) {
            setSchema((prevSchema) =>
              prevSchema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: [...el.content, image],
                  }
                  : el
              )
            );
          }
        } else if (newContent.file) {
          const image = await uploadImage(newContent.file);
          if (image) {
            setSchema(
              schema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: el.content.map((img, idx) =>
                      idx === newContent.index ? image : img
                    ),
                  }
                  : el
              )
            );
          }
        } else if (newContent.delete) {
          setSchema(
            schema.map((el) =>
              el.id === id
                ? {
                  ...el,
                  content: el.content.filter((_, idx) => idx !== newContent.index),
                }
                : el
            )
          );
        }
        break;
      case "overlap":
        if (newContent.imageBack || newContent.imageLeft || newContent.imageRight) {
          const image = await uploadImage(newContent.image);
          if (image) {
            setSchema(
              schema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: {
                      textBg: el.content.textBg,
                      textEn: el.content.textEn,
                      imageBack: newContent.imageBack ? image : el.content.imageBack,
                      imageLeft: newContent.imageLeft ? image : el.content.imageLeft,
                      imageRight: newContent.imageRight ? image : el.content.imageRight
                    },
                  }
                  : el
              )
            );
          }
        } else {
          setSchema((prevSchema) =>
            prevSchema.map((el) =>
              el.id === id
                ? {
                  ...el,
                  content: {
                    textBg: newContent.textBg || el.content.textBg,
                    textEn: newContent.textEn || el.content.textEn,
                    imageBack: el.content.imageBack,
                    imageLeft: el.content.imageLeft,
                    imageRight: el.content.imageRight
                  },
                }
                : el
            )
          );
        }
        break;
      case "twoTitlesText":
        setSchema((prevSchema) =>
          prevSchema.map((el) =>
            el.id === id
              ? {
                ...el,
                content: {
                  titleSmallBg: newContent.titleSmallBg || el.content.titleSmallBg,
                  titleSmallEn: newContent.titleSmallEn || el.content.titleSmallEn,
                  titleBg: newContent.titleBg || el.content.titleBg,
                  titleEn: newContent.titleEn || el.content.titleEn,
                  textBg: newContent.textBg || el.content.textBg,
                  textEn: newContent.textEn || el.content.textEn
                },
              }
              : el
          )
        );
        break;
      case "imageLinkList-new":
        if(newContent.add){
          setSchema(
            schema.map((el) =>
              el.id === id
                ? {
                  ...el,
                  content: {
                    ...el.content,
                    links: [...el.content.links, el.content.newLink],
                    newLink: {
                      id: uuidv4(),
                      titleBg: "Напиши заглавие",
                      titleEn: "Write a title",
                      image: "",
                      url: "page/About/our-team",
                    }
                  },
                }
                : el
            )
          );
        } else if(newContent.image) {
          const image = await uploadImage(newContent.image);
          if (image) {
            setSchema(
              schema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: {
                      ...el.content,
                      newLink: {
                        ...el.content.newLink,
                        image: image
                      }
                    },
                  }
                  : el
              )
            );
          }
        } else {
          setSchema(
            schema.map((el) =>
              el.id === id
                ? {
                  ...el,
                  content: {
                    ...el.content,
                    newLink: {
                      ...el.content.newLink,
                      titleBg: newContent.titleBg || el.content.newLink.titleBg,
                      titleEn: newContent.titleEn || el.content.newLink.titleEn,
                      url: newContent.url || el.content.newLink.url
                    }
                  },
                }
                : el
            )
          );
        }
        break;
      case "imageLinkList":
        if (newContent.image) {
          const image = await uploadImage(newContent.image);
          if (image) {
            setSchema(
              schema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: {
                      ...el.content,
                      links: el.content.links.map((link) =>
                        link.id === newContent.id
                          ? {
                            ...link,
                            image,
                          }
                          : link
                      ),
                      newLink: el.content.newLink,
                    },
                  }
                  : el
              )
            );
          }
        } else if (newContent.delete) {
          setSchema(
            schema.map((el) =>
              el.id === id
                ? {
                  ...el,
                  content: {
                    ...el.content,
                    links: el.content.links.filter(
                      (link) => link.id !== newContent.id
                    ),
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
                    links: el.content.links?.map((link) =>
                      link.id === newContent.id
                        ? {
                          ...link,
                          titleBg: newContent.titleBg || link.titleBg,
                          titleEn: newContent.titleEn || link.titleEn,
                          url: newContent.url || link.url,
                        }
                        : link
                    ),
                  },
                }
                : el
            )
          );
        }
        break;
      case "peopleList":
        if(newContent.index || newContent.index === 0) {
          if(newContent.imgIndex || newContent.imgIndex === 0) {
            if(newContent.deleteImg) {
              return setSchema(
                schema.map((el) =>
                  el.id === id
                    ? {
                      ...el,
                      content: {
                        ...el.content,
                        people: el.content.people.map((person, i) =>
                          i === newContent.index
                            ? {
                              ...person,
                              images: person.images.filter((_, idx) => idx !== newContent.imgIndex)
                            }
                            : person
                        ),
                      },
                    }
                    : el
                )
              );
            }
            const image = await uploadImage(newContent.image);
            if (image) {
              setSchema(
                schema.map((el) =>
                  el.id === id
                    ? {
                      ...el,
                      content: {
                        ...el.content,
                        people: el.content.people.map((person, i) =>
                          i === newContent.index
                            ? {
                              ...person,
                              images: person.images.map((img, idx) =>
                                idx === newContent.imgIndex ? image : img
                              ),
                            }
                            : person
                        ),
                      },
                    }
                    : el
                )
              );
            }
          } else if(newContent.image) {
            const image = await uploadImage(newContent.image);
            if (image) {
              setSchema(
                schema.map((el) =>
                  el.id === id
                    ? {
                      ...el,
                      content: {
                        ...el.content,
                        people: el.content.people.map((person, i) =>
                          i === newContent.index
                            ? {
                              ...person,
                              images: [...person.images, image],
                            }
                            : person
                        ),
                      },
                    }
                    : el
                )
              );
            }
          } else if(newContent.deletePerson) {
            setSchema(
              schema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: {
                      ...el.content,
                      people: el.content.people.filter((_, i) => i !== newContent.index)
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
                      people: el.content.people.map((person, i) =>
                        i === newContent.index
                          ? {
                            ...person,
                            nameBg: newContent.nameBg || person.nameBg,
                            nameEn: newContent.nameEn || person.nameEn,
                            textBg: newContent.textBg || person.textBg,
                            textEn: newContent.textEn || person.textEn,
                          }
                          : person
                      ),
                    },
                  }
                  : el
              )
            );
          }
        }
        break;
      case "peopleList-new":
        if(newContent.index || newContent.index === 0) {
          console.log("Hello");
          if(newContent.delete) {
            return setSchema(
              schema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: {
                      ...el.content,
                      newPerson: {
                        ...el.content.newPerson,
                        images: el.content.newPerson.images.filter((_, i) => i !== newContent.index)
                      }
                    },
                  }
                  : el
              )
            );
          }
          const image = await uploadImage(newContent.image);
          if(image) {
            setSchema(
              schema.map((el) =>
                el.id === id
                ? {
                  ...el,
                  content: {
                    ...el.content,
                    newPerson: {
                      ...el.content.newPerson,
                      images: el.content.newPerson.images.map((img, i) =>
                        i === newContent.index ? image : img
                      ),
                    },
                  },
                }
                : el
              )
            );
          }
        } else if(newContent.image) {
          console.log("World");
          const image = await uploadImage(newContent.image);
          if (image) {
            setSchema(
              schema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: {
                      ...el.content,
                      newPerson: {
                        ...el.content.newPerson,
                        images: [...el.content.newPerson.images, image],
                      }
                    },
                  }
                  : el
              )
            );
          }
        } else if(newContent.add) {
          setSchema(
            schema.map((el) =>
              el.id === id
                ? {
                  ...el,
                  content: {
                    ...el.content,
                    people: [...el.content.people, el.content.newPerson],
                    newPerson: {
                      id: uuidv4(),
                      images: [],
                      nameBg: "Име на български",
                      nameEn: "Name in English",
                      textBg: "Въведи текст на български",
                      textEn: "Enter your text"
                    }
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
                    newPerson: {
                      ...el.content.newPerson,
                      nameBg: newContent.nameBg || el.content.newPerson.nameBg,
                      nameEn: newContent.nameEn || el.content.newPerson.nameEn,
                      textBg: newContent.textBg || el.content.newPerson.textBg,
                      textEn: newContent.textEn || el.content.newPerson.textEn,
                    }
                  },
                }
                : el
            )
          );
        }
        break;
      default:
        if (type === "two_images" || type === "four_images") {
          const image = await uploadImage(newContent.file);
          if (image) {
            setSchema(
              schema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: { ...el.content, [newContent.id]: image },
                  }
                  : el
              )
            );
          }
        } else if (type === "textImageLeft" || type === "textImageRight" || type === "textImageBehind") {
          if (newContent.url) {
            const image = await uploadImage(newContent.url);
            if (image) {
              setSchema(
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
            }
          } else {
            setSchema((prevSchema) =>
              prevSchema.map((el) =>
                el.id === id
                  ? {
                    ...el,
                    content: {
                      textBg: newContent.textBg || el.content.textBg,
                      textEn: newContent.textEn || el.content.textEn,
                      url: el.content.url,
                    },
                  }
                  : el
              )
            );
          }
        } else {
          setSchema(
            schema.map((el) =>
              el.id === id ? { ...el, content: newContent } : el
            )
          );
        }
        break;
    }
  }, [schema, uploadImage]);

  // Deletes an element from the schema
  const deleteElement = (id) => {
    setSchema(schema.filter((el) => el.id !== id));
  };

  const handlePaste = async (e) => {
    e.preventDefault();
    const text = await navigator.clipboard.readText();
    document.execCommand("insertText", false, text);
  };

  const uploadFooterImage = async (e) => {
    const image = await uploadImage(e);
    if (image) {
      setFooterImage(image);
    }
  }

  const ConvertSchemaToHtml = (schema) => {
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

        element.content.textBg = formatText(element.content.textBg);
        element.content.textEn = formatText(element.content.textEn);

        htmlContent += `<p id="pageText" class="bg">${element.content.textBg}</p>`;
        htmlContent += `<p id="pageText" class="en">${element.content.textEn}</p>`;
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
        htmlContent += `<video id="pageVideo" ${element.content.autoplay ? "class='autoplay-video' muted" : ""} src="/server/files/videos/${element.content.url
          }" ${element.content.autoplay ? "autoplay" : ""} controls></video>`;
      } else if (element.type === "formated") {
        htmlContent += `<div class="pageFormated bg">${element.content.textBg}</div>`;
        htmlContent += `<div class="pageFormated en">${element.content.textEn}</div>`;
      } else if (element.type === "youtube") {
        htmlContent += `<iframe id="pageYouTube" src="${element.content.url}${element.content.autoplay ? "?autoplay=1&mute=1" : ""
          }" ${element.content.allowFullscreen ? "allowfullscreen" : ""
          }></iframe><br />`;
      } else if (element.type === "separation") {
        htmlContent += "<div id='pageLine' ></div>";
      } else if (element.type === "image_text") {
        htmlContent += `<div id="pageImageText"><img src="/server/files/images/${element.content.url}" alt="image" /><p class="bg">${element.content.textBg}</p><p class="en">${element.content.textEn}</p></div>`;
      } else if (element.type === "textImageLeft") {
        htmlContent += `<div id="pageTextImageLeft"><div class="imageContainer"><img src="/server/files/images/${element.content.url}" alt="image" /></div><div class="bg">${element.content.textBg}</div><div class="en">${element.content.textEn}</div></div>`;
      } else if (element.type === "textImageBehind") {
        htmlContent += `<div id="pageTextImageBehind"><img src="/server/files/images/${element.content.url}" alt="image" /><div class="content"><div class="bg">${element.content.textBg}</div><div class="en">${element.content.textEn}</div></div></div>`;
      } else if (element.type === "textImageRight") {
        htmlContent += `<div id="pageTextImageRight"><div class="imageContainer"><img src="/server/files/images/${element.content.url}" alt="image" /></div><div class="bg">${element.content.textBg}</div><div class="en">${element.content.textEn}</div></div>`;
      } else if (element.type === "starting") {
        htmlContent += `
        <div id="pageStarting">
          <img id="pageStartingBackImg" src="/server/files/images/${element.content.imageBackUrl}" alt="image" />
          <div id="pageStartingContent">
            <h2 class="bg">${element.content.titleBg}</h2>
            <h2 class="en">${element.content.titleEn}</h2>
            <div id="pageStartingQuote">
              <p class="bg">${element.content.quoteBg}</p>
              <p class="en">${element.content.quoteEn}</p>
              <img id="pageStartingFrontImg" src="/server/files/images/${element.content.imageFrontUrl}" alt="image" />
            </div>
          </div>
        </div>`;
      } else if (element.type === "person") {
        htmlContent += `
        <div id="pagePerson">
          <div class="pagePersonImages">
            <img  src="/server/files/images/${element.content.imageBack}" alt="image" />
            <img src="/server/files/images/${element.content.imageFront}" alt="image" />
          </div>
          <div class="pagePersonText">
            <p class="bg">${element.content.textBg}</p>
            <p class="en">${element.content.textEn}</p>
          </div>
        </div>`;
      } else if (element.type === "slideshow") {
        // Create the slideshow html, css...
        const slideshowId = `slideshow-${element.id}`;
        htmlContent += `
        <div id="${slideshowId}" class="slideshow">
          ${element.content.map((image, index) => `
            <div class="slide" style="display: ${index === 0 ? 'block' : 'none'};">
              <img src="/server/files/images/${image}" alt="slide image" />
            </div>
          `).join('')}
          <a class="prev" onclick="plusSlides(-1, '${slideshowId}')">&#10094;</a>
          <a class="next" onclick="plusSlides(1, '${slideshowId}')">&#10095;</a>
        </div>`;
      } else if (element.type === "gallery") {
        // Create the gallery html, css...
        const galleryId = `gallery-${element.id}`;
        htmlContent += `
        <div id="${galleryId}" class="gallery-container">
          ${element.content.map(image => `
            <div class="gallery-item" key={index}>
              <img src="/server/files/images/${image}" alt="gallery image" />
            </div>
          `).join('')}
        </div>`;
      } else if (element.type === "donation") {
        htmlContent += `
          <div class="donation">
            <h2 class="bg">Информация за даряване</h2>
            <h2 class="en">Donation Detials</h2>

            <h3 class="bg">Фундация Адгор</h3>
            <h3 class="en">Adgor Foundation</h3>
            <h3>IBAN: Намери и сложи IBAN</h3>
            <h3>BIC: Тук също</h3>
            
            <div class="donationSeperation"></div>

            <h4 class="bg">За повече информация не се колебай да се свържеш с нас</h4>
            <h4 class="en">For more information don't hesitate to contact us</h4>

            <a class="bg" href="/page/contact">Свържи се с нас</a>
            <a class="en" href="/page/contact">Contact us</a>
          </div>
        `;
      } else if (element.type === "overlap") {
        htmlContent += `
          <div id="overlay">
            <div
              style="background-image: url('/server/files/images/${element.content.imageBack}')"
              id="overlayImage"
            >
              <div id="overlayTextContainer">
                <p
                  id="overlayText"
                  class="bg"
                  style="color: white; fontWeight: 600; textAlign: center"
                >
                  ${element.content.textBg.replace(/<\/?p>/g, '')}
                </p>
                <p
                  id="overlayText"
                  class="en"
                  style="color: white; fontWeight: 600; textAlign: center"
                >
                  ${element.content.textEn.replace(/<\/?p>/g, '')}
                </p>
              </div>
            </div>
            <div id="overlayFrontImages" style="width: 100%;">
              <img id="overlayImageLeft" src="/server/files/images/${element.content.imageLeft}" alt="">
              <img id="overlayImageRight" src="/server/files/images/${element.content.imageRight}" alt="">
            </div>
          </div>
        `;
      } else if (element.type === "section") {
        htmlContent += `
          <section id="${element.id}" data-title-bg="${element.content.titleBg}" data-title-en="${element.content.titleEn}">
          </section>
        `;
      } else if (element.type === "titleImage") {
        htmlContent += `
          <div id="pageTitleImage">
            <img src="/server/files/images/${element.content.url}" alt="image" />
            <h2 class="bg">${element.content.titleBg}</h2>
            <h2 class="en">${element.content.titleEn}</h2>
          </div>
        `
      } else if (element.type === "twoTitlesText") {
        htmlContent += `
          <div id="pageTwoTitlesText">
            <div class="pageTwoTitlesTextTitles">
              <h3 class="bg">${element.content.titleSmallBg}</h3>
              <h3 class="en">${element.content.titleSmallEn}</h3>
              <h2 class="bg">${element.content.titleBg}</h2>
              <h2 class="en">${element.content.titleEn}</h2>
            </div>
            <div class="pageTwoTitlesTextText">
              <div class="bg">${element.content.textBg}</div>
              <div class="en">${element.content.textEn}</div>
            </div>
          </div>
        `;
      } else if (element.type === "imageLinkList") {
        htmlContent += `
          <div id="pageImageLinkList">
            <div class="arrow-nav arrow-left">&lt;</div>
            ${element.content.links.map((link) => {
                const linkUrl = link.url.startsWith("http") ? link.url : (link.url.startsWith("/") ? link.url : `/${link.url}`);
              return `
              <a href="${linkUrl}" class="pageImageLinkListItem">
                <img src="/server/files/images/${link.image}" alt="image" />
                <h3 class="bg">${link.titleBg}</h3>
                <h3 class="en">${link.titleEn}</h3>
              </a>
            `}).join("")}
            <div class="arrow-nav arrow-right">&gt;</div>
          </div>
        `;
      } else if (element.type === "quote") {
        htmlContent += `
          <div id="pageQuote">
            <h2 class="bg">${element.content.quoteBg}</h2>
            <h2 class="en">${element.content.quoteEn}</h2>
          </div>
        `;
      } else if (element.type === "peopleList") {
        htmlContent += `
          <div id="pagePeopleList">
            ${element.content.people.map((person, personIndex) => `
              <div class="pagePeopleListItem">
                <div class="pagePeopleListImgs" id="peopleImgs-${personIndex}">
                  ${person.images.map((img) => `
                    <img src="/server/files/images/${img}" alt="image" />
                  `).join("")}
                </div>
                <div class="pagePeopleListDots" id="peopleDots-${personIndex}">
                  ${person.images.map((_, dotIndex) => `
                    <div class="pagePeopleListDot ${dotIndex === 0 ? 'active' : ''}" 
                         data-index="${dotIndex}" 
                         data-container="${personIndex}" 
                         onclick="navigateToImage(this)"></div>
                  `).join("")}
                </div>
                <div class="pagePeopleListName">
                  <h3 class="bg">${person.nameBg}</h3>
                  <h3 class="en">${person.nameEn}</h3>
                </div>
                <div class="pagePeopleListSeparation"></div>
                <div class="pagePeopleListText">
                  <p class="bg">${person.textBg}</p>
                  <p class="en">${person.textEn}</p>
                </div>
              </div>
            `).join("")}
          </div>
        `;
      }
    });

    return htmlContent;
  }

  // Generates static HTML file and saves the schema for future editing
  const savePage = async () => {
    if (!page) {
      return alert("You need to specify path");
    }

    const htmlContent = ConvertSchemaToHtml(schema);

    const schemaContent = { titleBg, titleEn, directoryBg, footerImageEnable, footerImage, schema };

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
      window.location.reload();
    } catch (error) {
      console.error("Error saving page:", error);
      alert("Failed to save page.");
    }
  };
  
  const memoizedConvertSchemaToHtml = useCallback(ConvertSchemaToHtml, []);
  useEffect(() => {
    if (showPreview) {
      let previewRawHtml = memoizedConvertSchemaToHtml(schema);
      previewRawHtml = previewRawHtml
      .replace(/src="\/server\/files\/images\//g, `src="http://localhost:8080/image?name=`)
      .replace(/src="\/server\/files\/videos\//g, `src="http://localhost:8080/video?name=`)
      .replace(/url\('\/server\/files\/images\//g, `url('http://localhost:8080/image?name=`);
      setPreviewContent(previewRawHtml);
    }
  }, [showPreview, schema, memoizedConvertSchemaToHtml]);
  const [lang, setLang] = useState("bg");
  
  const storedLang = localStorage.getItem("lang");

  useEffect(() => {
    if (storedLang) {
      setLang(storedLang);
    }
  }, [storedLang]);

  useEffect(() => {
    const elementsBg = document.querySelectorAll(".bg");
    const elementsEn = document.querySelectorAll(".en");

    if (lang === "en") {
      elementsBg.forEach((el) => (el.style.display = "none"));
      elementsEn.forEach((el) => (el.style.display = "block"));
    } else if (lang === "bg") {
      elementsBg.forEach((el) => (el.style.display = "block"));
      elementsEn.forEach((el) => (el.style.display = "none"));
    }
  }, [lang, previewContent]);

  return (
    <div className="Setting_buttons" style={{ paddingBottom: "86px", height: showPreview ? "0px": "auto", overflow: showPreview ? "hidden" : "auto" }}>
      <br />
      <br />

      <div>
        <label className="labelTitles">Заглавие на страницата BG</label>
        <input
          id="Page_Title"
          type="text"
          value={titleBg}
          onChange={(e) => setTitleBg(e.target.value)}
          placeholder="Page Title"
          style={{ display: "block" }}
        />
        <label className="labelTitles">Заглавие на страницата EN</label>
        <input
          id="Page_Title"
          type="text"
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          placeholder="Page Title"
          style={{ display: "block", marginBottom: "18px" }}
        />
        <label className="labelTitles">Име на папката BG</label>
        <input
          id="Path_Input"
          type="text"
          value={directoryBg}
          onChange={(e) => setDirectoryBg(e.target.value)}
          placeholder="Сложи директория"
          style={{ display: "block" }}
        />
        <label className="labelTitles">Име на папката EN</label>
        <input
          id="Path_Input"
          type="text"
          value={directory}
          onChange={(e) => setDirectory(e.target.value)}
          placeholder="Set Directory"
          style={{ display: "block", marginBottom: "16px" }}
        />
        <label className="labelTitles"></label>
        <input
          id="Path_Input"
          type="text"
          value={page}
          onChange={(e) => setPage(e.target.value)}
          placeholder="Set Page"
          style={{ display: "block" }}
        />
        <div className="Add_buttons">
          <button onClick={() => addElement("title")}>Title</button>
          <button onClick={() => addElement("text")}>Text</button>
          <button onClick={() => addElement("html")}>html</button>
          <button onClick={() => addElement("separation")}>
            separation line
          </button>
          <button onClick={() => addElement("image")}>Image</button>
          <button onClick={() => addElement("two_images")}>
            Two Images
          </button>
          <button onClick={() => addElement("four_images")}>
            Four Images
          </button>
          <button onClick={() => addElement("video")}>Video</button>
          <button onClick={() => addElement("formated")}>
            Formated Text
          </button>
          <button onClick={() => addElement("youtube")}>YouTube video</button>
          <button onClick={() => addElement("image_text")}>
            Image with Text
          </button>
          <button onClick={() => addElement("textImageLeft")}>Text with Image Left</button>
          <button onClick={() => addElement("textImageRight")}>Text with Image Right</button>
          <button onClick={() => addElement("textImageBehind")}>Text with Image Behind</button>
          <button onClick={() => addElement("starting")}>Initial Vision</button>
          <button onClick={() => addElement("person")}>Person</button>
          <button onClick={() => addElement("slideshow")}>Slideshow</button>
          <button onClick={() => addElement("donation")}>Donation</button>
          <button onClick={() => addElement("overlap")}>Overlap</button>
          <button onClick={() => addElement("section")}>Section</button>
          <button onClick={() => addElement("gallery")}>Gallery</button>
          <button onClick={() => addElement("imageLinkList")}>Image Link List</button>
          <button onClick={() => addElement("titleImage")}>Title Image</button>
          <button onClick={() => addElement("twoTitlesText")}>Two Titles and Text</button>
          <button onClick={() => addElement("quote")}>Quote</button>
          <button onClick={() => addElement("peopleList")}>People List</button>
        </div>
        <button id="Save_button" onClick={savePage} title="Save">
          <FaSave />
        </button>
        <button id="Preview_button" onClick={() => setShowPreview(!showPreview)} title="Preview">
          <MdPreview />
        </button>
        <button
          id="home_button"
          onClick={() => {
            document.location.href = "/admin";
          }}
          title="Home"
        >
          <FaHome />
        </button>
      </div>

      <div className="line"></div>

      <div className="elements">
        {!showPreview && schema.map((element) => (
          <div className="element" key={element.id}>
            {element.type === "title" && (
              <div>
                <label className="labelElement">Title:</label>
                <ContentEditable
                  html={element.content.textBg}
                  onChange={(e) =>
                    updateElement(element.id, {
                      textBg: e.target.value,
                      textEn: element.content.textEn,
                    })
                  }
                  onPaste={handlePaste}
                  tagName="h2"
                  id="Added_Title"
                  className="contentEditable"
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
                  tagName="h2"
                  id="Added_Title"
                  className="contentEditable"
                />
              </div>
            )}
            {element.type === "text" && (
              <div>
                <label className="labelElement">Text:</label>
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
                  className="contentEditable"
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
                  className="contentEditable"
                />
              </div>
            )}
            {element.type === "html" && (
              <div>
                <label className="labelElement">HTML:</label>
                <ContentEditable
                  html={element.content}
                  onChange={(e) => updateElement(element.id, e.target.value)}
                  tagName="p"
                  id="Added_Html"
                  onPaste={handlePaste}
                  className="contentEditable"
                />
              </div>
            )}
            {element.type === "image" && (
              <div id="Added_One_Image">
                <label className="labelElement">One Image:</label>
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
                <label className="labelElement">Two Images:</label>
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
                <label className="labelElement">Four Images:</label>
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
                <label className="labelElement">Video:</label>
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
            {element.type === "formated" && (
              <div>
                <label className="labelElement">Formated Text:</label>
                <div id="Added_Formated">
                  <MyCustomToolbar id={`toolbar-${element.id}-bg`} />
                  <ReactQuill
                    value={element.content.textBg}
                    onChange={(newContent) =>
                      updateElement(element.id, { textBg: newContent }, "formated")
                    }
                    modules={{
                      clipboard: {
                        matchVisual: false, // Prevent Quill from auto-inserting new lines
                      },
                      toolbar: {
                        container: `#toolbar-${element.id}-bg`,
                      },
                    }}
                  />
                </div>
                <div id="Added_Formated">
                  <MyCustomToolbar id={`toolbar-${element.id}-en`} />
                  <ReactQuill
                    value={element.content.textEn}
                    onChange={(newContent) =>
                      updateElement(element.id, { textEn: newContent }, "formated")
                    }
                    modules={{
                      clipboard: {
                        matchVisual: false, // Prevent Quill from auto-inserting new lines
                      },
                      toolbar: {
                        container: `#toolbar-${element.id}-en`,
                      },
                    }}
                  />
                </div>
              </div>
            )}
            {element.type === "image_text" && (
              <div id="Added_Image_Text">
                <label className="labelElement">Image with text inside:</label>
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
                  onPaste={handlePaste}
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
                  onPaste={handlePaste}
                  placeholder="Enter your text"
                />
              </div>
            )}
            {element.type === "youtube" && (
              <div id="Added_YouTube">
                <label className="labelElement">YouTube video:</label>
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
                        { allowFullscreen: e.target.checked, autoplay: element.content.autoplay },
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
                        { autoplay: e.target.checked, allowFullscreen: element.content.allowFullscreen },
                        "youtube"
                      );
                    }}
                  />
                  Autoplay
                </label>
              </div>
            )}
            {(element.type === "textImageLeft" || element.type === "textImageRight" || element.type === "textImageBehind") && (
              <div>
                <label className="labelElement">{element.type === "textImageLeft" ? "Text with image on the left" : element.type === "textImageRight" ? "Text with image on the right" : "Text With image behind"}</label>
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
                        element.type
                      )
                    }
                    placeholder="Choose Image"
                  />
                </div>
                <div id="Added_Formated">
                  <MyCustomToolbar id={`toolbar-${element.id}-bg`} />
                  <ReactQuill
                    value={element.content.textBg}
                    onChange={(newContent) =>
                      updateElement(element.id, { textBg: newContent }, element.type)
                    }
                    modules={{
                      clipboard: {
                        matchVisual: false, // Prevent Quill from auto-inserting new lines
                      },
                      toolbar: {
                        container: `#toolbar-${element.id}-bg`,
                      },
                    }}
                  />
                </div>
                <div id="Added_Formated">
                  <MyCustomToolbar id={`toolbar-${element.id}-en`} />
                  <ReactQuill
                    value={element.content.textEn}
                    onChange={(newContent) =>
                      updateElement(element.id, { textEn: newContent }, element.type)
                    }
                    modules={{
                      clipboard: {
                        matchVisual: false, // Prevent Quill from auto-inserting new lines
                      },
                      toolbar: {
                        container: `#toolbar-${element.id}-en`,
                      },
                    }}
                  />
                </div>
              </div>
            )}
            {element.type === "starting" && (
              <div>
                <label className="labelElement">Custom Page Beginning:</label>
                <div id="Added_Starting">
                  {/* Back Image */}
                  <label className="labelElementSmall">Image Behind</label>
                  <div id="Added_One_Image">
                    <img
                      id="Added_One_Image_img"
                      src={URL + "/image?name=" + element.content.imageBackUrl}
                      alt=""
                    />
                    {/* <br></br> */}
                    <input
                      id=""
                      type="file"
                      onChange={(e) =>
                        updateElement(
                          element.id,
                          { imageBackUrl: e.target.files[0] },
                          element.type
                        )
                      }
                      placeholder="Choose Image"
                    />
                  </div>
                  {/* Front Image */}
                  <label className="labelElementSmall">Image Front</label>
                  <div id="Added_One_Image">
                    <img
                      id="Added_One_Image_img"
                      src={URL + "/image?name=" + element.content.imageFrontUrl}
                      alt=""
                    />
                    <input
                      id=""
                      type="file"
                      onChange={(e) =>
                        updateElement(
                          element.id,
                          { imageFrontUrl: e.target.files[0] },
                          element.type
                        )
                      }
                      placeholder="Choose Image"
                    />
                  </div>
                  <label className="labelElementSmall">Title</label>
                  <ContentEditable
                    id="Added_Text"
                    html={element.content.titleBg}
                    tagName="p"
                    onChange={(e) =>
                      updateElement(
                        element.id,
                        {
                          titleBg: e.target.value,
                        },
                        element.type
                      )
                    }
                    onPaste={handlePaste}
                    className="contentEditable"
                    placeholder="Enter your text"
                  />
                  <ContentEditable
                    id="Added_Text"
                    html={element.content.titleEn}
                    tagName="p"
                    onChange={(e) =>
                      updateElement(
                        element.id,
                        {
                          titleEn: e.target.value,
                        },
                        element.type
                      )
                    }
                    onPaste={handlePaste}
                    className="contentEditable"
                    placeholder="Enter your text"
                  />
                  <label className="labelElementSmall">Quote</label>
                  <ContentEditable
                    id="Added_Text"
                    html={element.content.quoteBg}
                    tagName="p"
                    onChange={(e) =>
                      updateElement(
                        element.id,
                        {
                          quoteBg: e.target.value,
                        },
                        element.type
                      )
                    }
                    onPaste={handlePaste}
                    className="contentEditable"
                    placeholder="Enter your text"
                  />
                  <ContentEditable
                    id="Added_Text"
                    html={element.content.quoteEn}
                    tagName="p"
                    onChange={(e) =>
                      updateElement(
                        element.id,
                        {
                          quoteEn: e.target.value,
                        },
                        element.type
                      )
                    }
                    onPaste={handlePaste}
                    className="contentEditable"
                    placeholder="Enter your text"
                  />
                </div>
              </div>
            )}
            {element.type === "person" && (
              <div>
                <label className="labelElement">Person:</label>
                <label className="labelElementSmall">Image Behind</label>
                <div id="Added_One_Image">
                  <img
                    id="Added_One_Image_img"
                    src={URL + "/image?name=" + element.content.imageBack}
                    alt=""
                  />
                  <input
                    id=""
                    type="file"
                    onChange={(e) =>
                      updateElement(
                        element.id,
                        { imageBack: e.target.files[0] },
                        element.type
                      )
                    }
                    placeholder="Choose Image"
                  />
                </div>
                <label className="labelElementSmall">Image Front</label>
                <div id="Added_One_Image">
                  <img
                    id="Added_One_Image_img"
                    src={URL + "/image?name=" + element.content.imageFront}
                    alt=""
                  />
                  <input
                    id=""
                    type="file"
                    onChange={(e) =>
                      updateElement(
                        element.id,
                        { imageFront: e.target.files[0] },
                        element.type
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
                      },
                      element.type
                    )
                  }
                  onPaste={handlePaste}
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
                        textEn: e.target.value,
                      },
                      element.type
                    )
                  }
                  onPaste={handlePaste}
                  placeholder="Enter your text"
                />
              </div>
            )}
            {element.type === "slideshow" && (
              <div>
                <label className="labelElement">Slideshow:</label>
                <div id="Added_Slideshow">
                  {element.content.map((image, index) => (
                    <div style={{ width: "fit-content" }} key={index}>
                      <img
                        id="Added_One_Image_img"
                        src={URL + "/image?name=" + image}
                        alt=""
                      />
                      <br></br>
                      <input
                        id=""
                        type="file"
                        onChange={(e) =>
                          updateElement(
                            element.id,
                            { index, file: e.target.files[0] },
                            element.type
                          )
                        }
                        style={{ marginBottom: "8px" }}
                        placeholder="Choose Image"
                      />
                      <button
                        style={{ display: "block", marginTop: "0" }}
                        onClick={() =>
                          updateElement(
                            element.id,
                            { index, delete: true },
                            element.type
                          )
                        }
                      >Delete</button>
                    </div>
                  ))}
                </div>
                <label style={{ marginLeft: "10%", fontSize: "24px" }}>
                  New:
                  <input
                    type="file"
                    onChange={(e) =>
                      updateElement(
                        element.id,
                        { image: e.target.files[0] },
                        element.type
                      )
                    }
                    style={{ marginLeft: "8px" }}
                    placeholder="Choose Image"
                  />
                </label>
              </div>
            )}
            {element.type === "donation" && (
              <div className="donation">
                <h2 className="bg">Информация за даряване</h2>
                <h2 className="en">Donation Detials</h2>

                <h3 className="bg">Фундация Адгор</h3>
                <h3 className="en">Adgor Foundation</h3>
                <h3>IBAN: Намери и сложи IBAN</h3>
                <h3>BIC: Тук също</h3>

                <div className="donationSeperation"></div>

                <h4 className="bg">За повече информация не се колебай да се свържеш с нас</h4>
                <h4 className="en">For more information don't hesitate to contact us</h4>

                <button className="bg" onClick={() => window.location.href = "/page/contact"}>Свържи се с нас</button>
                <button className="en" onClick={() => window.location.href = "/page/contact"}>Contact us</button>
              </div>
            )}
            {element.type === "overlap" && (
              <div>
                <label className="labelElement">Covered Images:</label>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <div id="Added_One_Image">
                    <img
                      id="Added_One_Image_img"
                      src={URL + "/image?name=" + element.content.imageBack}
                      alt=""
                    />
                    <br></br>
                    <input
                      id=""
                      type="file"
                      onChange={(e) =>
                        updateElement(
                          element.id,
                          { imageBack: true, image: e.target.files[0] },
                          element.type
                        )
                      }
                      placeholder="Choose Back Image"
                    />
                  </div>
                  <div id="Added_One_Image">
                    <img
                      id="Added_One_Image_img"
                      src={URL + "/image?name=" + element.content.imageLeft}
                      alt=""
                    />
                    <br></br>
                    <input
                      id=""
                      type="file"
                      onChange={(e) =>
                        updateElement(
                          element.id,
                          { imageLeft: true, image: e.target.files[0] },
                          element.type
                        )
                      }
                      placeholder="Choose Left Image"
                    />
                  </div>
                  <div id="Added_One_Image">
                    <img
                      id="Added_One_Image_img"
                      src={URL + "/image?name=" + element.content.imageRight}
                      alt=""
                    />
                    <br></br>
                    <input
                      id=""
                      type="file"
                      onChange={(e) =>
                        updateElement(
                          element.id,
                          { imageRight: true, image: e.target.files[0] },
                          element.type
                        )
                      }
                      placeholder="Choose Right Image"
                    />
                  </div>
                </div>
                <div id="Added_Formated">
                  <MyCustomToolbar id={`toolbar-${element.id}-bg`} />
                  <ReactQuill
                    value={element.content.textBg}
                    onChange={(newContent) =>
                      updateElement(element.id, { textBg: newContent }, element.type)
                    }
                    modules={{
                      clipboard: {
                        matchVisual: false, // Prevent Quill from auto-inserting new lines
                      },
                      toolbar: {
                        container: `#toolbar-${element.id}-bg`,
                      },
                    }}
                  />
                </div>
                <div id="Added_Formated">
                  <MyCustomToolbar id={`toolbar-${element.id}-en`} />
                  <ReactQuill
                    value={element.content.textEn}
                    onChange={(newContent) =>
                      updateElement(element.id, { textEn: newContent }, element.type)
                    }
                    modules={{
                      clipboard: {
                        matchVisual: false, // Prevent Quill from auto-inserting new lines
                      },
                      toolbar: {
                        container: `#toolbar-${element.id}-en`,
                      },
                    }}
                  />
                </div>
              </div>
            )}
            {element.type === "section" && (
              <div id="section">
                <label className="labelElement">Section:</label>
                <ContentEditable
                  html={element.content.titleBg}
                  onChange={(e) =>
                    updateElement(element.id, {
                      titleBg: e.target.value,
                      titleEn: element.content.titleEn
                    })
                  }
                  onPaste={handlePaste}
                  tagName="p"
                  id="Added_Text"
                />
                <ContentEditable
                  html={element.content.titleEn}
                  onChange={(e) =>
                    updateElement(element.id, {
                      titleBg: element.content.titleBg,
                      titleEn: e.target.value
                    })
                  }
                  onPaste={handlePaste}
                  tagName="p"
                  id="Added_Text"
                />
              </div>
            )}
            {element.type === "gallery" && (
              <div>
                <label className="labelElement">Gallery:</label>
                <div id="Added_Slideshow">
                  {element.content.map((image, index) => (
                    <div style={{ width: "fit-content" }} key={index}>
                      <img
                        id="Added_One_Image_img"
                        src={URL + "/image?name=" + image}
                        alt=""
                      />
                      <br></br>
                      <input
                        id=""
                        type="file"
                        onChange={(e) =>
                          updateElement(
                            element.id,
                            { index, file: e.target.files[0] },
                            element.type
                          )
                        }
                        style={{ marginBottom: "8px" }}
                        placeholder="Choose Image"
                      />
                      <button
                        style={{ display: "block", marginTop: "0" }}
                        onClick={() =>
                          updateElement(
                            element.id,
                            { index, delete: true },
                            element.type
                          )
                        }
                      >Delete</button>
                    </div>
                  ))}
                </div>
                <label style={{ marginLeft: "0", fontSize: "24px" }}>
                  New:
                  <input
                    type="file"
                    onChange={(e) =>
                      updateElement(
                        element.id,
                        { image: e.target.files[0] },
                        element.type
                      )
                    }
                    style={{ marginLeft: "8px", marginTop: "32px" }}
                    placeholder="Choose Image"
                  />
                </label>
              </div>
            )}
            {element.type === "imageLinkList" && (
              <div>
                <label className="labelElement">Image Link List:</label>
                {element.content.links.map((link, index) => (
                  <div key={index} style={{ marginBottom: "18px" }}>
                    <img
                      id="Added_One_Image_img"
                      src={URL + "/image?name=" + link.image}
                      alt=""
                    />
                    <br></br>
                    <input
                      id=""
                      type="file"
                      onChange={(e) =>
                        updateElement(
                          element.id,
                          { id: link.id, image: e.target.files[0] },
                          element.type
                        )
                      }
                      placeholder="Choose Image"
                    />
                    <ContentEditable
                      html={link.titleBg}
                      onChange={(e) =>
                        updateElement(element.id, { id: link.id, titleBg: e.target.value }, element.type)
                      }
                      onPaste={handlePaste}
                      tagName="p"
                      id="Added_Text"
                    />
                    <ContentEditable
                      html={link.titleEn}
                      onChange={(e) =>
                        updateElement(element.id, { id: link.id, titleEn: e.target.value }, element.type)
                      }
                      onPaste={handlePaste}
                      tagName="p"
                      id="Added_Text"
                    />
                    <ContentEditable
                      html={link.url}
                      onChange={(e) =>
                        updateElement(element.id, { id: link.id, url: e.target.value }, element.type)
                      }
                      onPaste={handlePaste}
                      tagName="p"
                      id="Added_Text"
                    />
                    <button
                      style={{ display: "block", marginTop: "0" }}
                      onClick={() =>
                        updateElement(
                          element.id,
                          { id: link.id, delete: true },
                          element.type
                        )
                      }
                    >Delete</button>
                  </div>
                ))}

                <label style={{ display: "block", fontWeight: "bold", marginTop: "36px", fontSize: "1.5rem" }}>New:</label>
                <img
                  id="Added_One_Image_img"
                  src={URL + "/image?name=" + element.content.newLink.image}
                  alt=""
                />
                <input
                  type="file"
                  onChange={(e) =>
                    updateElement(
                      element.id,
                      { image: e.target.files[0] },
                      element.type + "-new"
                    )
                  }
                  style={{ marginLeft: "8px" }}
                  placeholder="Choose Image"
                />
                <ContentEditable
                  html={element.content.newLink.titleBg}
                  onChange={(e) =>
                    updateElement(element.id, { titleBg: e.target.value }, element.type + "-new")
                  }
                  onPaste={handlePaste}
                  tagName="p"
                  id="Added_Text"
                />
                <ContentEditable
                  html={element.content.newLink.titleEn}
                  onChange={(e) =>
                    updateElement(element.id, { titleEn: e.target.value }, element.type + "-new")
                  }
                  onPaste={handlePaste}
                  tagName="p"
                  id="Added_Text"
                />
                <ContentEditable
                  html={element.content.newLink.url}
                  onChange={(e) =>
                    updateElement(element.id, { url: e.target.value }, element.type + "-new")
                  }
                  onPaste={handlePaste}
                  tagName="p"
                  id="Added_Text"
                />
                <button
                  style={{ display: "block", marginTop: "0" }}
                  onClick={() =>
                    updateElement(
                      element.id,
                      { add: true },
                      element.type + "-new"
                    )
                  }
                >Add</button>
              </div>
            )}
            {element.type === "titleImage" && (
              <div>
                <label className="labelElement">Title with Image:</label>
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
                      { 
                        url: e.target.files[0],
                      },
                      element.type
                    )
                  }
                  placeholder="Choose Image"
                />
                <ContentEditable
                  html={element.content.titleBg}
                  onChange={(e) =>
                    updateElement(element.id, {
                      titleBg: e.target.value,
                      titleEn: element.content.titleEn,
                      url: element.content.url
                    })
                  }
                  onPaste={handlePaste}
                  tagName="p"
                  className="contentEditable"
                  id="Added_Text"
                />
                <ContentEditable
                  html={element.content.titleEn}
                  onChange={(e) =>
                    updateElement(element.id, {
                      titleBg: element.content.titleBg,
                      titleEn: e.target.value,
                      url: element.content.url
                    })
                  }
                  onPaste={handlePaste}
                  tagName="p"
                  className="contentEditable"
                  id="Added_Text"
                />
              </div>
            )}
            {element.type === "twoTitlesText" && (
              <div>
                <label className="labelElement">Two Titles and Text:</label>
                <ContentEditable
                  html={element.content.titleSmallBg}
                  onChange={(e) =>
                    updateElement(element.id, { titleSmallBg: e.target.value }, element.type)
                  }
                  onPaste={handlePaste}
                  className="contentEditable"
                  tagName="p"
                  id="Added_Text"
                />
                <ContentEditable
                  html={element.content.titleSmallEn}
                  onChange={(e) =>
                    updateElement(element.id, { titleSmallEn: e.target.value }, element.type)
                  }
                  onPaste={handlePaste}
                  style={{ marginBottom: "36px" }}
                  className="contentEditable"
                  tagName="p"
                  id="Added_Text"
                />
                <ContentEditable
                  html={element.content.titleBg}
                  onChange={(e) =>
                    updateElement(element.id, { titleBg: e.target.value }, element.type)
                  }
                  onPaste={handlePaste}
                  className="contentEditable"
                  tagName="p"
                  id="Added_Text"
                />
                <ContentEditable
                  html={element.content.titleEn}
                  onChange={(e) =>
                    updateElement(element.id, { titleEn: e.target.value }, element.type)
                  }
                  onPaste={handlePaste}
                  style={{ marginBottom: "36px" }}
                  className="contentEditable"
                  tagName="p"
                  id="Added_Text"
                />
                <div id="Added_Formated">
                  <MyCustomToolbar id={`toolbar-${element.id}-bg`} />
                  <ReactQuill
                    value={element.content.textBg}
                    onChange={(newContent) =>
                      updateElement(element.id, { textBg: newContent }, element.type)
                    }
                    modules={{
                      clipboard: {
                        matchVisual: false, // Prevent Quill from auto-inserting new lines
                      },
                      toolbar: {
                        container: `#toolbar-${element.id}-bg`,
                      },
                    }}
                  />
                </div>
                <div id="Added_Formated">
                  <MyCustomToolbar id={`toolbar-${element.id}-en`} />
                  <ReactQuill
                    value={element.content.textEn}
                    onChange={(newContent) =>
                      updateElement(element.id, { textEn: newContent }, element.type)
                    }
                    modules={{
                      clipboard: {
                        matchVisual: false, // Prevent Quill from auto-inserting new lines
                      },
                      toolbar: {
                        container: `#toolbar-${element.id}-en`,
                      },
                    }}
                  />
                </div>
              </div>
            )}
            {element.type === "quote" && (
              <div>
                <label className="labelElement">Quote:</label>
                <ContentEditable
                  html={element.content.quoteBg}
                  onChange={(e) =>
                    updateElement(element.id, { quoteBg: e.target.value, quoteEn: element.content.quoteEn }, element.type)
                  }
                  onPaste={handlePaste}
                  className="contentEditable"
                  tagName="p"
                  id="Added_Text"
                />
                <ContentEditable
                  html={element.content.quoteEn}
                  onChange={(e) =>
                    updateElement(element.id, { quoteEn: e.target.value, quoteBg: element.content.quoteBg }, element.type)
                  }
                  onPaste={handlePaste}
                  className="contentEditable"
                  tagName="p"
                  id="Added_Text"
                />
              </div>
            )}
            {element.type === "peopleList" && (
              <div>
                <label className="labelElement">People List:</label>

                {element.content.people.map((person, index) => (
                  <div style={{ marginBottom: "12px" }} key={index}>
                    <div style={{ display: "flex", justifyContent: "start", flexDirection: "row", gap: "12px", overflowX: "auto", paddingBottom: "12px" }}>
                      {person.images.map((image, imgIndex) => (
                        <div style={{ width: "fit-content" }} key={imgIndex}>
                          <img
                            id="Added_One_Image_img"
                            src={URL + "/image?name=" + image}
                            alt=""
                          />
                          <br></br>
                          <input
                            id=""
                            type="file"
                            onChange={(e) =>
                              updateElement(
                                element.id,
                                { image: e.target.files[0], index, imgIndex },
                                element.type
                              )
                            }
                            placeholder="Choose Image"
                          />
                          <button
                            style={{ display: "block", marginTop: "0" }}
                            onClick={() =>
                              updateElement(
                                element.id,
                                { index, imgIndex, deleteImg: true },
                                element.type
                              )
                            }
                          >Delete</button>
                        </div>
                      ))}
                    </div>
                    <label style={{ marginLeft: "0", fontSize: "24px" }}>
                      Add:
                      <input
                        type="file"
                        onChange={(e) =>
                          updateElement(
                            element.id,
                            { image: e.target.files[0], index },
                            element.type
                          )
                        }
                        style={{ marginLeft: "8px", marginTop: "32px" }}
                        placeholder="Choose Image"
                      />
                    </label>
                    <ContentEditable
                      html={person.nameBg}
                      onChange={(e) =>
                        updateElement(element.id, { nameBg: e.target.value, index }, element.type)
                      }
                      onPaste={handlePaste}
                      tagName="p"
                      id="Added_Text"
                    />
                    <ContentEditable
                      html={person.nameEn}
                      onChange={(e) =>
                        updateElement(element.id, { nameEn: e.target.value, index }, element.type)
                      }
                      onPaste={handlePaste}
                      tagName="p"
                      id="Added_Text"
                    />
                    <ContentEditable
                      html={person.textBg}
                      onChange={(e) =>
                        updateElement(element.id, { textBg: e.target.value, index }, element.type)
                      }
                      onPaste={handlePaste}
                      tagName="p"
                      id="Added_Text"
                    />
                    <ContentEditable
                      html={person.textEn}
                      onChange={(e) =>
                        updateElement(element.id, { textEn: e.target.value, index }, element.type)
                      }
                      onPaste={handlePaste}
                      tagName="p"
                      id="Added_Text"
                    />
                    <button
                      style={{ display: "block", marginTop: "0" }}
                      onClick={() =>
                        updateElement(
                          element.id,
                          { index, deletePerson: true },
                          element.type
                        )
                      }
                    >Delete Person</button>
                  </div>
                ))}

                <label style={{ display: "block", fontWeight: "bold", marginTop: "36px", fontSize: "1.5rem" }}>New:</label>
                <div style={{ display: "flex", justifyContent: "start", flexDirection: "row", gap: "12px", overflowX: "auto", paddingBottom: "12px" }}>
                {element.content.newPerson.images.map((image, index) => (
                  <div style={{ width: "fit-content" }} key={index}>
                    <img
                      id="Added_One_Image_img"
                      src={URL + "/image?name=" + image}
                      alt=""
                    />
                    <br></br>
                    <input
                      id=""
                      type="file"
                      onChange={(e) =>
                        updateElement(
                          element.id,
                          { image: e.target.files[0], index },
                          element.type + "-new"
                        )
                      }
                      placeholder="Choose Image"
                    />
                    <button
                      style={{ display: "block", marginTop: "0" }}
                      onClick={() =>
                        updateElement(
                          element.id,
                          { index, delete: true },
                          element.type + "-new"
                        )
                      }
                    >Delete</button>
                  </div>
                ))}
                </div>
                <label style={{ marginLeft: "0", fontSize: "24px" }}>
                  Add: 
                  <input
                    type="file"
                    onChange={(e) =>
                      updateElement(
                        element.id,
                        { image: e.target.files[0] },
                        element.type + "-new"
                      )
                    }
                    style={{ marginLeft: "8px", marginTop: "32px" }}
                    placeholder="Choose Image"
                  />
                </label>
                <ContentEditable
                  html={element.content.newPerson.nameBg}
                  onChange={(e) =>
                    updateElement(element.id, { nameBg: e.target.value }, element.type + "-new")
                  }
                  onPaste={handlePaste}
                  tagName="p"
                  id="Added_Text"
                />
                <ContentEditable
                  html={element.content.newPerson.nameEn}
                  onChange={(e) =>
                    updateElement(element.id, { nameEn: e.target.value }, element.type + "-new")
                  }
                  onPaste={handlePaste}
                  tagName="p"
                  id="Added_Text"
                />
                <ContentEditable
                  html={element.content.newPerson.textBg}
                  onChange={(e) =>
                    updateElement(element.id, { textBg: e.target.value }, element.type + "-new")
                  }
                  onPaste={handlePaste}
                  tagName="p"
                  id="Added_Text"
                />
                <ContentEditable
                  html={element.content.newPerson.textEn}
                  onChange={(e) =>
                    updateElement(element.id, { textEn: e.target.value }, element.type + "-new")
                  }
                  onPaste={handlePaste}
                  tagName="p"
                  id="Added_Text"
                />
                <button
                  style={{ display: "block", marginTop: "0" }}
                  onClick={() =>
                    updateElement(
                      element.id,
                      { add: true },
                      element.type + "-new"
                    )
                  }
                >Add</button>
              </div>
            )}
            {element.type === "separation" && <div className="line"></div>}

            <div className="options">
              <button
                id="Delete_button"
                onClick={() => deleteElement(element.id)}
              >
                <FaTrashCan />
              </button>
              <button
                style={{ marginTop: "0" }}
                onClick={() => {
                  const index = schema.findIndex((el) => el.id === element.id);
                  if (index > 0) {
                    const newSchema = [...schema];
                    [newSchema[index - 1], newSchema[index]] = [newSchema[index], newSchema[index - 1]];
                    setSchema(newSchema);
                  }
                }}
              >
                <FaChevronUp />
              </button>
              <button
                style={{ marginTop: "0" }}
                onClick={() => {
                  const index = schema.findIndex((el) => el.id === element.id);
                  if (index < schema.length - 1) {
                    const newSchema = [...schema];
                    [newSchema[index + 1], newSchema[index]] = [newSchema[index], newSchema[index + 1]];
                    setSchema(newSchema);
                  }
                }}
              >
                <FaChevronDown />
              </button>
            </div>
          </div>
        ))}

        <div className="element" >
          <label className="labelElement">{footerImage ? "Footer Image:" : "Choose image for the footer:"}</label>
          {footerImageEnable && footerImage && (
            <img
              id="Added_One_Image_img"
              src={URL + "/image?name=" + footerImage}
              style={{width: "100%"}}
              alt=""
            />
          )}
          <br></br>
          <label style={{marginRight: "12px"}}>
            <input
              type="checkbox"
              checked={footerImageEnable}
              onChange={(e) => setFooterImageEnable(e.target.checked)}
            />
            Enable Footer Image
          </label>
          <input
            type="file"
            onChange={(e) => uploadFooterImage(e.target.files[0])}
            placeholder="Choose Image"
            style={{marginBottom: "0"}}
          />
        </div>
      </div>

      {showPreview && (
        <div>
          <div
            className="preview"
            style={{position: "fixed", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "white", zIndex: "1000", overflowY: "auto", overflowX: "hidden"}}
            dangerouslySetInnerHTML={{ __html: previewContent }}
          />
          <button
            style={{position: "fixed", top: "12px", left: "12px", margin: "0", padding: "0", height: "32px", zIndex: "1001"}}
            onClick={() => setShowPreview(false)}
          >
            <IoClose />
          </button>
          <button
            style={{position: "fixed", top: "48px", left: "12px", margin: "0", padding: "0", height: "32px", zIndex: "1001"}}
            onClick={() => setLang(lang === "bg" ? "en" : "bg")}
          >
            <FaExchangeAlt />
          </button>
        </div>
      )}
    </div>
  );
}

export default Editor;
