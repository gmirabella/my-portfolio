export type Project = {
  id: number;
  title: string;
  description: string;
  posterImage: string;
  youtubeId?: string;
  file?: string;
  tools?: string;
  link?: string;
};

export const projects: Project[] = [
  {
    id: 0,
    title: 'Now - Short Animation',
    description:
      "System Report: Traditional Frame by Frame Animation inspired by Wim Wenders's film Perfect Days.",
    tools: 'Tools: Clip Studio Paint, Hand drawing, Chai tea',
    posterImage: '/images/now.png',
    youtubeId: '99q9iHmjKlM',
  },
  {
    id: 1,
    title: 'Well - Short Animation',
    description: 'Traditional Frame by Frame Animation Experimental.',
    tools: 'Tools: Flipaclip, Hand drawing, Runway Gen Turbo AI',
    posterImage: '/images/well-1.png',
    youtubeId: 'WE7KpbhNgRE',
  },
  {
    id: 3,
    title: 'Ring of Fire',
    description: 'Midjourney + RunwayGen2 Project.',
    posterImage: '/images/cyborg.png',
    youtubeId: 'woDz7LheeGc',
  },
  {
    id: 4,
    title: 'Oasi Meccanica - One Year Later',
    description: 'Midjourney + RunwayGen3 Project.',
    posterImage: '/images/building.png',
    youtubeId: 'JOucMxN4gEU',
  },
  {
    id: 5,
    title: 'Born - Very Short Animation',
    description:
      'Traditional Frame by Frame Animation (Learning Course Adobe Animate).',
    posterImage: '/images/born.png',
    youtubeId: 'Kwc8WceOHlQ',
  },
  {
    id: 6,
    title: 'Boring Day #1 - Comics',
    description: 'Clip Studio Paint - Comic Course.',
    posterImage: '/images/boring.png',
    file: '/boring-day.jpg',
    // link: 'https://www.webtoons.com/en/canvas/boring-day/boring-day/viewer?title_no=1040158&episode_no=1'
  },
  {
    id: 7,
    title: 'Letter To Human',
    description:
      'Midjourney + RunwayGen2 + Pika + Eleven Lab Project.',
    posterImage: '/images/robot-yellow.png',
    youtubeId: '0YGF0MVKbvc',
  },
  {
    id: 8,
    title: 'Visit Macondo [A Midjourney Experiment]',
    description: 'Midjourney V5 project.',
    posterImage: '/images/woman.png',
    youtubeId: 'whZD8iQOgFM',
  },
  {
    id: 9,
    title: 'Tastless Chambella',
    description: 'Blender 3d project',
    posterImage: '/images/chambella.png',
  },
  {
    id: 10,
    title: 'Famagosta - Music WebGame',
    description: 'Unity 3D WebGame.',
    posterImage: '/images/famagosta.png',
    youtubeId: 'cZKE2LGt6A0',
  },
  {
    id: 11,
    title: 'D.O.A - Music Video',
    description: 'Final Cut Project',
    posterImage: '/images/doa.png',
    youtubeId: 's61KB93Yi-c',
  },
];


