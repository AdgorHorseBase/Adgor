import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import "./page.css"
const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const MenuSections = () => {
  const [structure, setStruct] = useState(false)

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

  return (
    <>
      <button onClick={() => { document.location.href = "/" }}>Home</button>
      {Object.keys(structure).map((dir) => (
        structure[dir].type === 'directory' ? structure[dir].contents && (
          <select
            key={dir} // Ensures each <select> element has a unique key
            onChange={(e) => { window.location.href = e.target.value; }}
          >
            <option value="">{dir.slice(1)}</option>
            {structure[dir].contents.map((page, index) => (
              <option key={`${dir}-${page}-${index}`} value={`/page${dir}/${page}`}>
                {page}
              </option>
            ))}
          </select>
        ) :
        structure[dir].type === 'file' && (
          <button key={dir} onClick={() => { document.location.href = `/page${dir}` }}>
            {dir.slice(1)}
          </button>
        )
      ))}
    </>
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

    console.log(elementsBg, elementsEn);

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
      <br />
      <br />
      <button onClick={() => { document.location.href = "/products" }}>Products</button>
      <button onClick={() => { document.location.href = "/vouchers" }}>Vouchers</button>

      <h1 className='bg'>{titleBg}</h1>
      <h1 className='en'>{titleEn}</h1>

      <div dangerouslySetInnerHTML={{ __html: pageContent }} />
    </div>
  );
}

export {Page, MenuSections};