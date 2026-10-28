// Content for the /quals page. Fill in each field; anything left as null/empty
// renders as a "TBD" placeholder so missing items are easy to spot.
// Put PDFs in public/quals/ and reference them as "quals/<file>"; full URLs also work.
// Long text fields can hold several paragraphs separated by blank lines.

export const STUDENT = "Yuna Naito";

export const RESEARCH_CORE = {
  examiners: "Matthew S. Goodwin, PhD and Varun Mishra, PhD (advisors)",
  paper: {
    title:
      "A Context-Aware Framework for Optimal Filter Parameter Selection: Enhancing PRV Estimation in Wearable Wrist PPG Signals",
    authors: ["Yuna Naito", "Natasha Yamane", "Aarti Sathyanarayana", "Matthew S. Goodwin", "Varun Mishra"],
    abstract:
      "Wearable biosensing allows for continuous monitoring and intervention in daily settings. Wrist photoplethysmography (PPG) is a commonly used method for measuring cardiac activity ambulatorily. A typical data preprocessing step is to apply a fixed, one-size-fits-all band-pass filter before peak detection and pulse rate variability (PRV) calculation. However, our analyses reveal that fixed filtering can cause significant errors in PRV estimation even with minimal motion artifacts, and the best filter settings differ across individuals and contextual states. Based on these findings, we introduce a person- and context-aware framework to adaptively select filter parameters at a window level. We instantiate this framework using models that gate segments by signal quality and select band-pass cutoff frequencies for each window. In tests across three datasets, our adaptive method improved PRV (RMSSD) accuracy by up to 279ms compared to a fixed filter and enhanced stress detection. It also increased the amount of usable inter-beat intervals without losing accuracy. Our collective results suggest shifting focus from solely removing motion artifacts toward adaptive selection of filter configurations that considers who is being measured and their state.",
    pdf: "https://dl.acm.org/doi/abs/10.1145/3831657",
  },
  venue:
    "Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies (IMWUT)",
  venueJustification:
    "This paper has been published in the Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies (IMWUT) and was presented at the ACM UbiComp/ISWC 2026 Conference in Shanghai. IMWUT/UbiComp is the premier venue for ubiquitous and mobile computing research, highly selective with rigorous peer review, and recognized internationally as the flagship conference in this field with an acceptance rate in the 20-22% range.",
  examinerStatement:
    "In the paper, “A Context-Aware Framework for Optimal Filter Parameter Selection: Enhancing PRV Estimation in Wearable Wrist PPG Signals,” Yuna made the central intellectual and technical contributions to developing a new person- and context-aware approach for preprocessing physiological signals from wearable devices. She identified a fundamental limitation in the prevailing use of fixed, one-size-fits-all filters: even in the absence of substantial motion artifacts, these filters can introduce significant errors in beat detection and pulse rate variability estimation, with the optimal parameters differing across individuals and physiological states. Yuna led the development of a framework that assesses signal quality, identifies whether corrupted signal segments can be recovered, and adaptively selects filtering parameters for each person and contextual window. Yuna also led the extensive empirical evaluation of this framework. She developed and compared rule-based and machine-learning implementations, evaluated them across multiple datasets, wearable devices, and beat-detection algorithms, and examined their impact on both physiological measurement accuracy and a downstream stress-detection task. The resulting methods reduced errors in pulse rate variability estimates by as much as 279 milliseconds, substantially increased the amount of usable physiological data, and generalized to devices and algorithms that were not used to train the models. Throughout this project, Yuna demonstrated strong independence, technical depth, creativity, and persistence. She transformed an initially observed signal-processing problem into a broadly applicable research framework, designed the necessary methodological and modeling components, conducted a rigorous series of validation studies, and helped make the resulting models and code publicly available. Her ability to connect fundamental questions about physiological measurement validity with practical solutions for wearable health research demonstrates both strong scientific judgment and the capacity to carry an ambitious project from initial insight through publication. These contributions provide compelling evidence of her potential to conduct impactful, independent research at the intersection of ubiquitous computing, physiological sensing, and digital health.",
  examinerStatementBy: "Prof. Varun Mishra, co-advisor",
  status: "Accepted and published (Vol. 10, No. 3, Article 167, September 2026)",
  presentationDate: "October 13, 2026 (UbiComp/ISWC 2026)",
};

// Health and Technical components share the same fields.
const emptyComponent = () => ({
  topic: null, // Description of the exam topic and why it was selected
  examiner: {
    name: null,
    title: null,
    whySelected: null,
  },
  structure: null, // How the exam was structured, and why
  workProduct: null, // Link to the work product
  presented: null, // Optional: where the work was presented
  completedDate: null,
});

export const HEALTH = {
  topic:
    "My health component examined the association between interpersonal physiological linkage—the coordination of physiological activity between people—and relationship and interaction outcomes through a systematic review and meta-analysis. The review focused on measures such as heart rate, heart rate variability, and electrodermal activity, examining their associations with relationship quality, socioemotional interaction quality, affect, and joint performance. I selected this topic because my dissertation will focus on dyadic social computing, and understanding how physiological linkage relates to interpersonal functioning provides a foundation for that work. The project also allowed me to critically evaluate physiological linkage as an indicator of positive social connection and examine how differences in physiological measures, interaction contexts, and analytical approaches contribute to inconsistent findings.",
  examiner: {
    name: "Joshua Curtiss, PhD",
    title:
      "Assistant Professor of Counseling Psychology, Department of Applied Psychology, Bouvé College of Health Sciences, Northeastern University",
    whySelected:
      "I selected Dr. Curtiss for his expertise in computational clinical psychology, emotion regulation, and advanced statistical methods, including time-series analysis and meta-analysis. His combination of psychological and methodological expertise was particularly relevant to evaluating both the substantive interpretation of physiological linkage and the statistical challenges involved in synthesizing findings across heterogeneous studies.",
  },
  structure:
    "The exam was structured as a systematic literature review and quantitative meta-analysis, culminating in a written manuscript. The work involved screening studies, extracting and coding physiological linkage measures and interpersonal outcomes, synthesizing effect sizes while accounting for their dependence within studies, and examining potential moderators and the robustness of the findings. We initially approached the project as a mapping review. However, as we identified numerous potential moderators and found that prior meta-analyses had not comprehensively investigated these sources of variation, we expanded the project into a systematic review and meta-analysis. This approach enabled us to quantitatively examine how physiological, contextual, and methodological factors shape the association between physiological linkage and interpersonal outcomes.",
  workProduct: "healthqual_paper_linkage_relationship_dynamics.pdf",
  completedDate: "October 28, 2026",
};

export const TECHNICAL = {
  topic:
    "My technical component examined how filtering and preprocessing choices affect the accuracy of physiological measurements derived from wearable photoplethysmography (PPG) signals. The work focused on estimating interbeat intervals and pulse rate variability, investigating how appropriate filtering strategies vary across individuals and tasks. I selected this topic because reliable physiological measurement is foundational to my dissertation research in dyadic social computing, particularly when interpreting physiological signals in relation to interpersonal processes. The project provided an opportunity to develop expertise in physiological signal processing and computational evaluation while critically examining the limitations of applying fixed preprocessing methods across different people and contexts.",
  examiner: {
    name: "Varun Mishra, PhD",
    title:
      "Assistant Professor (joint appointment), Khoury College of Computer Sciences and Bouvé College of Health Sciences, Northeastern University",
    whySelected:
      "We selected Dr. Mishra for his expertise in physiological sensing and computational approaches to mobile and wearable health technologies. His background was particularly relevant to evaluating the technical implementation of filtering methods and their implications for physiological measurement and health research. At the time of his selection as examiner, Dr. Mishra was not my co-advisor; he has since become my co-advisor.",
  },
  structure:
    "The exam was structured as an empirical research project culminating in the workshop paper “Beyond Motion Artifacts: Optimizing PPG Preprocessing for Accurate Pulse Rate Variability Estimation,” submitted to the 10th International Workshop on Mental Health and Well-being at UbiComp 2025. The project involved implementing and comparing PPG filtering strategies, evaluating their effects on interbeat interval and pulse rate variability estimation, and interpreting differences across individuals and tasks. This format was selected to demonstrate my ability to apply signal-processing methods to physiological data, critically evaluate methodological choices, and communicate the findings in a research paper. The workshop format also provided an opportunity to discuss the implications of preprocessing choices with researchers working on wearable sensing and mental health.",
  workProduct: "https://dl.acm.org/doi/abs/10.1145/3714394.3756241",
  presented: "The 10th International Workshop on Mental Health and Well-being, UbiComp/ISWC 2025",
  completedDate: "July 4, 2025",
};

export const UPDATED = "2026-10-28";
