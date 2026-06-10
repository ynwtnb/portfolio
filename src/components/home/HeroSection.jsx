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
            </a>
            . Prior to Ph.D., I completed my Bachelor's degree in Information Science 
            at the University of Tokyo, advised by{" "}
            <a href="https://lab.rekimoto.org/members/rekimoto/">
              Prof. Jun Rekimoto
            </a>
            . 

            My research develops <b>human-centered sensing and AI models for understanding and supporting relational well-being</b>. 
            I work at the intersection of <b>wearable computing, psychophysiology, machine learning, and human-computer interaction</b>.
            <br />
            <br />
            Across my projects, I ask <b>how noisy physiological and interaction data from everyday life can be made reliable, interpretable, and useful</b>. 
            This includes developing open-source tools for physiological signal quality control, 
            studying physiological linkage between close relationship partners, 
            and designing digital interventions that help couples reflect on communication and emotional needs. 
            I also apply wearable-based machine learning to model affective and behavioral states, including aggression prediction in autistic children.
            <br />
            <br />
            Together, my work aims to advance both the methodological foundations of psychophysiological research 
            and the design of technologies that support healthier relationships and better emotional understanding.

            <br />
            If you are interested in learning more about me, please check out my <a href={`${import.meta.env.BASE_URL}curriculum_vitae_YunaWatanabe.pdf`} target="_blank" rel="noreferrer">curriculum vitae</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
