import React from "react";

/**
 * Hero section.
 * Class names/structure are kept compatible with public/CSS/style.css.
 */
export default function HeroSection() {
  return (
    <div className="first-v">
      <div className="first-v_image">
        <img src={`${import.meta.env.BASE_URL}img/headshot.jpg`} alt="Yuna Watanabe" />
        <div className="social-links">
          <a className="social-link" href="https://scholar.google.com/citations?user=JaFo_r8AAAAJ&hl=en" target="_blank" rel="noreferrer">
            <img className="social-icon" src={`${import.meta.env.BASE_URL}img/googlescholar-icon.png`} alt="Google Scholar" />
            <span className="social-label">Google Scholar</span>
          </a>
          <a className="social-link" href="https://github.com/ynwtnb" target="_blank" rel="noreferrer">
            <img className="social-icon" src={`${import.meta.env.BASE_URL}img/github-icon.png`} alt="GitHub" />
            <span className="social-label">GitHub</span>
          </a>
          <a className="social-link" href="https://www.linkedin.com/in/yuna-watanabe-15497a220/" target="_blank" rel="noreferrer">
            <img className="social-icon" src={`${import.meta.env.BASE_URL}img/linkedin-icon.png`} alt="LinkedIn" />
            <span className="social-label">LinkedIn</span>
          </a>
        </div>
      </div>
      
      <div className="first-v_text">
        <div className="name">Yuna Watanabe</div>
        <hr className="name-line" />
        <div className="first-v_profile">
          <div className="aboutme">
            I am a Ph.D. student in the{" "}
            <a href="https://phi.khoury.northeastern.edu/">
              Personal Health Informatics Program
            </a>{" "}
            at Northeastern University, advised by{" "}
            <a href="https://www.khoury.northeastern.edu/people/matthew-goodwin/">
              Prof. Matthew Goodwin
            </a>{" "} and {" "}
            <a href="https://www.khoury.northeastern.edu/people/varun-mishra/">
              Prof. Varun Mishra
            </a>{" "}
            . I am intersted in quantifying and improving
            psychological well-being by leveraging physiological data,
            particularly focusing on enhancing communication between couples. 
            I am also interested in enhancing the validity and reproducibility of psychophysiological
            research by developing open-source signal analysis tools. <br /><br />

            My ongoing projects include:
            <ul className="ongoing-projects">
              <li>
                <b>Quality control for ambulatory physiological data</b>: Develop algorithms and interactive dashboards for researchers to 
                adaptively preprocess and quantify data quality of physiological signals, such as photoplethysmography (PPG) and electrodermal activity (EDA).
              </li>
              <li>
                <b>Physiological linkage</b>: Investigate how dyads' physiological responses are linked across different relationship dynamics and interaction contexts.
              </li>
              <li>
                <b>Digital interventions for couples</b>: Co-design digital interventions for couples to enhance communication and relationship satisfaction.
              </li>
              <li>
                <b>Aggression prediction of children with autism</b>: Predict aggressive behaviors of children with autism using machine learning and deep learning techniques.
              </li>
            </ul>
            <br />
            If you are interested in learning more about me, please check out my <a href={`${import.meta.env.BASE_URL}curriculum_vitae_YunaWatanabe.pdf`} target="_blank" rel="noreferrer">curriculum vitae</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
