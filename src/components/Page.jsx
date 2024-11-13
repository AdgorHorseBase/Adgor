import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import "./page.css"
const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const MenuSections = () => {
  const [structure, setStruct] = useState(false);
  const [lang, setLang] = useState('bg');
  const titlesFetched = useRef(false);

  useEffect(() => {
    const getStruct = async () => {
      try {
        const schema = await axios.get(`/server/files/structure.json`);
        setStruct(schema.data);
      } catch(err) {
        console.log("Error:", err);
      }
    }

    getStruct();
  }, [])

  useEffect(() => {
    const fetchTitles = async (structure) => {
      const updatedStructure = { ...structure };

      for (const dir in updatedStructure) {
        if (updatedStructure[dir].type === 'directory') {
          for (const page of updatedStructure[dir].contents) {
            try {
              const titleResponse = await axios.get(`/server/uploads${dir}/${page}/schema.json`);
              updatedStructure[dir].directoryBg = titleResponse.data.directoryBg ?? "";
              updatedStructure[dir].contents = updatedStructure[dir].contents.map(p => 
                p === page ? { page, titleBg: titleResponse.data.titleBg, titleEn: titleResponse.data.titleEn, directoryBg: titleResponse.data.directoryBg ?? "Directory" } : p
              );
            } catch (err) {
              console.log(`Error fetching title for ${dir}/${page}:`, err);
            }
          }
        } else if (updatedStructure[dir].type === 'file') {
          try {
            const titleResponse = await axios.get(`/server/uploads${dir}/schema.json`);
            updatedStructure[dir] = { ...updatedStructure[dir], titleBg: titleResponse.data.titleBg, titleEn: titleResponse.data.titleEn };
          } catch (err) {
            console.log(`Error fetching title for ${dir}:`, err);
          }
        }
      }

      setStruct(updatedStructure);
    };

    if (structure && !titlesFetched.current) {
      fetchTitles(structure);
      titlesFetched.current = true;
    }
  }, [structure]);

  useEffect(() => {
    if (localStorage.getItem('lang')) {
      setLang(localStorage.getItem('lang'));
    }
  }, [localStorage.getItem('lang')]);

  return (
    <div className='Menu'>
      <button onClick={() => { document.location.href = "/" }}>{lang === 'bg' ? 'Начало' : 'Home'}</button>
      {titlesFetched.current && Object.keys(structure).map((dir, index) => (
        <React.Fragment key={dir}>
          {structure[dir].type === 'directory' ? structure[dir].contents && (
            <div className="directory-menu">
              <p className="directory-name">{lang === "bg" ? structure[dir].directoryBg : dir.slice(1, dir.length)}</p>
              <ul className="page-list">
                {structure[dir].contents.map((page, index) => (
                  <li key={`${dir}-${index}`}>
                    <a href={`/page${dir}/${page.page}`}>
                      {lang === 'bg' ? page.titleBg : page.titleEn}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) :
          structure[dir].type === 'file' && (
            <button onClick={() => { document.location.href = `/page${dir}` }}>
              {lang === 'bg' ? structure[dir].titleBg : structure[dir].titleEn}
            </button>
          )}
        </React.Fragment>
      ))}
      <button className="dot" onClick={() => { document.location.href = "/products" }}>{lang === "bg" ? "Продукти" : "Products"}</button>
      <button onClick={() => { document.location.href = "/vouchers" }}>{lang === "bg" ? "Ваучери" : "Vouchers"}</button>
      {lang === "bg" ? (
        <button onClick={() => { localStorage.setItem('lang', 'en'); window.location.reload(); }}>Switch to english</button>
      ) : (
        <button onClick={() => { localStorage.setItem('lang', 'bg'); window.location.reload(); }}>Смени на български</button>
      )}
    </div>
  )
}

function Page() {
  const [pageContent, setPageContent] = useState('Loading...');
  const [titleBg, setTitleBg] = useState("Blog");
  const [titleEn, setTitleEn] = useState("Blog");
  const location = useLocation(); // To get the current path

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        // Extracting the dynamic part of the path after "/page/"
        const pagePath = location.pathname.replace('/page/', '');

        const response = await axios.get("/server/uploads/"+pagePath+"/page.json");
        const content = response.data;

        const title = await axios.get("/server/uploads/"+pagePath+"/schema.json");

        // Set the response data (HTML) to state
        setPageContent(content);
        setTitleBg(title.data.titleBg);
        setTitleEn(title.data.titleEn);
      } catch (error) {
        console.error('Error fetching page content:', error);
        setPageContent('<p>Failed to load page content.</p>');
      }
    };

    fetchPageContent();
  }, [location]);

  const [lang, setLang] = useState('bg');

  useEffect(() => {
    if (localStorage.getItem('lang')) {
      setLang(localStorage.getItem('lang'));
    }
  }, [localStorage.getItem('lang')]);

  useEffect(() => {
    const elementsBg = document.querySelectorAll('.bg');
    const elementsEn = document.querySelectorAll('.en');

    if (lang === 'en') {
      elementsBg.forEach(el => el.style.display = 'none');
      elementsEn.forEach(el => el.style.display = 'block');
    } else if (lang === 'bg') {
      elementsBg.forEach(el => el.style.display = 'block');
      elementsEn.forEach(el => el.style.display = 'none');
    }
  }, [lang, pageContent]);

  return (
    <div>
      <MenuSections />

      <h1 className='bg'>{titleBg}</h1>
      <h1 className='en'>{titleEn}</h1>

      <div dangerouslySetInnerHTML={{ __html: pageContent }} />
    </div>
  );
}

export {Page, MenuSections};