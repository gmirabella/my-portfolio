export type Project = {
  id: number;
  title: string;
  description: string;
  tools?:string,
  posterImage: string;
  youtubeId?: string;
  file?: string;
  link?: string;
};

export const projects: Project[] = [
  {
    id: 0,
    title: 'Now - Short Animation',
    description:"A contemplative traditional frame-by-frame animation inspired by Wim Wenders's film Perfect Days.",
    tools: 'Tools: Clip Studio Paint, Hand drawing, Chai tea',
    posterImage: '/images/now.png',
    youtubeId: '99q9iHmjKlM',
  },
  {
    id: 1,
    title: 'Well - Short Animation',
    description: 'An experimental hand-drawn frame-by-frame animation with AI-generated elements, organic and synthetic creativity.',
    tools: 'Tools: Flipaclip, Hand drawing, Runway Gen Turbo AI',
    posterImage: '/images/well-1.png',
    youtubeId: 'WE7KpbhNgRE',
  },
  {
    id: 3,
    title: 'Ring of Fire',
    description: 'A dystopian visual narrative combining AI-generated imagery with motion graphics. Trying to hallucinate AI and overcomes its boundaries with bloods and fire.',
    tools: 'Tools: Midjourney, Runway Gen2, After Effects',
    posterImage: '/images/cyborg.png',
    youtubeId: 'woDz7LheeGc',
  },
  {
    id: 4,
    title: 'Oasi Meccanica - One Year Later',
    description: 'A follow-up exploration to the original Oasi Meccanica concept, utilizing the latest AI video generation technology. This piece presents a mechanical oasis where nature and technology coexist.',
    tools: 'Tools: Midjourney, Runway Gen3, DaVinci Resolve, Night Market Of Ghosts music',
    posterImage: '/images/building.png',
    youtubeId: 'JOucMxN4gEU',
  },
  {
    id: 5,
    title: 'Born - Very Short Animation',
    description:
      'A minimalist traditional frame-by-frame animation created as part of an Adobe Animate learning course. Very very very short.',
    tools: 'Tools: Adobe Animate, Hand drawing, incompetence',
    posterImage: '/images/born.png',
    youtubeId: 'Kwc8WceOHlQ',
  },
  {
    id: 6,
    title: 'Boring Day #1 - Comics',
    description: 'Just a page of comic drawing by someone who is not a comic artist. Course: Clip Studio Paint',
    tools: 'Tools: Clip Studio Paint, hands, my dog Lev',
    posterImage: '/images/boring.png',
    file: '/boring-day.jpg',
    // link: 'https://www.webtoons.com/en/canvas/boring-day/boring-day/viewer?title_no=1040158&episode_no=1'
  },
  {
    id: 7,
    title: 'Letter To Human',
    description:
      'A multi-layered AI-generated narrative that presents a robot\'s perspective on human existence. Leopardi letter to his father did the most of the work.',
    tools: 'Tools: Midjourney, Runway Gen2, Pika Labs, Eleven Labs, Premiere Pro',
    posterImage: '/images/robot-yellow.png',
    youtubeId: '0YGF0MVKbvc',
  },
  {
    id: 8,
    title: 'Visit Macondo [A Midjourney Experiment]',
    description: 'A visual homage to Gabriel García Márquez\'s magical realism, reimagined through AI-generated imagery. This project uses Midjourney V5 to create a series of dreamlike scenes inspired by the fictional town of Macondo.',
    tools: 'Tools: Midjourney V5, Photoshop, Creative imagination',
    posterImage: '/images/woman.png',
    youtubeId: 'whZD8iQOgFM',
  },
  {
    id: 9,
    title: 'Tastless Chambella',
    description: 'A 3D modeling and rendering project of a donut called Chambella. That\'s it.',
    tools: 'Tools: Blender 3D, Cycles renderer, Patience',
    posterImage: '/images/chambella.png',
  },
  {
    id: 10,
    title: 'Famagosta - Music WebGame',
    description: 'An interactive web-based musical experience that combines game mechanics with audio-visual storytelling. Built in Unity 3D, this project creates an immersive environment where players can explore sound through movement and interaction.',
    tools: 'Tools: Unity 3D, C#, Web deployment, Federico',
    posterImage: '/images/famagosta.png',
    youtubeId: 'cZKE2LGt6A0',
  },
  {
    id: 11,
    title: 'D.O.A - Music Video',
    description: 'A perspective-flipping video that exposes the grotesque communication strategies used to exploit stories of unaccompanied minor migrants for political gain. Rather than adding to the noise, this piece simply reverses roles.',
    tools: 'Tools: Final Cut Pro, Color grading, Audio sync, Creative editing',
    posterImage: '/images/doa.png',
    youtubeId: 's61KB93Yi-c',
  },
];


