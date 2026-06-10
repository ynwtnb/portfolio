// Central project metadata used across the home page and project detail pages.
//
// If you update a project's summary here, both the home page list and the project pages
// will stay in sync.

export const projects = [
  {
    id: "couple-intervention",
    title: "Attunement-supporting intervention for couples",
    status: "ongoing",
    labTag: { label: "Computational Behavioral Science Lab & UbiWell Lab", className: "lab-tag-CBSL-UW" },
    image: `${import.meta.env.BASE_URL}img/couple-intervention.png`,
    href: null,
    summary: "Healthy romantic relationships are critical for our well-being and health, and it is important to address misattunement or relationship distress early on. \
    However, many couples do not seek help until their relationship is severely distressed. \
    We conduct needs assessment and design an intervention that support couples' attunement and relationship quality in their daily lives."
  },
  {
    id: "physio-preprocessing",
    title: "Physiological signal processing",
    status: "ongoing",
    labTag: { label: "Computational Behavioral Science Lab & UbiWell Lab", className: "lab-tag-CBSL-UW" },
    image: `${import.meta.env.BASE_URL}img/filter-optimization-concept.png`,
    href: null,
    summary: "Physiological signals collected with wearable devices need to be properly preprocessed to avoid impacts of artifacts. \
    However, the preprocessing steps and parameters vary across studies, and there is often no consensus on the optimal preprocessing pipeline. \
    To improve the accuracy, reliability, and validity of downstream analyses, we develop frameworks, algorithms, and tools for physiological signal preprocessing, \
    including a context-aware filter optimization framework for wrist PPG signals.",
  },
  {
    id: "heartview",
    title: "PhysioView",
    status: "ongoing",
    labTag: { label: "Computational Behavioral Science Lab & UbiWell Lab", className: "lab-tag-CBSL-UW" },
    image: `${import.meta.env.BASE_URL}img/heartview.jpg`,
    // href: "/heartview",
    href: "https://github.com/cbslneu/physioview",
    summary: "Wearable sensing systems enable the collection of peripheral physiological data relatively easily. \
    However, data collected with these devices are more susceptible to artifacts than traditional systems, which increases missing or distorted data. \
    We develop an open-source software tool, PhysioView, which allows researchers and clinicians to preprocess, visualize, and control the quality of multimodal physiological signals.",
  },
  {
    id: "benchmark",
    title: "Wearable device benchmarking under mental and physical stress",
    status: "ongoing",
    labTag: { label: "Computational Behavioral Science Lab & UbiWell Lab", className: "lab-tag-CBSL-UW" },
    image: `${import.meta.env.BASE_URL}img/smartwatch.jpg`,
    href: null,
    summary: "Wearable devices are becoming increasingly popular for collecting ambulartoy physiological data. \
    However, each device uses its unique internal algorithms to process the data, and researchers often rely on the manufacturer's data processing algorithms. \
    In this project, we benchmark different consumer-grade or research-grade wearable devices to evaluate and compare the accuracy and validity of their outputs. \
    We also investigate how the quality of the data is affected by the presence of mental and physical stress.",
  },
  {
    id: "linkage",
    title: "Physiological linkage",
    status: "ongoing",
    labTag: { label: "Computational Behavioral Science Lab", className: "lab-tag-CBSL" },
    image: `${import.meta.env.BASE_URL}img/multimodal-visualization.png`,
    href: null,
    summary: "When more than two people interact, their physiological responses often show linked patterns, a phenomenon known as physiological linkage or synchrony. \
    Research shows mixed results on how physiological linkage is linked to relationship dynamics and quality. To better understand this phenomenon and \
    improve the reproducibility of research in this area, we develop a interactive data visualization dashboard for researchers to explore and analyze physiological linkage patterns. \
    We also conduct a meta-analysis to synthesize the existing research findings about the relationship between physiological linkage and relationship dynamics.",
  },
  {
    id: "aggression",
    title: "Aggression prediction",
    status: "ongoing",
    labTag: { label: "Computational Behavioral Science Lab", className: "lab-tag-CBSL" },
    image: `${import.meta.env.BASE_URL}img/child-frustration.jpg`,
    href: null,
    summary: "Autism is one of the most prevalent childhood disorders, and aggressive behaviors are one of the most challenging symptoms to manage. \
    Unpredictable and severe aggressive behaviors prevent children with autism from participating in social activities and learning. \
    In this project, we build machine learning and deep learning models to prediction of aggressive behaviors, \
    with the goal of enabling earlier and safer interventions for caregivers and clinicians. We also investigate how physiological data, such as \
    photoplethysmography (PPG) and electrodermal activity (EDA), provide predictive value for aggressive behaviors.",
  },
  {
    id: "synchrobot",
    title: "Synchrobot",
    status: "past",
    labTag: { label: "SPIN Lab (Intern at UBC)", className: "lab-tag-SPIN" },
    image: `${import.meta.env.BASE_URL}img/synchrobot.jpg`,
    // href: "/synchrobot",
    href: null,
    summary: "\"Physiological Synchrony\" is a phenomenon that physiological signals (e.g., heartbeat, respiration, and electrodermal activity) synchronize between individuals. This phenomenon is suggested to correlate with various interpersonal relationships, including teamwork. Since previous research indicated that haptic feedback could change our physiological signals, we hypothesized that receiving haptic feedback on a partner's heartbeat could enhance physiological synchrony and improve the quality of collaboration. We developed haptic robots that moved according to the collaborator's heartbeat and ran a user study to test this hypothesis.",
  },
  {
    id: "openrbsync",
    title: "OpenRBSync",
    status: "past",
    labTag: { label: "Human Augmentation Lab", className: "lab-tag-HAL" },
    image: `${import.meta.env.BASE_URL}img/openrbsync.png`,
    // href: "/openrbsync",
    href: "https://github.com/ynwtnb/OpenRBSync",
    summary: "\"Physiological synchrony,\" a phenomenon that the physiological signals of individuals synchronize, is attracting attention in psychology, neuroscience, and cognitive science. However, while physiological synchrony in a remote environment is an essential and interesting topic under the growing needs of remote communication, there has been limited research investigating it. To stimulate research in this field, we developed OpenRBSync, an open-source toolkit to acquire and save time-synchronized biosignals in remote environments. We plan to conduct a user study exploring how visualizing synchrony affects communication.",
  },
  {
    id: "tleap",
    title: "T-Leap",
    status: "past",
    labTag: { label: "Information Somatics Lab", className: "lab-tag-ISL" },
    image: `${import.meta.env.BASE_URL}img/tleap.jpg`,
    // href: "/tleap",
    href: null,
    summary: "Telepresence, technologies which allow remote persons to feel as if they were present, is a growing field, especially during the pandemic. There have been many research projects in this field; however, many require a complicated robot company or provide a first-person view to remote users. We were developing T-Leap, a wearable technology that can bring the remote person the experience of walking next to the user. It has a 360-degree camera on the user's shoulder and shares the video with remote persons. We investigated how this technology can facilitate communication between users in various settings, including remote shopping and museum guides. Also, extending this system, we designed a technology that allows users to share the video of surrounding environments simultaneously.",
  },
  {
    id: "virtual-coembodiment",
    title: "Virtual Co-embodiment",
    status: "past",
    labTag: { label: "Cyber Interface Lab", className: "lab-tag-CIL" },
    image: `${import.meta.env.BASE_URL}img/virtual-coembodiment.jpg`,
    // href: "/virtual-coembodiment",
    href: null,
    summary: "Virtual Co-embodiment is a fused body that two users can operate together. This system may be used in communicating physical motions, such as skill transfer in sports. Therefore, to use it effectively, it was important to explore cognitive features under this system. Previous studies suggested that this system may allow users to communicate their intention of actions with the partner user, which is close to the psychological mode, 'we-mode.' Therefore, we hypothesized that virtual co-embodiment could establish we-mode and ran a study to test this.",
  },
];

export function getProjectById(id) {
  return projects.find((p) => p.id === id);
}
